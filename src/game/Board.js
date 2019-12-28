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
	const { puzzle, onSelectWord, selectedWordIndex, tempLettersState, onRemoveTempLetter } = props
	const { gridSize, words } = puzzle

	const wordBlocks = words.map((word, index) =>
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
	onSelectWord: PropTypes.func,
	selectedWordIndex: PropTypes.number,
  tempLettersState: PropTypes.array,
  onRemoveTempLetter: PropTypes.func,
}

export default Board