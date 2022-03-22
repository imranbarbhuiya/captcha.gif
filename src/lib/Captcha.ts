import { randomBytes } from 'node:crypto';
import { colors } from './Colors';
import { lt } from './Font';
import { SW } from './Sw';

export class Captcha {
	private readonly numberOfDots;
	private readonly gifSize = 17646;
	private readonly letters = 'abcdafahijklmnopqrstuvwxyz';
	private readonly blurImg;
	private readonly filterImg;
	public constructor({ numberOfDots = 100, blur = false, filter = false }: Options = {}) {
		this.numberOfDots = numberOfDots;
		this.blurImg = blur;
		this.filterImg = filter;
	}

	private random(min: number, max: number) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	private letter(n: number, pos: number, im: Buffer, swr: Buffer, s1: number, s2: number) {
		const l = im.length;
		const t = lt[n];
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

			if (x - l < 70 * 200) im[x] = p << 4;
			i++;
		}

		return mpos;
	}

	private line(im: Uint8Array, swr: Buffer, s1: number) {
		for (let x = 0, sk1 = s1; x < 199; x++) {
			if (sk1 >= 200) sk1 %= 200;
			const skew = Math.floor(SW[sk1] / 16);
			sk1 += (swr[x] & 0x3) + 1;
			const i = 200 * (45 + skew) + x;
			im[i + 0] = 0;
			im[i + 1] = 0;
			im[i + 200] = 0;
			im[i + 201] = 0;
		}
	}

	private dots(im: Buffer, dr: Buffer) {
		for (let n = 0; n < this.numberOfDots; n++) {
			const v = dr.readUInt32BE(n);
			const i = v % (200 * 67);

			im[i + 0] = 0xff;
			im[i + 1] = 0xff;
			im[i + 2] = 0xff;
			im[i + 200] = 0xff;
			im[i + 201] = 0xff;
			im[i + 202] = 0xff;
		}
	}

	private blur(im: Buffer) {
		for (let i = 0, y = 0; y < 68; y++) {
			for (let x = 0; x < 198; x++) {
				const c11 = im[i + 0];
				const c12 = im[i + 1];
				const c21 = im[i + 200];
				const c22 = im[i + 201];
				im[i++] = Math.floor((c11 + c12 + c21 + c22) / 4);
			}
		}
	}

	private filter(im: Buffer) {
		const om = Buffer.alloc(70 * 200).fill(0xff);
		let i = 0;
		let o = 0;

		for (let y = 0; y < 70; y++) {
			for (let x = 4; x < 200 - 4; x++) {
				if (im[i] > 0xf0 && im[i + 1] < 0xf0) {
					om[o] = 0;
					om[o + 1] = 0;
				} else if (im[i] < 0xf0 && im[i + 1] > 0xf0) {
					om[o] = 0;
					om[o + 1] = 0;
				}

				i++;
				o++;
			}
		}

		om.copy(im);
	}

	public makeCaptcha(size: number) {
		const rb = randomBytes(size + 200 + 100 * 4 + 1 + 1);
		const token = Buffer.alloc(size);
		const swr = Buffer.alloc(200);
		const dr = Buffer.alloc(100 * 4);
		let s1;
		let s2;

		rb.copy(token, 0, 0, size);
		rb.copy(swr, 0, size, size + 200);
		rb.copy(dr, 0, size + 200, size + 200 + 100 * 4);
		s1 = rb.readUInt8(size + 200 + 100 * 4);
		s2 = rb.readUInt8(size + 200 + 100 * 4 + 1);

		const im = Buffer.alloc(200 * 70).fill(0xff);

		s1 &= 0x7f;
		s2 &= 0x3f;

		let p = 30;

		for (let n = 0; n < size; n++) {
			token[n] %= 25;
			p = this.letter(token[n], p, im, swr, s1, s2);
			token[n] = this.letters.charCodeAt(token[n]);
		}

		this.line(im, swr, s1);
		this.dots(im, dr);
		if (this.blurImg) this.blur(im);
		if (this.filterImg) this.filter(im);

		return { im, token: token.toString() };
	}

	// http://brokestream.com/captcha.html
	private makeGif(im: Buffer, gif: Buffer, style?: number) {
		// tag ; widthxheight ; GCT:0:0:7 ; bgcolor + aspect // GCT
		// Image Separator // left x top // widthxheight // Flags
		// LZW code size
		const r = style ?? this.random(0, colors.length);
		gif.fill(colors[r].replace(/\n/g, ''), 0, 13 + 48 + 10 + 1, 'ascii');

		let i = 0;
		let p = 13 + 48 + 10 + 1;
		for (let y = 0; y < 70; y++) {
			gif[p++] = 250; // Data length 5*50=250
			for (let x = 0; x < 50; x++) {
				const a = im[i + 0] >> 4;
				const b = im[i + 1] >> 4;
				const c = im[i + 2] >> 4;
				const d = im[i + 3] >> 4;

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

	public generate(size = 5, style?: number) {
		const buffer = Buffer.alloc(this.gifSize);
		const { im, token } = this.makeCaptcha(size);
		this.makeGif(im, buffer, style);

		return {
			buffer,
			token,
		};
	}
}

export interface Options {
	numberOfDots?: number;
	blur?: boolean;
	filter?: boolean;
}
