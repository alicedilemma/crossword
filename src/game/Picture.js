import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const PictureContainer = styled(({ url, ...otherProps }) => <img {...otherProps} />)`
  width: 200px;
  height: 200px;
  background-color: purple;
`

const Picture = props => {
	const { url } = props

	return (
		<PictureContainer src={url} alt='' >
		</PictureContainer>
	)
}

Picture.propTypes = {
	url: PropTypes.string,
}

export default Picture
