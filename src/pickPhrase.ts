const randomNumber = (max: number): number => {
  return Math.floor(Math.random() * max)
}

export const pickPhrase = (): string => {
  const phrasesArray = [
    'The difference between ordinary and extraordinary is that little extra. --Jimmy Johnson',
    'If you cannot do great things, do small things in a great way. --Napoleon Hill',
    'Tough times never last, but tough people do. --Robert Schuller',
    `Don't worry about failures; worry about the chances you miss when you don't even try. --Jack Canfield`,
    'Be humble. Be hungry. And always be the hardest worked in the room. --The Rock',
    'It does not matter how slowly you go as long as you do not stop. --Confucius',
    'Your dreams don’t have to be lofty; they just have to be lived.--Kelly Bouchard',
    'Taking care of yourself makes you stronger for everyone in your life … including you.--Kelly Rudolph',
    'Laugh at yourself. It tones your facial muscles and attitude.-- Kelly Rudolph',
    'Always remember you are braver than you believe, stronger than you seem, smarter than you think and twice as beautiful as you’ve ever imagined. --Dr. Seuss'
  ]

  // generates a random number from phrasesArray
  const randomIndex = randomNumber(phrasesArray.length)

  const randomPhrase = phrasesArray[randomIndex]

  return randomPhrase
}
