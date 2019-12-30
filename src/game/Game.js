import React, { useState, useEffect } from 'react'

import Board from './Board'
import Tray from './Tray'
import Picture from './Picture'
import NextButton from './NextButton'

import shuffle from 'shuffle-array'

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
  // this.text[3].isVisible = true
}

const puzzle = {
  picture: 'https://p1.pxfuel.com/preview/485/1009/177/christmas-cookies-gingerbread-cookie-holiday-christmas-tree-gifts.jpg',
  gridSize: 10,
  words: [
    new Word('christmas', 4, 1, 'column'),
    new Word('food', 7, 2, 'row'),
    new Word('carol', 2, 3, 'row'),
    new Word('santa', 4, 5, 'row'),
    new Word('merry', 4, 7, 'row'),
    new Word('presents', 1, 9, 'row'),
  ]
}

const Game = props => {

  const [selectedWordIndex, setSelectedWordIndex] = useState(null)
  const [tempLettersState, setTempLettersState] = useState([])
  const [letterStates, setLetterStates] = useState([])

  const [isFinished, setIsFinished] = useState(false)

  const makePuzzleState = () => {
      return puzzle.words.map(word => { return {
      isDone: false,
      isLetterDone: Array(word.text.length).fill(false) 
    }})
  }

  const [puzzleState, setPuzzleState] = useState(makePuzzleState())

  // Check if a word was solved
  useEffect(() => {
    if (selectedWordIndex === null) return

    const correctAnswer = puzzle.words[selectedWordIndex].text
    if (tempLettersState.every((tempLetter, i) => tempLetter.tempLetter === correctAnswer[i].letter)) {
      console.log('correct!')
      // lock in this word
      setPuzzleState(p => p.map((wordState, i) => i === selectedWordIndex ? { isDone: true, isLetterDone: new Array(wordState.isLetterDone.length).fill(true)} : wordState))
      // todo: lock in letters shared with other words
      // end the attempt
      setSelectedWordIndex(null)
      setLetterStates([])
      // a separate useEffect will check if every word is now solved
    }
  }, [tempLettersState, selectedWordIndex])

  // is game finished?
  useEffect(() => {
    if (puzzleState.every(word => word.isDone)) {
      setIsFinished(true)
    }
  }, [puzzleState])

  const handleSelectWord = index => {
    if (selectedWordIndex === index) return
    if (puzzleState[index].isDone) return

    setSelectedWordIndex(index)

    const selectedWord = puzzle.words[index]
    setTempLettersState(selectedWord.text.map(char => (
      {
        isLocked: char.isVisible,
        tempLetter: char.isVisible ? char.letter : null
      }
    ))
    )

    setLetterStates(selectedWord.letters.map((letter, index) => ({ letter, isUsed: false, id: index })))
  }

  const handlePickTempLetter = selectedLetter => {
    const toUpdateIndex = tempLettersState.findIndex(letter => !letter.isLocked && !letter.tempLetter)

    if (toUpdateIndex === -1) return

    setTempLettersState(tempLettersState.map((letter, index) => (
      index === toUpdateIndex ? { ...letter, tempLetter: selectedLetter.letter } : { ...letter }
    ))
    )

    setLetterStates(letterStates.map(otherLetterState => selectedLetter.id === otherLetterState.id ? { ...otherLetterState, isUsed: true } : otherLetterState))
  }

  const handleRemoveTempLetter = selectedLetterIndex => {
      if (tempLettersState[selectedLetterIndex].isLocked) return

      setTempLettersState(tempLettersState.map((letter, index) => (
        index === selectedLetterIndex ? { ...letter, tempLetter: null } : { ...letter }
      ))
      )

      const letterToRestore = tempLettersState[selectedLetterIndex].tempLetter
      const trayIndex = letterStates.findIndex(letter => letter.isUsed && letter.letter === letterToRestore)

    setLetterStates(letterStates.map((otherLetterState, index) => index === trayIndex ? { ...otherLetterState, isUsed: false } : otherLetterState))
  }

  return (
    <div>
      <Board
        puzzle={puzzle}
        puzzleState={puzzleState}
        onSelectWord={handleSelectWord}
        selectedWordIndex={selectedWordIndex}
        tempLettersState={tempLettersState}
        onRemoveTempLetter={handleRemoveTempLetter}
      />
      <Picture url={puzzle.picture}/>
      {isFinished && <NextButton/>}
      {!isFinished && <Tray
        letterStates={letterStates}
        onPickTempLetter={handlePickTempLetter}
      />}
    </div>
  )
}

export default Game