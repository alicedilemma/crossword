import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Board from './Board'
import Tray from './Tray'
import Picture from './Picture'
import NextButton from './NextButton'


const Base = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  padding: 30px;
  max-width: 800px;
  background: #5D4157;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #A8CABA, #5D4157);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #A8CABA, #5D4157); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

`

const makePuzzleState = (puzzle) => {
  return puzzle.words.map(word => { return {
  isDone: false,
  isLetterDone: Array(word.text.length).fill(false) 
}})
}

const Game = props => {
  const { puzzle, onNextLevel } = props

  const [selectedWordIndex, setSelectedWordIndex] = useState(null)
  const [tempLettersState, setTempLettersState] = useState([])
  const [letterStates, setLetterStates] = useState([])

  const [isFinished, setIsFinished] = useState(false)
  const [puzzleState, setPuzzleState] = useState(makePuzzleState(puzzle))

  useEffect(() => {
    setSelectedWordIndex(null)
    setTempLettersState([])
    setIsFinished(false)
    setPuzzleState(makePuzzleState(puzzle))
  }, [puzzle])

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
            const newWordState = {...puzzleState[wordIndex]}
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
  }, [tempLettersState, selectedWordIndex, puzzle])

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
      {isFinished && <NextButton onNextLevel={onNextLevel}/>}
      {!isFinished && <Tray
        letterStates={letterStates}
        onPickTempLetter={handlePickTempLetter}
      />}
    </Base>
  )
}

Game.propTypes = {
	puzzle: PropTypes.object,
	onNextLevel: PropTypes.func
}

export default Game