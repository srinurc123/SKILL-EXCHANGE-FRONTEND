import React, { useState, useEffect } from 'react';

const Game4 = () => {
  const gridSize = 4;
  const [grid, setGrid] = useState(Array(gridSize * gridSize).fill(false));
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isShowing, setIsShowing] = useState(false);
  const [gameState, setGameState] = useState('ready'); // ready, showing, playing, gameover
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') || 0);
  const [message, setMessage] = useState('Click Start to begin!');

  const generateSequence = (level) => {
    const seqLength = Math.min(3 + level, gridSize * gridSize);
    const newSeq = [];
    while (newSeq.length < seqLength) {
      const tile = Math.floor(Math.random() * gridSize * gridSize);
      if (!newSeq.includes(tile)) newSeq.push(tile);
    }
    return newSeq;
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setGameState('showing');
    const newSeq = generateSequence(1);
    setSequence(newSeq);
    setPlayerSequence([]);
    setMessage('Memorize the sequence!');
  };

  const resetGame = () => {
    setGrid(Array(gridSize * gridSize).fill(false));
    setSequence([]);
    setPlayerSequence([]);
    setGameState('ready');
    setScore(0);
    setLevel(1);
    setMessage('Click Start to begin!');
  };

  const showSequence = async () => {
    setIsShowing(true);
    for (let tile of sequence) {
      setGrid((prev) => {
        const newGrid = [...prev];
        newGrid[tile] = true;
        return newGrid;
      });
      await new Promise((resolve) => setTimeout(resolve, 1000 - level * 100));
      setGrid((prev) => {
        const newGrid = [...prev];
        newGrid[tile] = false;
        return newGrid;
      });
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    setIsShowing(false);
    setGameState('playing');
    setMessage('Repeat the sequence!');
  };

  useEffect(() => {
    if (gameState === 'showing') {
      showSequence();
    }
  }, [gameState, sequence]);

  const handleTileClick = (index) => {
    if (gameState !== 'playing' || isShowing) return;
    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setGameState('gameover');
      setMessage('Game Over! Wrong tile.');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('highScore', score);
      }
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      const newScore = score + level * 10;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('highScore', newScore);
      }
      setLevel(level + 1);
      setGameState('showing');
      const newSeq = generateSequence(level + 1);
      setSequence(newSeq);
      setPlayerSequence([]);
      setMessage('Well done! Next level...');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1rem',
      color: '#333',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridSize}, 80px)`,
      gap: '5px',
      marginBottom: '1rem',
    },
    tile: {
      width: '80px',
      height: '80px',
      border: '2px solid #333',
      backgroundColor: '#ddd',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    tileActive: {
      backgroundColor: '#ff4500',
    },
    tileDisabled: {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    info: {
      marginBottom: '1rem',
      fontSize: '1.2rem',
      color: '#333',
    },
    message: {
      fontSize: '1.5rem',
      color: gameState === 'gameover' ? '#ff0000' : '#0066cc',
      marginBottom: '1rem',
    },
    button: {
      padding: '10px 20px',
      fontSize: '1rem',
      backgroundColor: '#0066cc',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '0 10px',
    },
    buttonDisabled: {
      backgroundColor: '#999',
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Memory Matrix</h1>
      <div style={styles.info}>Score: {score} | Level: {level} | High Score: {highScore}</div>
      <div style={styles.message}>{message}</div>
      <div style={styles.grid}>
        {grid.map((isActive, index) => (
          <div
            key={index}
            style={{
              ...styles.tile,
              ...(isActive ? styles.tileActive : {}),
              ...(gameState !== 'playing' || isShowing ? styles.tileDisabled : {}),
            }}
            onClick={() => handleTileClick(index)}
          />
        ))}
      </div>
      <div>
        {gameState === 'ready' && (
          <button style={styles.button} onClick={startGame}>
            Start
          </button>
        )}
        {(gameState === 'gameover' || gameState === 'ready') && (
          <button style={styles.button} onClick={resetGame}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default Game4;