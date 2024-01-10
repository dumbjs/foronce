import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { decode, encode } from '../src/base32.js'

test('Basic Test Vector', () => {
  assert.equal(encode(''), '')
  assert.equal(encode('f'), 'MY======')
  assert.equal(encode('fo'), 'MZXQ====')
  assert.equal(encode('foo'), 'MZXW6===')
  assert.equal(encode('foob'), 'MZXW6YQ=')
  assert.equal(encode('fooba'), 'MZXW6YTB')
  assert.equal(encode('foobar'), 'MZXW6YTBOI======')
  assert.equal(encode('foobar foobar'), 'MZXW6YTBOIQGM33PMJQXE===')
})

test('Basic Test Vector - Decode', () => {
  assert.equal(decode(''), '')
  assert.equal(decode('MY======'), 'f')
  assert.equal(decode('MZXQ===='), 'fo')
  assert.equal(decode('MZXW6==='), 'foo')
  assert.equal(decode('MZXW6YQ='), 'foob')
  assert.equal(decode('MZXW6YTB'), 'fooba')
  assert.equal(decode('MZXW6YTBOI======'), 'foobar')
  assert.equal(decode('MZXW6YTBOIQGM33PMJQXE==='), 'foobar foobar')
})

test.run()
