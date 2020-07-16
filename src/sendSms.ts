import twilio from 'twilio'

export const sendSms = (message: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const client = twilio(accountSid, authToken)

  const messageInstancePromise = client.messages.create({
    body: message,
    from: '+12028665501',
    to: '+17788613154'
  })

  messageInstancePromise.then((message) => console.log(message.sid))
}
