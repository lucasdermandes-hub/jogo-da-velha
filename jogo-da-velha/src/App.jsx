import { useState } from 'react'
import './App.css'

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const winningLine = winningLines.find(([first, second, third]) => (
    board[first] && board[first] === board[second] && board[first] === board[third]
  ))
  const winner = winningLine ? board[winningLine[0]] : null

  const draw = !winner && board.every(Boolean)

  function play(index) {
    if (board[index] || winner || draw) return

    const nextBoard = [...board]
    nextBoard[index] = currentPlayer
    setBoard(nextBoard)

    const nextWinningLine = winningLines.find(([first, second, third]) => (
      nextBoard[first] && nextBoard[first] === nextBoard[second] && nextBoard[first] === nextBoard[third]
    ))
    if (nextWinningLine) {
      setScores((currentScores) => ({
        ...currentScores,
        [currentPlayer]: currentScores[currentPlayer] + 1,
      }))
    } else if (nextBoard.every(Boolean)) {
      setScores((currentScores) => ({ ...currentScores, draws: currentScores.draws + 1 }))
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
  }

  function resetGame() {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
  }

  function resetScores() {
    setScores({ X: 0, O: 0, draws: 0 })
    resetGame()
  }

  const status = winner ? `Jogador ${winner} venceu!` : draw ? 'Deu velha!' : `Vez do jogador ${currentPlayer}`

  return (
    <main className="game">
      <p className="eyebrow">Jogo clássico</p>
      <h1>Jogo da velha</h1>
      <p className="status" aria-live="polite">{status}</p>

      <section className="scoreboard" aria-label="Placar">
        <div><strong>{scores.X}</strong><span>Jogador X</span></div>
        <div><strong>{scores.draws}</strong><span>Empates</span></div>
        <div><strong>{scores.O}</strong><span>Jogador O</span></div>
      </section>

      <div className="board" role="grid" aria-label="Tabuleiro do jogo da velha">
        {board.map((cell, index) => (
          <button
            className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${winningLine?.includes(index) ? 'cell-winner' : ''}`}
            key={index}
            type="button"
            role="gridcell"
            aria-label={cell ? `Casa ${index + 1}: jogador ${cell}` : `Casa ${index + 1}, vazia`}
            onClick={() => play(index)}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="actions">
        <button className="reset" type="button" onClick={resetGame}>Novo jogo</button>
        <button className="reset reset-secondary" type="button" onClick={resetScores}>Zerar placar</button>
      </div>
    </main>
  )
}

export default App
