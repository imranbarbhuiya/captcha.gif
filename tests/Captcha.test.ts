import { Captcha } from '../src';

describe('Captcha', () => {
	const captcha = new Captcha();

	test('generate should return a token and a buffer', () => {
		const { token, buffer } = captcha.generate(4);

		expect(token).toBeDefined();
		expect<string>(typeof token).toBe('string');
		expect<Buffer>(buffer).toBeInstanceOf(Buffer);
	});

	test('generate buffer with length 17646', () => {
		const { buffer } = captcha.generate(4);

		expect(buffer.length).toBe(17646);
	});

	test('GIVEN no size THEN return length 5 token', () => {
		const { token } = captcha.generate();

		expect<string>(typeof token).toBe('string');
		expect(token.length).toBe(5);
	});

	test('GIVEN size THEN return length size token', () => {
		const { token } = captcha.generate(10);

		expect<string>(typeof token).toBe('string');
		expect(token.length).toBe(10);
	});
});
