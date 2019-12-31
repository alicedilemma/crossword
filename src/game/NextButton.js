import React from 'react'
import styled from 'styled-components'

const StyledNextButton = styled.button`
  font-size: 35px;
  margin: 10px auto;
  display: block;
`

const NextButton = props => {
  const { onNextLevel } = props

	return (
		<StyledNextButton onClick={onNextLevel}>Next puzzle!</StyledNextButton>
	)
}

export default NextButton