import { build, emptyDir } from 'https://deno.land/x/dnt/mod.ts'

await emptyDir('./npm')

await build({
  entryPoints: [
    './mod.ts',
    {
      kind: 'bin',
      name: 'contiguity',
      path: './cli.ts',
  }],
  outDir: './npm',
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // 'libphonenumber-js': '^1.10.34'
    name: 'contiguity-cli',
    description: '',
    version: '1.0.0',
    repository: {
      'type': 'git',
      'url': 'git+https://github.com/jerbear2008/contiguity-cli.git'
    },
    author: 'jerbear4328',
    license: 'MIT',
    bugs: {
      url: 'https://github.com/jerbear2008/contiguity-cli/issues'
    },
    homepage: 'https://github.com/jerbear2008/contiguity-cli#readme',
  },
  mappings: {
    'https://deno.land/x/yargs/deno.ts': {
      name: 'yargs',
      version: '^17.7.2',
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync('LICENSE', 'npm/LICENSE')
    Deno.copyFileSync('README.md', 'npm/README.md')
  },
})