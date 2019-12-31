import shuffle from 'shuffle-array'

const Puzzles = []


const randomLetters = 
  ('abcdefghijklmnopqrstuvwxyz'
  + 'abcdefghijklmnoprstuvwy'
  + 'aeiou').split('')

function randomLetter() {
  const i = Math.floor(Math.random() * randomLetters.length)
  return randomLetters[i]
}

function getRandomLettersFor(word) {
  const result = []
  for (let i = 0; i < word.length / 3 || i < 3; i++) {
    result.push(randomLetter())
  }
  return result
}

const Word = function (text, x, y, direction) {
  this.text = [...text].map(char => ({ letter: char, isVisible: false }))
  this.coords = { x, y }
  this.letters = [...text, ...getRandomLettersFor(text)]
  shuffle(this.letters)
  this.direction = direction
}

Puzzles.push({
  picture: '1.jpg',
  gridSize: 8,
  words: [
    new Word('glasses', 1, 3, 'row'),
    new Word('desk', 4, 1, 'column'),
    new Word('laptop', 2, 3, 'column'),
    new Word('notebook', 1, 7, 'row'),
  ]
})

Puzzles.push({
  picture: '2.jpg',
  gridSize: 11,
  words: [
    new Word('hills', 1, 1, 'row'),
    new Word('sunset', 5, 1, 'column'),
    new Word('water', 3, 6, 'row'),
    new Word('friends', 7, 5, 'column'),
  ]
})

Puzzles.push({
  picture: '3.jpg',
  gridSize: 12,
  words: [
    new Word('freedom', 3, 1, 'column'),
    new Word('horses', 1, 2, 'row'),
    new Word('peaceful', 2, 4, 'row'),
    new Word('fence', 7, 4, 'column'),
    new Word('clouds', 7, 7, 'row'),
    new Word('grass', 12, 3, 'column'),
  ]
})

for (const puzzle of Puzzles) {
  // Find overlapping letters
  for (const word of puzzle.words) {
    let x = word.coords.x
    let y = word.coords.y
    for (let i = 0; i < word.text.length; i++) {
      for (const otherWord of puzzle.words) {
        if (otherWord !== word) {
          let x2 = otherWord.coords.x
          let y2 = otherWord.coords.y
          for (let j = 0; j < otherWord.text.length; j++) {
            if (x2 === x && y2 === y) {
              // an overlap
              word.text[i].overlap = { wordIndex: puzzle.words.indexOf(otherWord), letterIndex: j} 
            }
            if (otherWord.direction === 'row') {
              x2++
            } else {
              y2++
            }
          }
        }
      }
      if (word.direction === 'row') {
        x++
      } else {
        y++
      }
    }
  }
}

export default Puzzles