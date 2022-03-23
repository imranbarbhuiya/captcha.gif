import { randomBytes } from 'node:crypto';
import { colors } from './Colors';
import { allLetters } from './Font';
import { SW } from './Sw';

/**
 * The captcha generator
 */
export class Captcha {
	private readonly numberOfDots: number;
	private readonly gifSize = 17646;
	private readonly letters = 'abcdefghijklmnopqrstuvwxyz';
	private readonly blurImg: boolean;
	private readonly filterImg: boolean;

	public constructor({ numberOfDots = 100, blur = false, filter = false }: Options = {}) {
		this.numberOfDots = numberOfDots;
		this.blurImg = blur;
		this.filterImg = filter;
	}

	/**
	 *
	 * @param min min size
	 * @param max max size
	 * @returns A number between min and max
	 */
	private random(min: number, max: number) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	/**
	 *
	 * @param n The index of the letter
	 * @param pos The position of the letter
	 * @param background The background buffer
	 * @param swr The sw buffer
	 * @param s1 The s1 value
	 * @param s2 The s2 value
	 * @returns The new position of the letter
	 */
	private letter(n: number, pos: number, background: Buffer, swr: Buffer, s1: number, s2: number) {
		const l = background.length;
		const t = allLetters[n];
		let r = 200 * 16 + pos;
		let i = r;
		let sk1 = s1 + pos;
		let sk2 = s2 + pos;
		let mpos = pos;
		let row = 0;

		for (let j = 0, k = t.length; j < k; j++) {
			const p = t[j];
			if (p === -101) continue;

			if (p < 0) {
				if (p === -100) {
					r += 200;
					i = r;
					sk1 = s1 + pos;
					row++;
					continue;
				}
				i += -p;
				continue;
			}

			if (sk1 >= 200) sk1 %= 200;
			const skew = Math.floor(SW[sk1] / 16);
			sk1 += (swr[pos + i - r] & 0x1) + 1;

			if (sk2 >= 200) sk2 %= 200;
			const skewh = Math.floor(SW[sk2] / 70);
			sk2 += swr[row] & 0x1;

			const x = i + skew * 200 + skewh;
			mpos = Math.max(mpos, pos + i - r);

			if (x - l < 70 * 200) background[x] = p << 4;
			i++;
		}

		return mpos;
	}

	/**
	 *
	 * @param background The background buffer
	 * @param swr The sw buffer
	 * @param s1 The s1 value
	 */
	private line(background: Buffer, swr: Buffer, s1: number) {
		for (let x = 0, sk1 = s1; x < 199; x++) {
			if (sk1 >= 200) sk1 %= 200;
			const skew = Math.floor(SW[sk1] / 16);
			sk1 += (swr[x] & 0x3) + 1;
			const i = 200 * (45 + skew) + x;
			background[i + 0] = 0;
			background[i + 1] = 0;
			background[i + 200] = 0;
			background[i + 201] = 0;
		}
	}

	/**
	 *
	 * @param background The background buffer
	 * @param dr The dr buffer
	 */
	private dots(background: Buffer, dr: Buffer) {
		for (let n = 0; n < this.numberOfDots; n++) {
			const v = dr.readUInt32BE(n);
			const i = v % (200 * 67);

			background[i + 0] = 0xff;
			background[i + 1] = 0xff;
			background[i + 2] = 0xff;
			background[i + 200] = 0xff;
			background[i + 201] = 0xff;
			background[i + 202] = 0xff;
		}
	}

	/**
	 *
	 * @param background The background buffer
	 */
	private blur(background: Buffer) {
		for (let i = 0, y = 0; y < 68; y++) {
			for (let x = 0; x < 198; x++) {
				const c11 = background[i + 0];
				const c12 = background[i + 1];
				const c21 = background[i + 200];
				const c22 = background[i + 201];
				background[i++] = Math.floor((c11 + c12 + c21 + c22) / 4);
			}
		}
	}

	/**
	 *
	 * @param background The background buffer
	 */
	private filter(background: Buffer) {
		const om = Buffer.alloc(70 * 200).fill(0xff);
		let i = 0;
		let o = 0;

		for (let y = 0; y < 70; y++) {
			for (let x = 4; x < 200 - 4; x++) {
				if (background[i] > 0xf0 && background[i + 1] < 0xf0) {
					om[o] = 0;
					om[o + 1] = 0;
				} else if (background[i] < 0xf0 && background[i + 1] > 0xf0) {
					om[o] = 0;
					om[o + 1] = 0;
				}

				i++;
				o++;
			}
		}

		om.copy(background);
	}

	/**
	 *
	 * @param size The number of letters
	 * @returns The background buffer and the token
	 */
	private makeCaptcha(size: number) {
		const rb = randomBytes(size + 200 + 100 * 4 + 1 + 1);
		const tb = Buffer.alloc(size);
		const swr = Buffer.alloc(200);
		const dr = Buffer.alloc(100 * 4);

		rb.copy(tb, 0, 0, size);
		rb.copy(swr, 0, size, size + 200);
		rb.copy(dr, 0, size + 200, size + 200 + 100 * 4);
		let s1 = rb.readUInt8(size + 200 + 100 * 4);
		let s2 = rb.readUInt8(size + 200 + 100 * 4 + 1);

		const background = Buffer.alloc(200 * 70).fill(0xff);

		s1 &= 0x7f;
		s2 &= 0x3f;

		let p = 30;

		for (let n = 0; n < size; n++) {
			tb[n] %= 25;
			p = this.letter(tb[n], p, background, swr, s1, s2);
			tb[n] = this.letters.charCodeAt(tb[n]);
		}

		this.line(background, swr, s1);
		this.dots(background, dr);
		if (this.blurImg) this.blur(background);
		if (this.filterImg) this.filter(background);

		return { background, token: tb.toString() };
	}

	/**
	 *
	 * @param background The background buffer
	 * @param gif The gif buffer
	 * @param color The color of the text
	 *
	 */
	private makeGif(background: Buffer, gif: Buffer, color?: Color) {
		const r = color ?? (this.random(0, colors.length) as Color);
		gif.fill(colors[r].replace(/\n/g, ''), 0, 13 + 48 + 10 + 1, 'ascii');

		let i = 0;
		let p = 13 + 48 + 10 + 1;
		for (let y = 0; y < 70; y++) {
			gif[p++] = 250; // Data length 5*50=250
			for (let x = 0; x < 50; x++) {
				const a = background[i + 0] >> 4;
				const b = background[i + 1] >> 4;
				const c = background[i + 2] >> 4;
				const d = background[i + 3] >> 4;

				gif[p + 0] = 16 | (a << 5); // bbb10000
				gif[p + 1] = (a >> 3) | 64 | (b << 7); // b10000xb
				gif[p + 2] = b >> 1; // 0000xbbb
				gif[p + 3] = 1 | (c << 1); // 00xbbbb1
				gif[p + 4] = 4 | (d << 3); // xbbbb100
				i += 4;
				p += 5;
			}
		}

		gif.fill('\x01\x11\x00;', this.gifSize - 4);
	}

	/**
	 *
	 * @param size The number of letters
	 * @param color The color of the text
	 * @returns The gif buffer and the token
	 */
	public generate(size = 5, color?: Color) {
		const buffer = Buffer.alloc(this.gifSize);
		const { background, token } = this.makeCaptcha(size);
		this.makeGif(background, buffer, color);

		return {
			buffer,
			token,
		};
	}
}

/**
 * The options for the captcha constructor
 */
export interface Options {
	numberOfDots?: number;
	blur?: boolean;
	filter?: boolean;
}

export type Color = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17;
