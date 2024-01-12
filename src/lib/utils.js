/**
 * @param {bigint} hash
 * @returns {Buffer}
 */
export function bigEndian64(hash) {
  const buf = Buffer.allocUnsafe(64 / 8)
  buf.writeBigInt64BE(hash, 0)
  return buf
}
