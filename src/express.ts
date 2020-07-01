import express from 'express'
import { Grateful } from './postgreSQL'
import bodyParser from 'body-parser'
import path from 'path'
import { filterNumber } from './parseNumber'

export const startServer = () => {
  const app = express()
  const onDone = () => console.log(`Example app listening at http://localhost:${7432}`)
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

  app.use(express.urlencoded({ extended: false }))

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

  app.listen(process.env.PORT || 7432, onDone)
}


