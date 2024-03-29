<p text-align="center">
  <img src="https://og.barelyhuman.xyz/generate?fontSize=20&title=foronce&subtitle=The+OTP+Library&fontSizeTwo=8&color=%23a1a1aa&backgroundColor=%2318181b" />
</p>

- [Usage](#usage)
  - [Examples](#examples)
    - [One Time Email Validation](#one-time-email-validation)
- [API](#api)

## Usage

- Install the `foronce` library

```sh
; npm install foronce
```

### Examples

#### One Time Email Validation

```ts
import { generateTOTPSecret, isTOTPValid, totp } from 'foronce'

app.post('/login', (req, res) => {
  const email = req.body.email
  const secret = generateTOTPSecret()

  const user = new User()
  user.email = email
  user.OTPSecret = secret
  await user.save()

  const otp = totp(secret)

  EmailProvider.sendLoginEmail(email, otp)
})

app.post('/verify', (req, res) => {
  const { email, otp } = req.body
  const user = await User.find({
    where: {
      email: email,
    },
  })

  if (!isTOTPValid(user.OTPSecret, otp)) {
    res.status(400)
    res.send({ message: 'Invalid OTP' })
    return
  }

  res.send(generateLoginToken(user))
  return
})
```

## API

```ts
export function totp(
  secret: string,
  when?: number,
  options?: {
    period?: number
    algorithm?: 'sha1' | 'sha256' | 'sha512'
  }
): string

export function isTOTPValid(
  secret: string,
  token: string,
  options?: {
    period?: number
    algorithm?: 'sha1' | 'sha256' | 'sha512'
  }
): boolean

export function generateTOTPURL(
  secret: string,
  options: {
    company: string
    email: string
  }
): string

export function generateTOTPSecret(num?: number): string
```
