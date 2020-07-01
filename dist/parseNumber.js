"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterNumber = void 0;
const libphonenumber_js_1 = require("libphonenumber-js");
exports.filterNumber = (number) => {
    const phoneNumber = libphonenumber_js_1.parsePhoneNumberFromString(number, 'CA');
    if (phoneNumber.isValid() === true) {
        return phoneNumber.format('E.164');
    }
};
//# sourceMappingURL=parseNumber.js.map