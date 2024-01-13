import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { generateTOTPSecret } from '../src/index.js'
import { createHmac } from '../src/lib/crypto.js'
import { createHmac as nodeCreateHmac } from 'node:crypto'
import { bigEndian64 } from '../src/lib/utils.js'
import { decode } from '../src/base32.js'

test('test if internal utility and subtle return the same result', async () => {
  const secret = generateTOTPSecret()
  const key = decode(secret)
  const buff = bigEndian64(BigInt(Math.floor(Date.now() / 1000 / 30)))
  const buffer = await createHmac('sha1', key, buff)
  const nodeBuffer = nodeCreateHmac('sha1', key).update(buff).digest()
  assert.equal(buffer.toString('ascii'), nodeBuffer.toString('ascii'))
})

test.run()
