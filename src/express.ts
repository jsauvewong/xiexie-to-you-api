import express from 'express'
import { User, Verification, Entry } from './postgreSQL'
import bodyParser from 'body-parser'
import path from 'path'
import { filterNumber } from './parseNumber'
import dotenv from 'dotenv'
import { hashedCode } from './hash'

require('dotenv').config()

enum ErrorNames {
  invalidPhoneNumber = 'invalidPhoneNumber',
  invalidVerification = 'invalidVerification'
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

    if (parsedNumber == undefined) {
      res.status(400).json({ name: ErrorNames.invalidPhoneNumber })
      return
    }

    let user = await User.findOne({ where: { phoneNumber: parsedNumber } })

    if (user === null) {
      user = await User.create({ name, phoneNumber: parsedNumber })
      // Verification.salt cannot be null notNull Violation: Verification.expiryTs cannot be null
    }

    await Verification.create({ Userid: user.id, codeHash: hashedCode })

    res.status(200).end()

    //   res.status(200)
    // if (parsedNumber !== undefined) {
    //   let user = await User.findOne({ where: { phoneNumber: parsedNumber } })
    //   if (user === null) {
    //     user = await User.create({ name, phoneNumber: parsedNumber })
    //     res.status(200)
    //   }
    // } else {
    //   res.status(400).json({ name: ErrorNames.invalidPhoneNumber })

    // }
    //const hashedNumber = hash(parsedNumber)
    //let user = await Verification.create({ codeHash: hash(hashedNumber)})
  })

  /*
  app.post('/auth/requestVerification', jsonParser, async (req, res) => {
    const { name, phoneNumber } = req.body
    const parsedNumber = filterNumber(phoneNumber)



  if (parsedNumber !== undefined) {
    let user = await User.findOne({ where: { phoneNumber: parsedNumber } })
    if (user === null) {
      user = await User.create({ name, phoneNumber: parsedNumber })
      res.status(200)
    }
  } else {
    res.status(400).json({ name: ErrorNames.invalidPhoneNumber })
    
  }
  
*/

  //res.status(200).end()

  app.post('/auth/verify', jsonParser, async (req, res) => {
    const { phoneNumber } = req.body
    if (filterNumber(phoneNumber) !== undefined) {
      let user = await User.findOne({ where: { phoneNumber: filterNumber(phoneNumber) } })
      if (user === null) {
        user = await User.create({ name, phoneNumber: filterNumber(phoneNumber) })
        res.status(200).end()
      }
    } else {
      res.status(400).json({ name: ErrorNames.invalidPhoneNumber })
    }
  })

  // //app.post('/auth/verify', jsonParser, async (req, res) => {
  //   const { phoneNumber } = req.body
  //   if(){
  //       res.status(200)
  //       res.end()
  //   }else {
  //       res.status(400)
  //       res.json({name: ErrorNames.invalidVerification})
  //   }
  // })
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
