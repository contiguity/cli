import { cli } from './parse.ts'

async function testCLI(args: string[]) {
  console.log('testing CLI with args', args)
  const argv = await cli(args)
  console.log('argv', argv)
  return argv
}

Deno.test('Mock text message', async () => {
  await testCLI(['--mock', '-tn', '+12345678910', '"Hello world!"', '--json'])
})

Deno.test('Check help message', async () => {
  await testCLI(['-h'])
})
