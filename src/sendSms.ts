import twilio from 'twilio'
import { Verification, User } from './postgreSQL'
import { createRandomNumber } from './verificationCodeGenerator'

require('dotenv').config()

export const sendVerificationCode = (code) => {
  sendSms(`Here is your verification code: ${code}`)
  console.log('sent')
}

export const sendSms = async (message: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const client = twilio(accountSid, authToken)
  const twilioNumber = process.env.TWILIO_NUMBER
  const clientNumber = process.env.CLIENT_NUMBER

  const messageInstancePromise = client.messages.create({
    body: message,
    from: twilioNumber,
    to: '+17788613154'
  })

  messageInstancePromise.then((message) => console.log(message.sid))
}
