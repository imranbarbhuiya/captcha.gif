<div align="center">

# captcha.gif

**A simple captcha generator for nodejs.**

[![GitHub](https://badgen.net/github/license/imranbarbhuiya/captcha.gif?icon=github)](https://github.com/imranbarbhuiya/captcha.gif/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/imranbarbhuiya/captcha.gif/branch/main/graph/badge.svg?token=token)](https://codecov.io/gh/imranbarbhuiya/captcha.gif)
[![npm](https://badgen.net/npm/v/captcha.gif?icon=npm)](https://www.npmjs.com/package/captcha.gif)

</div>

## Description

A simple lightweight captcha generator for nodejs.

Read Full Documentation [here](https://captcha-gif.js.org/).

## Features

- Written In Typescript
- Offers CJS, ESM builds
- Full TypeScript & JavaScript support

## Install

```bash
# npm
npm i captcha.gif

# yarn
yarn add captcha.gif

```

## Usage

**Note:** While examples uses `import`, it maps 1:1 with CommonJS' require syntax. For example, `import { package } from 'package-name'` is the same as `const { mahrin } = require('template')`.

```ts
import { Captcha } from 'captcha.gif';
```

### Generate Captcha

```ts
import { Captcha } from 'captcha.gif';

const captcha = new Captcha();

const { token, buffer } = captcha.generate();
```

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
