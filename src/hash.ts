import { codeGenerator } from './verificationCodeGenerator'

const hash = (input: string): string => {
  return input
}

export const hashedCode: string = hash(codeGenerator.toString())
