# Contiguity CLI

CLI for interacting with the [Contiguity](https://contiguity.co) API.

## Installation

Install it with `npm install -g contiguity-cli`, or use it without installing
with `npx @contiguity/cli`.

## Usage

Run `contiguity` to see the documentaion on all of the CLI's commands.

## Examples

| Command                                                          | Description                           |
| ---------------------------------------------------------------- | ------------------------------------- |
| `contiguity set-token`                                           | Set token before using other commands |
| `contiguity --number "(234) 567-8910" --text "Hello, world!"`    | Send a text message                   |
| `contiguity -tn +12345678910 "Hello, world!"`                    | Same as above but with shorthands     |
| `contiguity --email "user@example.com" "Hello, world!"`          | Send a basic email                    |
| `contiguity otp "(234) 567-8910"`                                | Verify phone number with OTP          |
| `contiguity quota`                                               | Check your account quota              |
| `CONTIGUITY_NUMBER=2345678910 CONTIGUITY_TEXT=1 contiguity "Hi"` | Set any option with env vars          |
