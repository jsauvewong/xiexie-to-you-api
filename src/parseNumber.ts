import { parsePhoneNumberFromString } from 'libphonenumber-js'

export const filterNumber = (number) => {
  const phoneNumber = parsePhoneNumberFromString(number, 'CA')
  if (phoneNumber.isValid() === true) {
    return phoneNumber.format('E.164')
  }
}
