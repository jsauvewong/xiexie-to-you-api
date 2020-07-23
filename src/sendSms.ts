import twilio from 'twilio'
import { Verification, User } from './postgreSQL'

require('dotenv').config()

export const sendSms = async (message: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const client = twilio(accountSid, authToken)
  const twilioNumber = process.env.TWILIO_NUMBER

  const listOfsmsNumber = await User.findAll({ attributes: ['phoneNumber'], raw: true })
  const clientNumber = listOfsmsNumber[0].phoneNumber

  const messageInstancePromise = client.messages.create({
    body: `Here's your verification code : ${message} `,
    from: twilioNumber,
    to: clientNumber
  })

  messageInstancePromise.then((message) => console.log(message.sid))
}
