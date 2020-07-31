// import { randomNumber } from './verificationCodeGenerator'
import md5 from 'md5'
import cryptoRandomString from 'crypto-random-string'





export let createHash = (code, saltString) => {
  return md5(code + saltString)
}
