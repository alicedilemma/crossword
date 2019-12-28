import React, { useState } from 'react'

import Board from './Board'
import Tray from './Tray'

const Word = function (text, x, y, direction) {
  this.text = [...text].map(char => ({ letter: char, isVisible: false }))
  this.coords = { x, y }
  this.letters = [...text, 'a', 'e', 'i']
  this.direction = direction
  this.text[3].isVisible = true
}

const puzzle = {
  picture: '',
  gridSize: 10,
  words: [new Word('carol', 1, 3, 'row'), new Word('christmas', 7, 1, 'column')]
}

const Game = props => {

  const [selectedWordIndex, setSelectedWordIndex] = useState(null)
  const [tempLettersState, setTempLettersState] = useState([])
  const [letterStates, setLetterStates] = useState([])

  const handleSelectWord = index => {
    if (selectedWordIndex === index) return

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

  const letters = selectedWordIndex !== null ? puzzle.words[selectedWordIndex].letters : []

  return (
    <div>
      <Board
        puzzle={puzzle}
        onSelectWord={handleSelectWord}
        selectedWordIndex={selectedWordIndex}
        tempLettersState={tempLettersState}
        onRemoveTempLetter={handleRemoveTempLetter}
      />
      <div>picture</div>
      <Tray
        letterStates={letterStates}
        onPickTempLetter={handlePickTempLetter}
      />
    </div>
  )
}

export default Game