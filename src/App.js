import React, { useState } from 'react'
import Game from './game/Game'
import Puzzles from './game/Puzzles'

const App = () => {
  const [currentLevel, setCurrentLevel] = useState(0)
  const handleNextLevel = () => {
    setCurrentLevel(oldLevel => oldLevel + 1)
  }

  return (
    <Game 
      puzzle={Puzzles[currentLevel % Puzzles.length]}
      onNextLevel={handleNextLevel}
    />
  )
}

export default App
