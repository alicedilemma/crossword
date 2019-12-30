import React from 'react'
import styled from 'styled-components'

const StyledNextButton = styled.button`
  font-size: 35px;
  margin: 0 auto;
  display: block;
`

const NextButton = props => {

	return (
		<StyledNextButton>Next puzzle!</StyledNextButton>
	)
}

export default NextButton