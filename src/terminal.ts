import * as colors from 'std/fmt/colors.ts'

const art = {
  //   banner: { // kinda doesn't work in VSCode's integrated terminal
  //     text: `\
  // ${colors.bgWhite(colors.black('                                                                   '))}
  // ${colors.bgWhite(colors.black(`       ___         _   _           _ _         ${colors.blue('  ___ _    ___ ')}     `))}
  // ${colors.bgWhite(colors.black(`      / __|___ _ _| |_(_)__ _ _  _(_) |_ _  _  ${colors.blue(' / __| |  |_ _|')}     `))}
  // ${colors.bgWhite(colors.black(`     | (__/ _ \\ ' \\  _| / _\` | || | |  _| || | ${colors.blue('| (__| |__ | | ')}     `))}
  // ${colors.bgWhite(colors.black(`      \\___\\___/_||_\\__|_\\__, |\\_,_|_|\\__|\\_, | ${colors.blue(' \\___|____|___|')}     `))}
  // ${colors.bgWhite(colors.black('                        |___/            |__/                      '))}
  // ${colors.bgWhite(colors.black('                                                                   '))}
  // `,
  //     width: 67,
  //   },
  big: {
    text: `\
   ___         _   _           _ _         ${
      colors.brightBlue('  ___ _    ___  ')
    }
  / __|___ _ _| |_(_)__ _ _  _(_) |_ _  _  ${
      colors.brightBlue(' / __| |  |_ _| ')
    }
 | (__/ _ \\ ' \\  _| / _\` | || | |  _| || | ${
      colors.brightBlue('| (__| |__ | |  ')
    }
  \\___\\___/_||_\\__|_\\__, |\\_,_|_|\\__|\\_, | ${
      colors.brightBlue(' \\___|____|___| ')
    }
                    |___/            |__/                  
`,
    width: 59,
  },
  medium: {
    text: `\
   ___         _   _           _ _         
  / __|___ _ _| |_(_)__ _ _  _(_) |_ _  _  
 | (__/ _ \\ ' \\  _| / _\` | || | |  _| || | 
  \\___\\___/_||_\\__|_\\__, |\\_,_|_|\\__|\\_, | 
                    |___/            |__/  
                    
`,
    width: 43,
  },
  small: {
    text: `Contiguity ${colors.brightBlue('CLI')}`,
    width: 14,
  },
}
export function getArt(targetWidth = terminalWidth()) {
  if (targetWidth === null) return art.medium

  for (const { text, width } of Object.values(art)) {
    if (width < targetWidth) return text
  }
  return art.small.text
}

// dnt-shim-ignore
// deno-lint-ignore no-explicit-any
const processSupported = !!(globalThis as any)?.process
export function terminalWidth() {
  try {
    if (processSupported) {
      // dnt-shim-ignore
      // deno-lint-ignore no-explicit-any
      const nodeWidth = (globalThis as any).process?.stdout?.columns as
        | number
        | undefined
      if (nodeWidth) return nodeWidth
    } else {
      // dnt-shim-ignore
      // deno-lint-ignore no-explicit-any
      return ((globalThis as any).Deno.consoleSize() as {
        rows: number
        columns: number
      }).columns
    }
  } catch {
    // error in getting terminal width
  }
  return null
}
