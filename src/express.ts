import express from 'express'
import { User, Verification, Entry } from './postgreSQL'
import bodyParser from 'body-parser'
import path from 'path'
import { filterNumber } from './parseNumber'
import { createHash } from './hash'
import { createRandomNumber } from './verificationCodeGenerator'
import { create } from 'domain'
import { sendVerificationCode } from './sendSms'
import { createJWT, decodeJWT } from './jwt'
import { jwt } from 'twilio'
import { error } from 'console'
import cryptoRandomString from 'crypto-random-string'

require('dotenv').config()

enum ErrorNames {
  invalidPhoneNumber = 'invalidPhoneNumber',
  invalidVerification = 'invalidVerification',
  invalidVerificationCode = 'invalidVerificationCode',
  invalidJwt = 'invalidJwt',
  verificationExpired = 'verificationExpired'
}

export const startServer = () => {
  const app = express()
  const onDone = () => console.log(`Express server listening at http://localhost:${process.env.PORT}`)
  const jsonParser = bodyParser.json()

  app.get('/root', (req, res) => res.send('Hello World!'))
  app.get('/js', (req, res) => res.send('Hello Patooter!'))
  // app.get('/', function (req, res) {
  //   res.sendFile(path.join(__dirname + '/../public/test.html'))
  // })
  app.use('/', express.static(path.join(__dirname, '../public')))

  // app.get('/redirectsuccess', function (req, res) {
  //   res.sendFile(__dirname + '../public/redirectsuccess.html')
  // })

  //creating user and verification code
  app.post('/auth/requestVerification', jsonParser, async (req, res) => {
    const { name, phoneNumber } = req.body
    const parsedNumber = filterNumber(phoneNumber)
    const tenMins = 600000
    //parsing number
    if (parsedNumber == undefined) {
      res.status(400).json({ name: ErrorNames.invalidPhoneNumber })
      return
    }
    //searching for existing number
    let user = await User.findOne({ where: { phoneNumber: parsedNumber } })
    //creating new instance if number does not exist
    if (user === null) {
      user = await User.create({ name, phoneNumber: parsedNumber })
    }
    const createVerification = createRandomNumber()
    const saltString = cryptoRandomString({ length: 10, type: 'numeric' })
    await Verification.create({
      userId: user.id,
      salt: saltString,
      codeHash: '123', //createHash(createVerification, saltString),
      expiryTs: Date.now() + tenMins
    })
    //sendVerificationCode(createVerification)
    res.status(200).end()
  })

  //verifying verification code
  app.post('/auth/verify', jsonParser, async (req, res) => {
    const { phoneNumber, code } = req.body

    let user = await User.findOne({ where: { phoneNumber: phoneNumber } })

    let anotherUser = await Verification.findOne({ where: { userId: user?.id } })

    console.log(anotherUser?.expiryTs)
    console.log(Date.now())

    if (anotherUser?.expiryTs! < Date.now()) {
      res.status(400).json({ name: ErrorNames.verificationExpired })
      return

      //matching same UserId and verification code
    } else if (
      user?.id === anotherUser?.userId &&
      anotherUser?.codeHash == '123' /*createHash(code, anotherUser?.salt)*/
    ) {
      //sending JWT
      res.status(200).json({ jwt: createJWT(user?.id!) })
    } else {
      res.status(400).json({ name: ErrorNames.invalidVerificationCode })
      return
    }
  })

  app.patch('/users/me', jsonParser, async (req, res) => {
    const { text } = req.body
    const notSliced = req.headers.authorization
    const token = notSliced?.slice(7)

    const result = decodeJWT(token)

    if (result == false) {
      res.status(401).json({ name: ErrorNames.invalidJwt })
      return
    } else {
      await Entry.create({ text: text, userId: result.sub })
      res.status(200).end()
    }
  })

  app.get('/entries', jsonParser, async (req, res) => {
    const notSliced = req.headers.authorization
    console.log(notSliced + ' req.headers.auth')
    const token = notSliced?.slice(9)
    console.log(token + ' is then sliced')
    const result = decodeJWT(token)
    console.log(result + 'finished result')

    if (result == false) {
      res.status(401).json({ name: ErrorNames.invalidJwt })
      return
    } else {
      await Entry.findAll({ where: { userId: result.sub } }).then((result) => res.json(result))
    }
  })

  /*
  app.post('/grateful', jsonParser, async (req, res) => {
    const { name, smsNumber } = req.body
    if (filterNumber(smsNumber) !== undefined) {
      const project = await Grateful.findOne({ where: { smsNumber: filterNumber(smsNumber) } })
      if (project === null) {
        const newSubscriber = await Grateful.create({ name, smsNumber: filterNumber(smsNumber) })
        // res.json({
        //   id: newSubscriber.id,
        //   name: newSubscriber.name,
        //   smsNumber: newSubscriber.smsNumber
        // })
        res.redirect('/redirectsuccess.html')
      } else {
        console.log('Found! Not creating :D')
        res.redirect('/redirectsuccess.html')
      }
    } else {
      res.redirect('/error404.html')
    }
  })
*/

  app.listen(process.env.PORT, onDone)
}
