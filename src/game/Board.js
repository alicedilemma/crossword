import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Word from './Word'

const GridContainer = styled(({ gridSize, ...otherProps }) => <div {...otherProps} />)`
  width: 500px;
  height: 500px;
  display: grid;
  grid-template-columns: repeat(${({ gridSize }) => gridSize}, 1fr);
  grid-template-rows: repeat(${({ gridSize }) => gridSize}, 1fr);
  background-color: purple;
`

const Board = props => {
	const { puzzle, puzzleState, onSelectWord, selectedWordIndex, tempLettersState, onRemoveTempLetter } = props
	const { gridSize, words } = puzzle

  // all this should go...
  const fixedWords = []
  words.forEach((word, wordIndex) => {
    const fixedText = word.text.map(letter => { return {...letter}})
    
    fixedText.forEach((letter, letterIndex) => {
      letter.isVisible |= puzzleState[wordIndex].isLetterDone[letterIndex]
    })
    fixedWords.push({...word, text: fixedText})
  })

  const wordBlocks = fixedWords.map((word, index) =>
		<Word
			word={word}
			onSelectWord={() => onSelectWord(index)}
			isSelected={index === selectedWordIndex}
      tempLettersState={tempLettersState}
      onRemoveTempLetter={onRemoveTempLetter}
			key={index}
		/>
	)

	return (
		<GridContainer gridSize={gridSize} >
			{wordBlocks}
		</GridContainer>
	)
}

Board.propTypes = {
	puzzle: PropTypes.object,
	puzzleState: PropTypes.array,
	onSelectWord: PropTypes.func,
	selectedWordIndex: PropTypes.number,
  tempLettersState: PropTypes.array,
  onRemoveTempLetter: PropTypes.func,
}

export default Board