import { build, emptyDir } from 'dnt'

await emptyDir('./npm')

await build({
  entryPoints: [
    {
      kind: 'bin',
      name: 'contiguity',
      path: './src/cli.ts',
    },
    {
      kind: 'bin',
      name: '@jerbear4328/contiguity-cli',
      path: './src/cli.ts',
    },
  ],
  outDir: './npm',
  shims: {
    deno: true,
    undici: true,
    prompts: true,
  },
  scriptModule: false,
  importMap: 'deno.json',
  package: {
    name: '@jerbear4328/contiguity-cli',
    description: '',
    version: '1.0.2',
    repository: {
      'type': 'git',
      'url': 'git+https://github.com/use-contiguity/cli.git',
    },
    author: 'jerbear4328',
    license: 'MIT',
    bugs: {
      url: 'https://github.com/use-contiguity/cli/issues',
    },
    homepage: 'https://github.com/use-contiguity/cli#readme',
    devDependencies: {
      '@types/yargs': '^17.0.24',
    },
  },
  mappings: {
    // TODO: get this mapping to work (reduces code size)
    'https://deno.land/x/yargs@v17.7.2-deno/deno.ts': {
      name: 'yargs',
      version: '^17.7.2',
    },
    'https://esm.sh/v125/@types/yargs@17.0.24/index.d.ts': {
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
