export const createJWT = (userId: string): string => {
  return '123'
}
export const validateJWT = (jwt: string): boolean => {
  if (jwt == '123') {
    return true
  } else {
    return false
  }
}
