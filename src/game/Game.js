import React, { useState } from 'react'

import Board from './Board'
import Tray from './Tray'

const Word = function (text, x, y, direction) {
	this.text = [...text].map(char => ({ letter: char, isVisible: false }))
	this.coords = { x, y }
	this.letters = [...text, 'a', 'e', 'i']
	this.direction = direction
}

const puzzle = {
	picture: '',
	gridSize: 10,
	words: [new Word('carol', 1, 3, 'row'), new Word('christmas', 7, 1, 'column')]
}

const Game = props => {

	const [selectedWordIndex, setSelectedWordIndex] = useState(null)
	const [tempLetters, setTempLetters] = useState([])

	const handleSelectWord = index => {
		setSelectedWordIndex(index)
		setTempLetters([])
	}

	const handlePickTempLetter = letter => setTempLetters([...tempLetters, letter])

	const letters = selectedWordIndex !== null ? puzzle.words[selectedWordIndex].letters : []

	return (
		<div>
			<Board
				puzzle={puzzle}
				onSelectWord={handleSelectWord}
				selectedWordIndex={selectedWordIndex}
				tempLetters={tempLetters}
			/>
			<div>picture</div>
			<Tray
				letters={letters}
				onPickTempLetter={handlePickTempLetter}
			/>
		</div>
	)
}

export default Game