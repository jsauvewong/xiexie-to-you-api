import twilio from 'twilio'

export const sendSms = (message: string) => {
  const accountSid = 'AC9d091bee8a4298347936952b19e4e246'
  const authToken = 'd06db33a248dccdbac4f7debf043a4ea'
  const client = twilio(accountSid, authToken)

  const messageInstancePromise = client.messages.create({
    body: message,
    from: '+12028665501',
    to: '+17788613154'
  })

  messageInstancePromise.then((message) => console.log(message.sid))
}
