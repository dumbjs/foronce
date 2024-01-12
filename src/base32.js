/*!
 * base-32.js
 * Copyright(c) 2024 Reaper
 * MIT Licensed
 */

// Simple implementation based of RFC 4648 for base32 encoding and decoding

const pad = '='
const base32alphaMap = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
]

/**
 * @param {string} str
 */
export const encode = str => {
  const splits = str.split('')

  if (!splits.length) {
    return ''
  }

  let binaryGroup = []
  let bitText = ''

  splits.forEach(c => {
    bitText += toBinary(c)

    if (bitText.length == 40) {
      binaryGroup.push(bitText)
      bitText = ''
    }
  })

  if (bitText.length > 0) {
    binaryGroup.push(bitText)
    bitText = ''
  }

  return binaryGroup
    .map(x => {
      let fiveBitGrouping = []
      let lex = ''
      let bitOn = x

      bitOn.split('').forEach(d => {
        lex += d
        if (lex.length == 5) {
          fiveBitGrouping.push(lex)
          lex = ''
        }
      })

      if (lex.length > 0) {
        fiveBitGrouping.push(lex.padEnd(5, '0'))
        lex = ''
      }

      let paddedArray = Array.from(fiveBitGrouping)
      paddedArray.length = 8
      paddedArray = paddedArray.fill('-1', fiveBitGrouping.length, 8)

      return paddedArray
        .map(f => {
          if (f == '-1') {
            return pad
          }
          return base32alphaMap[parseInt(f, 2).toString(10)]
        })
        .join('')
    })
    .join('')
}

/**
 * @param {string} str
 * @returns
 */
export const decode = str => {
  const overallBinary = str
    .split('')
    .map(x => {
      if (x === pad) {
        return '00000'
      }
      const decodeIndex = base32alphaMap.indexOf(x)
      const binary = decodeIndex.toString(2)
      return binary.padStart(5, '0')
    })
    .join('')

  const characterBitGrouping = chunk(overallBinary.split(''), 8)
  return characterBitGrouping
    .map(x => {
      const binaryL = x.join('')
      const str = String.fromCharCode(+parseInt(binaryL, 2).toString(10))
      return str.replace('\x00', '')
    })
    .join('')

  return ''
}

const toBinary = (char, padLimit = 8) => {
  const binary = String(char).charCodeAt(0).toString(2)
  return binary.padStart(padLimit, '0')
}

const chunk = (arr, chunkSize = 1, cache = []) => {
  const tmp = [...arr]
  if (chunkSize <= 0) return cache
  while (tmp.length) cache.push(tmp.splice(0, chunkSize))
  return cache
}
