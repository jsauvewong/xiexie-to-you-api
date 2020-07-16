import { createApp } from './express'
import request from 'supertest'
import { Subscriber } from './postgreSQL'

test('response redirects to the success pg', async () => {
  await request(createApp())
    .post('/subscriber')
    .send({ name: 'John', smsNumber: '+17788613154' })
    .expect(302)
    .expect('Location', '/redirectsuccess.html')
})

test('response redirects to error404 for missing digit', async () => {
  await request(createApp())
    .post('/subscriber')
    .send({ name: 'John', smsNumber: '+1778613154' })
    .expect(302)
    .expect('Location', '/error404.html')
})

// test('name and smsNumber was created in Subscriber', async () => {
//   const newSubscriber = await Subscriber.create({ name, smsNumber: filterNumber(smsNumber)
//   expect({ name, smsNumber: +17788613154 }).toBe({name: 'John', smsNumber: +17788613154})
// })

test('name and smsNumber has been created in SQL', async () => {
  // delete subscriber past data before running this test
  await request(createApp()).post('/subscriber').send({ name: 'John', smsNumber: '+1778613154' })
  const found = await Subscriber.findOne({ raw: true, where: { smsNumber: '+17788613154' } })
  expect(found?.smsNumber).toBeTruthy()
})
