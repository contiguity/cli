import { build, emptyDir } from 'dnt'

await emptyDir('./npm')

await build({
  entryPoints: [
    './src/mod.ts',
    {
      kind: 'bin',
      name: 'contiguity',
      path: './src/cli.ts',
    },
    {
      kind: 'bin',
      name: '@contiguity/cli',
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
    name: '@contiguity/cli',
    description: '',
    version: '1.0.1',
    repository: {
      'type': 'git',
      'url': 'git+https://github.com/use-contiguity/cli.git',
    },
    author: 'Contiguity',
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
