import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Board from './Board'
import Tray from './Tray'
import Picture from './Picture'
import NextButton from './NextButton'

import shuffle from 'shuffle-array'


const Base = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

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
      // lock in letters shared with other words
      for (const letter of correctAnswer) {
        if (letter.overlap) {
          // how to do cleanly
          setPuzzleState(puzzleState => {
            const { wordIndex, letterIndex } = letter.overlap
            const newWordState = {... puzzleState[wordIndex]}
            newWordState.isLetterDone = [...newWordState.isLetterDone]
            newWordState.isLetterDone[letterIndex] = true
            return puzzleState.map((wordState, index) => index === wordIndex ? newWordState : wordState)
          })
        }
      }

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
    const newLetterStates = selectedWord.letters.map((letter, index) => ({ letter, isUsed: false, id: index }))

    setTempLettersState(selectedWord.text.map((char, charIndex) => {

      const isVisible = char.isVisible || puzzleState[index].isLetterDone[charIndex]
      if (isVisible) {
        const usedIndex = newLetterStates.findIndex(letter => letter.letter === char.letter && !letter.isUsed)
        newLetterStates[usedIndex].isUsed = true
      }
      
      return {
        isLocked: isVisible,
        tempLetter: isVisible ? char.letter : null
      }
    })
    )

    setLetterStates(newLetterStates)
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
    <Base>
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
    </Base>
  )
}

export default Game