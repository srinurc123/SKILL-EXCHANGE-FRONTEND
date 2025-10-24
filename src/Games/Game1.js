import React, { useState, useEffect, useRef } from 'react';

const Game1 = () => {
  const gridSize = 5;
  const maxNumber = 9;
  const [grid, setGrid] = useState(Array(gridSize * gridSize).fill(null));
  const [currentNumber, setCurrentNumber] = useState(1);
  const [gameState, setGameState] = useState('ready'); // ready, playing, gameover
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(localStorage.getItem('Game1HighScore') || 0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [message, setMessage] = useState('Click Start to begin!');
  const timerRef = useRef(null);

  const generateGrid = () => {
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    const newGrid = Array(gridSize * gridSize).fill(null);
    const positions = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    for (let num of numbers) {
      const randomIndex = Math.floor(Math.random() * positions.length);
      const pos = positions.splice(randomIndex, 1)[0];
      newGrid[pos] = num;
    }
    return newGrid;
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTimeLeft(10);
    setCurrentNumber(1);
    setGrid(generateGrid());
    setGameState('playing');
    setMessage('Click tiles in order (start with 1)!');
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    setGrid(Array(gridSize * gridSize).fill(null));
    setCurrentNumber(1);
    setGameState('ready');
    setScore(0);
    setLevel(1);
    setTimeLeft(10);
    setMessage('Click Start to begin!');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timerRef.current);
            setGameState('gameover');
            setMessage('Game Over! Time ran out.');
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('Game1HighScore', score);
            }
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, score, highScore]);

  const handleTileClick = (index) => {
    if (gameState !== 'playing') return;
    const clickedNumber = grid[index];
    if (!clickedNumber) return;

    if (clickedNumber === currentNumber) {
      const newGrid = [...grid];
      newGrid[index] = null;
      setGrid(newGrid);
      setCurrentNumber(currentNumber + 1);
      setScore(score + 10);

      if (currentNumber === maxNumber) {
        setLevel(level + 1);
        setCurrentNumber(1);
        setGrid(generateGrid());
        setTimeLeft(Math.max(5, 10 - level * 1));
        setMessage(`Level ${level + 1}! Click 1 to start.`);
      }
    } else {
      setScore(Math.max(0, score - 10));
      setMessage('Wrong number! Try again.');
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
      gridTemplateColumns: `repeat(${gridSize}, 60px)`,
      gap: '5px',
      marginBottom: '1rem',
    },
    tile: {
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #333',
      backgroundColor: '#ddd',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    tileActive: {
      backgroundColor: '#32cd32',
    },
    tileEmpty: {
      backgroundColor: '#f0f0f0',
      cursor: 'default',
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
    timerBar: {
      width: '200px',
      height: '20px',
      border: '2px solid #333',
      backgroundColor: '#f0f0f0',
      marginBottom: '1rem',
      overflow: 'hidden',
    },
    timerFill: {
      height: '100%',
      backgroundColor: timeLeft > 3 ? '#32cd32' : '#ff4500',
      width: `${(timeLeft / (10 - (level - 1) * 1)) * 100}%`,
      transition: 'width 0.1s linear',
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
      <h1 style={styles.title}>Number Rush</h1>
      <div style={styles.info}>
        Score: {score} | Level: {level} | High Score: {highScore}
      </div>
      <div style={styles.message}>{message}</div>
      <div style={styles.timerBar}>
        <div style={styles.timerFill}></div>
      </div>
      <div style={styles.grid}>
        {grid.map((number, index) => (
          <div
            key={index}
            style={{
              ...styles.tile,
              ...(number === currentNumber ? styles.tileActive : {}),
              ...(number === null ? styles.tileEmpty : {}),
              ...(gameState !== 'playing' ? styles.tileDisabled : {}),
            }}
            onClick={() => handleTileClick(index)}
          >
            {number}
          </div>
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

export default Game1;