<p align='center'><img src="https://contiguity.co/assets/icon-black.png" height="150px"/></p>
<h1 align='center'>Contiguity CLI</h1>

<p align='center'>
    <img display="inline-block" src="https://img.shields.io/npm/v/@contiguity/cli?style=for-the-badge" /> <img display="inline-block" src="https://img.shields.io/bundlephobia/minzip/@contiguity/cli?style=for-the-badge" /> <img display="inline-block" src="https://img.shields.io/badge/Made%20with-TypeScript-blue?style=for-the-badge" />
</p>
<p align='center'>Contiguity CLI provides a command-line interface to interact with Contiguity’s API.</p>

Read more about using the CLI in the docs, at
[docs.contiguity.co](https://docs.contiguity.co/#/cli/).

## Installation

Using Contiguity CLI requires Node.js to be installed.

You can install the Contiguity CLI globally using the following command:

```bash
$ npm install -g contiguity-cli
```

## Setup

Before using other commands, set your Contiguity API token using the following
command:

```bash
$ contiguity set-token
```

## Building

Deno, Node.js, and Pandoc are required to build the CLI. To install them, run
the following commands:

```bash
# Windows
$ winget install DenoLand.Deno OpenJS.NodeJS JohnMacFarlane.Pandoc
# macOS
$ brew install deno node pandoc
# Ubuntu, Debian, and derivatives
$ sudo apt install nodejs pandoc && curl -fsSL https://deno.land/install.sh | sh
# Arch Linux, Manjaro, and derivatives
$ sudo pacman -S deno nodejs pandoc
# Red Hat, Fedora, and derivatives
$ sudo dnf install nodejs pandoc && curl -fsSL https://deno.land/install.sh | sh
# Void Linux
$ sudo xbps-install nodejs pandoc && curl -fsSL https://deno.land/install.sh | sh
```

Then, run the following command to build the CLI:

```bash
deno task build
```

The built CLI will be in `./npm`. You can test it by running `npm i -g ./npm` to
install the built CLI globally.

If you have a `man` program on your system (aka you aren't on Windows), you can
also run this command to build and preview the man page:

```bash
deno task preview-man
```

You can run the cli without building it by running this command:

```bash
deno task cli --help
```
