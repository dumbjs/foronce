/*!
 * base-32.js
 * Copyright(c) 2024 Reaper
 * MIT Licensed
 */

/**
 * Simplified implementation of TOTP with existing node libs
 *
 * helpers to handle the following
 * - generate QR codes with the otpauth:// URL scheme
 * - algo and implmentation taken from https://drewdevault.com/2022/10/18/TOTP-is-easy.html
 */
import { createHmac, randomBytes } from 'node:crypto'
import { Buffer } from 'buffer'
import { decode, encode } from './base32.js'

const { floor } = Math

/**
 *
 * @param {string} secret
 * @param {number} when
 * @param {object} [options]
 * @param {number} [options.period] in seconds (eg: 30 => 30 seconds)
 * @param {"sha1" | "sha256" | "sha512"} [options.algorithm] (default: sha512)
 * @returns {string}
 */
export function totp(secret, when = floor(Date.now() / 1000), options = {}) {
  const _options = Object.assign({ period: 30, algorithm: 'sha512' }, options)
  const now = floor(when / _options.period)
  const key = decode(secret)
  const buff = bigEndian64(BigInt(now))
  const hmac = createHmac(_options.algorithm, key).update(buff).digest()
  const offset = hmac[hmac.length - 1] & 0xf
  const truncatedHash = hmac.subarray(offset, offset + 4)
  const otp = (
    (truncatedHash.readInt32BE() & 0x7f_ff_ff_ff) %
    1_000_000
  ).toString(10)
  return otp.length < 6 ? `${otp}`.padStart(6, '0') : otp
}

/**
 * @param {string} secret
 * @param {string} token
 * @param {object} [options]
 * @param {number} [options.period] in seconds (eg: 30 => 30 seconds)
 * @param {"sha1" | "sha256" | "sha512"} [options.algorithm] (default: sha512)
 * @returns {boolean}
 */
export function isTOTPValid(secret, token, options = {}) {
  const _options = Object.assign({ period: 30, algorithm: 'sha512' }, options)
  for (let index = -2; index < 3; index += 1) {
    const fromSys = totp(secret, Date.now() / 1000 + index, _options)
    const valid = fromSys === token
    if (valid) return true
  }
  return false
}

/**
 * @param {string} secret
 * @param {object} options
 * @param {string} options.company
 * @param {string} options.email
 * @returns {string}
 */
export function generateTOTPURL(secret, options) {
  const parameters = new URLSearchParams()
  parameters.append('secret', secret)
  parameters.append('issuer', options.company)
  parameters.append('digits', '6')
  const url = `otpauth://totp/${options.company}:${
    options.email
  }?${parameters.toString()}`
  return new URL(url).toString()
}

/**
 * @param {bigint} hash
 * @returns {Buffer}
 */
function bigEndian64(hash) {
  const buf = Buffer.allocUnsafe(64 / 8)
  buf.writeBigInt64BE(hash, 0)
  return buf
}

export function generateTOTPSecret(num = 32) {
  return encode(randomBytes(num).toString('ascii'))
}
