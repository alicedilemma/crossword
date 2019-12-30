import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const WordContainer = styled(({ isSelected, coords, direction, ...otherProps }) => <div {...otherProps} />)`
	display: flex;
	flex-direction: ${({ direction }) => direction};
  justify-content: center;
  z-index: ${({ isSelected}) => isSelected ? '1' : 'auto'}
	grid-column-start: ${({ coords }) => coords.x};
	grid-row-start: ${({ coords }) => coords.y};
	${({ direction }) => direction === 'row' ? 'grid-column-end' : 'grid-row-end'}: span ${({ length }) => length};
`

const Square = styled(({ isSelected, isLocked, ...otherProps }) => <div {...otherProps} />)`
  flex: 1 1 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ isLocked, isSelected }) => 
    isLocked ? 'rgb(240, 240, 140)' : 
      isSelected ? 'rgb(220, 220, 240)' : 'rgb(240, 240, 240)'};
	margin: 1px;
  border-radius: 5px;
  user-select: none;
`

const Word = props => {
	const { word, onSelectWord, isSelected, tempLettersState, onRemoveTempLetter } = props
	const {
		text,
		coords,
		direction,
		id,
	} = word

	const squares = text.map((letter, index) => {
		let displayLetter = letter.isVisible ? letter.letter : ''
		if (isSelected) {
			displayLetter= tempLettersState[index].tempLetter
		}
		return (
			<Square isSelected={isSelected} isLocked={letter.isVisible} key={index} onClick={() => isSelected && onRemoveTempLetter(index)}>{displayLetter}</Square>
		)
	})

	return (
		<WordContainer
			onClick={() => {
        onSelectWord(id)}}
			isSelected={isSelected}
			coords={coords}
			direction={direction}
			length={text.length}
		>
			{squares}
		</WordContainer>
	)
}

Word.propTypes = {
	word: PropTypes.object,
	onSelectWord: PropTypes.func,
	isSelected: PropTypes.bool,
  tempLettersState: PropTypes.array,
  onRemoveTempLetter: PropTypes.func,
}

export default Word