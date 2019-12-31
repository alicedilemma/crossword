import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const PictureContainer = styled.img`
  height: 200px;
  background-color: purple;
  margin: 0 auto;
  display: block;
`

const PictureOverlay = styled.img`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  overflow: auto;
  z-index: 2;
`

const Picture = props => {
  const { url } = props
  const [isBig, setIsBig] = useState(false)

  const handleClick = () => setIsBig(old => !old)

	return (
    <>
      <PictureContainer src={url} alt='' onClick={handleClick} />
      {isBig && <PictureOverlay src={url} onClick={handleClick} />}
    </>
	)
}

Picture.propTypes = {
	url: PropTypes.string,
}

export default Picture
