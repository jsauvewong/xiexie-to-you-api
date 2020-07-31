import { UserBindingContext } from 'twilio/lib/rest/chat/v2/service/user/userBinding'

import jwt from 'jwt-simple'

require('dotenv').config()

const today = Date.now()
const twoWeeks = 1209600000

export const createJWT = (userId: string) => {
  const payload = { sub: userId, exp: today + twoWeeks }
  const token = jwt.encode(payload, process.env.SECRET!)
  return token
}

export const decodeJWT = (token) => {
  try {
    const decoded = jwt.decode(token, process.env.SECRET!)
    return decoded
  } catch (err) {
    console.log(err)
  }
}
