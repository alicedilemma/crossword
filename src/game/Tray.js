import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	border: 1px solid black;
	height: 40px;
`

const LetterBlock = styled(({ isUsed, ...otherProps }) => <div {...otherProps} />)`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  background-color: ${({ isUsed }) => isUsed ? 'rgb(128, 128, 128)' : 'rgb(240, 240, 240)'}} ;
  margin: 10px;
  width: 40px;
  height: 40px;
`

const Tray = props => {
	const { letters, onPickTempLetter } = props

	const [letterStates, setLetterStates] = useState([])

	useEffect(() => {
		setLetterStates(letters.map((letter, index) => ({ letter, isUsed: false, id: index })))
	}, [letters])

	const handlePickLetter = letterState => {
		if (!letterState.isUsed) {
			onPickTempLetter(letterState.letter)
			setLetterStates(letterStates.map(otherLetterState => letterState.id === otherLetterState.id ? { ...letterState, isUsed: true } : otherLetterState))
		}
	}

	const letterBlocks = letterStates.map((letterState, index) => <LetterBlock
		isUsed={letterState.isUsed}
		onClick={() => handlePickLetter(letterState)}
		key={index}>{letterState.letter}</LetterBlock>)
	return (
		<Container>
			{letterBlocks}
		</Container>
	)
}

Tray.propTypes = {
	letters: PropTypes.array,
	onPickTempLetter: PropTypes.func
}

export default Tray