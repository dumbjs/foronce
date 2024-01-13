import { subtle } from 'uncrypto'

const algoMap = {
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  sha512: 'SHA-512',
}

export async function createHmac(algorithm, secret, data) {
  const key = await subtle.importKey(
    'raw', // raw format of the key - should be Uint8Array
    secret,
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
