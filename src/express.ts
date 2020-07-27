import express from 'express'
import { User, Verification, Entry } from './postgreSQL'
import bodyParser from 'body-parser'
import path from 'path'
import { filterNumber } from './parseNumber'
import { createHash } from './hash'
import { createRandomNumber } from './verificationCodeGenerator'
import { create } from 'domain'
import { sendVerificationCode } from './sendSms'
import { createJWT, validateJWT } from './jwt'

require('dotenv').config()

enum ErrorNames {
  invalidPhoneNumber = 'invalidPhoneNumber',
  invalidVerification = 'invalidVerification',
  invalidVerificationCode = 'invalidVerificationCode'
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

  app.post('/auth/requestVerification', jsonParser, async (req, res) => {
    const { name, phoneNumber } = req.body
    const parsedNumber = filterNumber(phoneNumber)

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
      // Verification.salt cannot be null notNull Violation: Verification.expiryTs cannot be null
    }
    const createVerification = createRandomNumber()
    await Verification.create({ userId: user.id, codeHash: createHash(12345) /*createHash(createVerification)*/ })
    //sendVerificationCode(createVerification)
    res.status(200).end()
  })

  app.post('/auth/verify', jsonParser, async (req, res) => {
    const { phoneNumber, code } = req.body

    let user = await User.findOne({ where: { phoneNumber: phoneNumber } })

    let anotherUser = await Verification.findOne({ where: { userId: user?.id } })

    //matching same UserId and verification code
    if (user?.id === anotherUser?.userId && anotherUser?.codeHash == createHash(code)) {
      //you've been verified <3 
      createJWT(user?.id!)
      res.status(200).end()
    } else {
      res.status(400).json({ name: ErrorNames.invalidVerificationCode })
      return
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
