import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const PictureContainer = styled.img`
  height: 200px;
  margin: 10px auto;
  display: block;
  -webkit-box-shadow: 4px 4px 15px 0px rgba(92,90,92,1);
  -moz-box-shadow: 4px 4px 15px 0px rgba(92,90,92,1);
  box-shadow: 4px 4px 15px 0px rgba(92,90,92,1);
`

const PictureBacking = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.3);
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
  z-index: 3;
`

const Picture = props => {
  const { url } = props
  const [isBig, setIsBig] = useState(false)

  const handleClick = () => setIsBig(old => !old)

  useEffect(() => {
    const callback = (e) => {
      if (e.key === 'Escape') {
        setIsBig(false)
      }
    }
    window.addEventListener('keydown', callback)
  }, [])

	return (
    <>
      <PictureContainer src={url} alt='' onClick={handleClick} />
      {isBig && <PictureBacking onClick={handleClick} />}
      {isBig && <PictureOverlay src={url} onClick={handleClick} />}
    </>
	)
}

Picture.propTypes = {
	url: PropTypes.string,
}

export default Picture
