import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const WordContainer = styled(({ isSelected, coords, direction, ...otherProps }) => <div {...otherProps} />)`
	display: flex;
	flex-direction: ${({ direction }) => direction};
	justify-content: center;
	grid-column-start: ${({ coords }) => coords.x};
	grid-row-start: ${({ coords }) => coords.y};
	${({ direction }) => direction === 'row' ? 'grid-column-end' : 'grid-row-end'}: span ${({ length }) => length};
`

const Square = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
	background-color: rgb(240, 240, 240);
	margin: 1px;
	border-radius: 5px;
`

const Word = props => {
	const { word, onSelectWord, isSelected } = props
	const {
		text,
		coords,
		direction,
		id,
	} = word

	const squares = text.map((letter, index) => <Square key={index}>{letter.isVisible ? letter.letter : ''}</Square>)

	return (
		<WordContainer
			onClick={() => onSelectWord(id)}
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
}

export default Word