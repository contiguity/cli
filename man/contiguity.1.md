% contiguity(1)

<!-- Preview with the command `deno task preview-docs` -->

# NAME

**contiguity** - command-line interface to interact with Contiguity’s API

# SYNOPSIS

<!-- deno-fmt-ignore-start -->
| **contiguity**<br>
| **contiguity** \[**-kmdhv**] \[**-tn** _number_] \[**-e** _email_ \[**-s** _subject_] \[**-f** _sender_] \[**-H**] \[**-r** _email_]] "_message_"<br>
| **contiguity** \[**-kmdhv**] **otp** \[**-n** _name_] \[**-l** _language_] _number_<br>
| **contiguity** \[**-kmdhv**] **otp** send \[**-n** _name_] \[**-l** _language_] _number_<br>
| **contiguity** \[**-kmdhv**] **otp** verify _otp-id_ _otp_<br>
| **contiguity** \[**-kmdhv**] **set-token** \[_token_]<br>
| **contiguity** \[**-kmdhv**] **clear-token**<br>
| **contiguity** \[**-kmdhv**] **check-token**<br>
| **contiguity** \[**-kmdhv**] **quota**
<!-- deno-fmt-ignore-end -->

# DESCRIPTION

**contiguity** is a command-line interface to interact with
[Contiguity’s API](https://contiguity.co/). It can be used to send text messages
and emails, verify phone numbers by sending them an OTP, with more features
coming soon. It is written in TypeScript and is published to NPM as
**`@use-contiguity/cli`**. You can install or uninstall it with NPM:

```sh
npm i -g @use-contiguity/cli
npm r -g @use-contiguity/cli
```

Run **`contiguity set-token`** to interactively set your token before using any
other commands. Once you have done that, you can send a text message with a
command like this:

```sh
contiguity -tn "(555) 555-5555" "Hello, world!"
```

Note that, if your message contains spaces, you will need to quote it. You can
also send an email with a command like this:

```sh
contiguity -e "user@domain.example" "Hello, world!"
```

If you have a phone number that you want to verify, you can send it an OTP and
interactively verify it with a command like this:

```sh
contiguity otp -n "MyTool" "(555) 555-5555"
```

You can also use the **`contiguity otp send`** and **`contiguity otp verify`**
subcommands to programmatically send and verify OTPs.

# OPTIONS

Options can be specified in any order, and can be specified at any point in the
command. Every option can be specified with a short or long name, and short
names can be combined. For example, "**`--number +15555555555 --text`**" can be
written as "**`-tn +15555555555`**". A boolean option in long form can be
prefixed with **no-** to negate it. For example, you can disable a
**CONTIGUITY_TEXT=1** environment variable with **--no-text**.

## Global options

These options can be used with any command or subcommand in the CLI.

-k, --token _token_

: Your Contiguity token. Defaults to the token stored with **contiguity
set-token**. Tokens can be generated at https://contiguity.co/dashboard/tokens.
You should always use a revokable token, see SECURITY for details. You can also
use the special value "**`mock`**" to activate the **--mock** mode.

-m, --mock

: Use mock data instead of making any API requests. This is useful for testing
the CLI without actually doing anything. With this mode, a token is not
required, and no web requests will be made. This mode can also be activated by
setting the token to "**`mock`**".

-d, --debug

: Print debug information about what the CLI is doing.

-h, --help

: Show a detailed help message for any command.

-v, --version

: Print the version of the CLI.

## Phone options

These options are used for sending messages to a phone number.

**-n**, **--number** _number_

: The phone number to send the text message to. You can use any format for the
phone number, and it will be parsed by the **phone** NPM package. If your number
has spaces, you will need to quote it.

**-t**, **--text**

: Send the message as a text message specified by **--number**. Requires
**--number**. This is seperate from **--number** because, in the future, you
will be able to call as well as send texts.

## Email options

These options are used for sending messages to an email address.

**-e**, **--email** _email_

: Send an email to the provided email address.

**-s**, **--subject** _subject_

: The subject of the email. If it contains spaces, you will need to quote it.
Defaults to "Email from Contiguity CLI". Requires **--email**.

**-f**, **--from** _sender_

: The sender of the email. This shows up as the name of the sender in the email
client. Defaults to "Contiguity CLI". Requires **--email**.

**-H**, **--html**

: Send the message as HTML. Without this option, defaults to sending a plain
text email. Requires **--email**.

**-r**, **--replyto** _email_

: The email address to use as the reply-to address. If the recipient replies to
the email, it will be sent to this address. Requires **--email**.

## OTP options

**-n**, **--name** _name_

: The name of the service to use in the text message. Defaults to "Contiguity".

**-l, --language** _language_

: The two-letter language code to send tne text message in. Defaults to "en".

# ENVIRONMENT

Any option can be set with an environment variable by capitalizing and prefixing
it with **`CONTIGUITY_`**. For example, **--token** can be set with
**`CONTIGUITY_TOKEN`**. You could also set **`CONTIGUITY_NUMBER=+15555555555`**
and **`CONTIGUITY_TEXT=1`** at the beginning of a script so that you can send a
text message with just **`contiguity "Hello, World!"`**.

# FILES

**~/.contiguity/token**

: The token used by the CLI. This is set with **contiguity set-token**. If this
file contains the special value "**`mock`**", the CLI will use the **--mock**
mode unless overridden.

# SECURITY

The CLI stores your token in plaintext in the file **~/.contiguity/token**. If
an attacker has gained access to your computer, they will be able to access any
token stored on it, regardless of any protections we could have put in place.
You should always use a revokable token, and revoke it if you think it has been
compromised. You can generate a revokable token at
https://contiguity.co/dashboard/tokens. If this storage is a concern for you,
you can use the **--token** option or the **CONTIGUITY_TOKEN** environment
variable to specify your token.

# EXAMPLES

**contiguity set-token**

: Interactively set your token to connect your account before running any
commands.

**contiguity --number "(555) 555-5555" --text "Hello, world!"**

: Send a **Hello, world!** text message to the number **(555) 555-5555**.

**contiguity -tn +12345678910 "Hello, world!"**

: Same as above, using shorthand options.

**contiguity --email "user@domain.example" "Hello, world!"**

: Send a basic **Hello, world!** email to **user@domain.example**.

**contiguity otp "(555) 555-5555"**

: Interactively verify the phone number **(555) 555-5555** by sending it an OTP,
prompting for it, and verifying it.

**contiguity quota**

: Get your total and remaining quotas as well as other account information.

# REPORTING BUGS

If you find any bugs in the CLI, you can report them at
https://github.com/use-contiguity/cli/issues/new. If the API is returning a 5XX
error and the issue is not marked as "Investigating" on
https://status.contiguity.co, please report it by emailing
**support@contiguity.co** or on the Discord server
(https://discord.gg/pCuTaY84Vy).

# SEE ALSO

[CLI documentation](https://docs.contiguity.co/#/cli/),
[Git repository](https://github.com/use-contiguity/cli)