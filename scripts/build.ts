import { build, emptyDir, type EntryPoint } from 'dnt'
import { join } from 'std/path/mod.ts'
import denoJson from '../deno.json' with { type: 'json' }
const outDir = denoJson.build.outDir

await emptyDir(outDir)

await build({
  entryPoints: denoJson.build.entryPoints as (string | EntryPoint)[],
  outDir: outDir,
  shims: {
    deno: true,
    undici: true,
    prompts: true,
  },
  scriptModule: false,
  importMap: 'deno.json',
  package: {
    name: denoJson.name,
    description: denoJson.description,
    version: denoJson.version,
    repository: {
      'type': 'git',
      'url': `git+${denoJson.repository}.git`,
    },
    license: denoJson.license,
    bugs: {
      url: `${denoJson.repository}/issues`,
    },
    homepage: denoJson.documentation,
    devDependencies: denoJson.build.devDependencies,
    man: denoJson.build.man,
  },
  mappings: denoJson.build.moduleMappings,
  postBuild() {
    // steps to run after building and before running the tests

    for (const [source, target] of Object.entries(denoJson.build.copiedFiles)) {
      Deno.copyFileSync(source, join(outDir, target))
    }
  },
})
