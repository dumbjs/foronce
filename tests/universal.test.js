import { test } from 'uvu'
import * as assert from 'uvu/assert'
import {
  generateTOTPSecret,
  isTOTPValid,
  totp,
} from '../src/universal/universal.ts'

test('generate 2 different secrets', async () => {
  const secret = generateTOTPSecret()
  const secret2 = generateTOTPSecret()
  assert.not.equal(secret, secret2)
})

test('dynamic isValid', async () => {
  const secret = generateTOTPSecret()
  const period = 60
  const opts = {
    period: period,
  }
  const otp = await totp(secret, undefined, opts)
  assert.ok(await isTOTPValid(secret, otp, opts))
})

test('static is valid', async () => {
  const secret = 'JFLVYRQGJ5ZFOLSYO5HVOWIZGAYHOCTEGNLE2JYMNAMTCET3A5VQ===='
  const d = 1704875845134
  const otp = await totp(secret, d / 1000)
  assert.equal(otp, '' + 881718)
})

test.run()
