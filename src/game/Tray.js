import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Container = styled.div`
	display: flex;
  flex-direction: row;
  flex-wrap: wrap;
	justify-content: center;
  font-size: 35px;
  font-family: sans-serif;
`

const LetterBlock = styled(({ isUsed, ...otherProps }) => <div {...otherProps} />)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: ${({ isUsed }) => isUsed ? 'rgb(128, 128, 128)' : 'rgb(240, 240, 240)'}} ;
  margin: 5px;
  width: 50px;
  height: 50px;
  user-select: none;
  text-transform: uppercase;
`

const Message = styled.div`
  height: 50px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
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
      {letterBlocks.length ? letterBlocks : <Message>Select a word</Message>}
    </Container>
  )
}

Tray.propTypes = {
  letterStates: PropTypes.array,
  onPickTempLetter: PropTypes.func
}

export default Tray