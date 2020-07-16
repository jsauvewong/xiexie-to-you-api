import { filterNumber } from './parseNumber'

test('7788613154', () => {
  expect(filterNumber('7788613154')).toBe('+17788613154')
})

test('+17788613154', () => {
  expect(filterNumber('+17788613154')).toBe('+17788613154')
})

test('missing a digit', () => {
  expect(filterNumber('778613154')).toBe(undefined)
})

test('character', () => {
  expect(filterNumber('a')).toBe(undefined)
})
