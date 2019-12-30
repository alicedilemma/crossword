import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	border: 1px solid black;
  height: 40px;
  font-size: 35px;
  text-transform: uppercase;
  font-family: sans-serif;
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
  user-select: none;
`

const Tray = props => {
	const { letterStates, onPickTempLetter } = props

	const handlePickLetter = letterState => {
		if (!letterState.isUsed) {
			onPickTempLetter(letterState)
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
	letterStates: PropTypes.array,
	onPickTempLetter: PropTypes.func
}

export default Tray