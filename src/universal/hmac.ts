import { subtle } from 'uncrypto'

const algoMap = {
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  sha512: 'SHA-512',
}

export type AlgoEnum = 'sha1' | 'sha256' | 'sha512'

export async function createHmac(
  algorithm: AlgoEnum,
  secret: string,
  data: Buffer
) {
  const secretBuffer = !Buffer.isBuffer(secret) ? Buffer.from(secret, 'utf-8') : secret;
  const key = await subtle.importKey(
    'raw', // raw format of the key - should be Uint8Array
    secretBuffer,
    {
      // algorithm details
      name: 'HMAC',
      hash: { name: algoMap[algorithm] },
    },
    false, // export = false
    ['sign', 'verify'] // what this key can do
  )
  const signature = await subtle.sign('HMAC', key, data)
  return Buffer.from(signature)
}
