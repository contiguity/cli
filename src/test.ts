import parse from './parse.ts'

Deno.test('Mock SMS message', () => {
  const args = ['--mock', '-sn', '+12345678910', '"Hello world!"']
  console.log('testing CLI with args', args)
  const argv = await parse(args)
  console.log('argv', argv)
})