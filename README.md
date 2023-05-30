<div align="center">

# captcha.gif

**A simple captcha generator for nodejs.**

[![npm](https://img.shields.io/npm/dw/captcha.gif)](https://www.npmjs.com/package/captcha.gif)
[![codecov](https://codecov.io/gh/imranbarbhuiya/captcha.gif/branch/main/graph/badge.svg)](https://codecov.io/gh/imranbarbhuiya/captcha.gif)
[![npm](https://img.shields.io/npm/v/captcha.gif?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/captcha.gif)

</div>

## Description

A simple lightweight captcha generator for nodejs.

Impliments [captcha generator in C](http://brokestream.com/captcha.html) in js.

Read TypeDoc generated Documentation [here](https://imranbarbhuiya.github.io/captcha.gif/).

## Features

-   Written In Typescript
-   Offers CJS, ESM builds
-   Full TypeScript & JavaScript support

## Install

```bash
# npm
npm i captcha.gif

# yarn
yarn add captcha.gif

```

## Usage

```ts
import { Captcha } from 'captcha.gif';
```

```js
const { Captcha } = require('captcha.gif');
```

### Generate Captcha

```ts
const captcha = new Captcha();

const { token, buffer } = captcha.generate();
```

## Buy me some doughnuts

If you want to support me by donating, you can do so by using any of the following methods. Thank you very much in advance!

<a href="https://www.buymeacoffee.com/parbez" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
<a href='https://ko-fi.com/Y8Y1CBIJH' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi4.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Contributors ✨

Thanks goes to these wonderful people:

<a href="https://github.com/imranbarbhuiya/TagScript/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=imranbarbhuiya/TagScript" />
</a>
