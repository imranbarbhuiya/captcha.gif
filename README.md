<div align="center">

# captcha.gif

**A simple captcha generator for nodejs.**

[![GitHub](https://badgen.net/github/license/imranbarbhuiya/captcha.gif?icon=github)](https://github.com/imranbarbhuiya/captcha.gif/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/imranbarbhuiya/captcha.gif/branch/main/graph/badge.svg?token=token)](https://codecov.io/gh/imranbarbhuiya/captcha.gif)
[![npm](https://badgen.net/npm/v/captcha.gif?icon=npm)](https://www.npmjs.com/package/captcha.gif)

</div>

## Description

A simple lightweight captcha generator for nodejs.

Impliments [captcha generator in C](http://brokestream.com/captcha.html) in js.

Read TypeDoc generated Documentation [here](https://captcha-gif.js.org/).

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

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/imranbarbhuiya"><img src="https://avatars.githubusercontent.com/u/74945038?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Parbez</b></sub></a><br /><a href="https://github.com/imranbarbhuiya/captcha.gif/commits?author=imranbarbhuiya" title="Code">💻</a> <a href="#maintenance-imranbarbhuiya" title="Maintenance">🚧</a> <a href="#ideas-imranbarbhuiya" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://renovate.whitesourcesoftware.com"><img src="https://avatars.githubusercontent.com/u/25180681?v=4?s=100" width="100px;" alt=""/><br /><sub><b>WhiteSource Renovate</b></sub></a><br /><a href="#maintenance-renovate-bot" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
