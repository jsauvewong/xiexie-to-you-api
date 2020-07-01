"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./express");
const postgreSQL_1 = require("./postgreSQL");
// So the app can talk to Heroku on their own assigned port
express_1.startServer();
// const execute = () => {
//   const randomPhrase = pickPhrase()
//   sendSms(randomPhrase)
//   console.log('sent')
// }
// console.log('started running')
// const timeout = setTimeout(execute, 1000);
/*const j = schedule.scheduleJob("0 9 * * *", function () {
  sendSms(pickPhrase())
  console.log("done!")
})*/
postgreSQL_1.setUpDatabase();
//# sourceMappingURL=Main.js.map