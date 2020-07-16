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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpDatabase = exports.Grateful = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize('postgres://postgres:@localhost:7432/grateful'); // Example for postgres
class Grateful extends sequelize_1.Model {
}
exports.Grateful = Grateful;
Grateful.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV1,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    smsNumber: {
        type: sequelize_1.DataTypes.STRING(16),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'grateful',
    sequelize: exports.sequelize // passing the `sequelize` instance is required
});
// export const Subscriber = sequelize.define("subscriber", {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV1,
//     primaryKey: true,
//     allowNull: false
//   },
//   name: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   },
//   smsNumber: {
//     type: DataTypes.STRING(16),
//     allowNull: false,
//     unique: true
//   }
// });
function setUpDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.sequelize.authenticate();
            yield exports.sequelize.sync({ force: true });
            console.log('Connection has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });
}
exports.setUpDatabase = setUpDatabase;
//# sourceMappingURL=postgreSQL.js.map