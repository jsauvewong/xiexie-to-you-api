"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = void 0;
const twilio_1 = __importDefault(require("twilio"));
exports.sendSms = (message) => {
    const accountSid = 'AC9d091bee8a4298347936952b19e4e246';
    const authToken = 'd06db33a248dccdbac4f7debf043a4ea';
    const client = twilio_1.default(accountSid, authToken);
    const messageInstancePromise = client.messages.create({
        body: message,
        from: '+12028665501',
        to: '+17788613154'
    });
    messageInstancePromise.then((message) => console.log(message.sid));
};
//# sourceMappingURL=sendSms.js.map