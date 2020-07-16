"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const postgreSQL_1 = require("./postgreSQL");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const parseNumber_1 = require("./parseNumber");
exports.startServer = () => {
    const app = express_1.default();
    const onDone = () => console.log(`Example app listening at http://localhost:${7432}`);
    const jsonParser = body_parser_1.default.json();
    app.get('/root', (req, res) => res.send('Hello World!'));
    app.get('/js', (req, res) => res.send('Hello Patooter!'));
    // app.get('/', function (req, res) {
    //   res.sendFile(path.join(__dirname + '/../public/test.html'))
    // })
    app.use('/', express_1.default.static(path_1.default.join(__dirname, '../public')));
    // app.get('/redirectsuccess', function (req, res) {
    //   res.sendFile(__dirname + '../public/redirectsuccess.html')
    // })
    app.use(express_1.default.urlencoded({ extended: false }));
    app.post('/grateful', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, smsNumber } = req.body;
        if (parseNumber_1.filterNumber(smsNumber) !== undefined) {
            const project = yield postgreSQL_1.Grateful.findOne({ where: { smsNumber: parseNumber_1.filterNumber(smsNumber) } });
            if (project === null) {
                const newSubscriber = yield postgreSQL_1.Grateful.create({ name, smsNumber: parseNumber_1.filterNumber(smsNumber) });
                // res.json({
                //   id: newSubscriber.id,
                //   name: newSubscriber.name,
                //   smsNumber: newSubscriber.smsNumber
                // })
                res.redirect('/redirectsuccess.html');
            }
            else {
                console.log('Found! Not creating :D');
                res.redirect('/redirectsuccess.html');
            }
        }
        else {
            res.redirect('/error404.html');
        }
    }));
    app.listen(process.env.PORT || 7432, onDone);
};
//# sourceMappingURL=express.js.map