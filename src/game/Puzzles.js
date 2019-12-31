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

// We add some random letters - more if the word is short.
function getRandomLettersFor(word) {
  const minTotalTiles = 6
  const minDecoyTiles = 2
  const result = []
  const lettersToAdd = Math.max(minDecoyTiles, minTotalTiles - word.length)
  for (let i = 0; i < lettersToAdd; i++) {
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
    new Word('silhouette', 1, 8, 'row'),
    new Word('sail', 7, 11, 'row'),
  ]
})

Puzzles.push({
  picture: '3.jpg',
  gridSize: 12,
  words: [
    new Word('freedom', 3, 3, 'column'),
    new Word('horses', 1, 4, 'row'),
    new Word('peaceful', 2, 6, 'row'),
    new Word('fence', 7, 6, 'column'),
    new Word('clouds', 7, 9, 'row'),
    new Word('grass', 12, 5, 'column'),
  ]
})

Puzzles.push({
  picture: '4.jpg',
  gridSize: 10,
  words: [
    new Word('pet', 1, 2, 'row'),
    new Word('tail', 3, 2, 'column'),
    new Word('bicycle', 2, 4, 'row'),
    new Word('leash', 7, 4, 'column'),
    new Word('sock', 7, 7, 'row'),
    new Word('walk', 10, 4, 'column'),
  ]
})

Puzzles.push({
  picture: '5.jpg',
  gridSize: 10,
  words: [
    new Word('kettle', 5, 1, 'row'),
    new Word('kitchen', 5, 1, 'column'),
    new Word('celery', 5, 4, 'row'),
    new Word('spices', 1, 6, 'row'),
    new Word('apron', 2, 5, 'column'),
  ]
})

Puzzles.push({
  picture: '6.jpg',
  gridSize: 10,
  words: [
    new Word('door', 1, 6, 'column'),
    new Word('orange', 1, 8, 'row'),
    new Word('woman', 4, 4, 'column'),
    new Word('writing', 4, 4, 'row'),
    new Word('brick', 6, 2, 'column'),
    new Word('pen', 9, 2, 'column'),
  ]
})

for (const puzzle of Puzzles) {
  // One letter starts relealed
  puzzle.words[0].text[0].isVisible = true

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