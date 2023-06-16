import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts"

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
    deno: true,
    undici: true,
    prompts: true,
  },
  scriptModule: false,
  package: {
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
    // TODO: get this mapping to work (reduces code size by a lot)
    //'https://deno.land/x/yargs@17.7.2-deno/deno.ts': {
    //  name: 'yargs',
    //  version: '^17.7.2',
    //},
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync('LICENSE', 'npm/LICENSE')
    Deno.copyFileSync('README.md', 'npm/README.md')
  },
})