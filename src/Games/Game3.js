import React, { useState, useEffect, useRef } from 'react';

const Game3 = () => {
  const gridSize = 5;
  const colors = ['red', 'blue', 'green'];
  const [targetGrid, setTargetGrid] = useState(Array(gridSize * gridSize).fill('red'));
  const [playerGrid, setPlayerGrid] = useState(Array(gridSize * gridSize).fill('red'));
  const [gameState, setGameState] = useState('ready'); // ready, showing, playing, gameover
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('Game3HighScore') || 0);
  const [moveTime, setMoveTime] = useState(1);
  const [roundTime, setRoundTime] = useState(15);
  const [message, setMessage] = useState('Click Start to begin!');
  const moveTimerRef = useRef(null);
  const roundTimerRef = useRef(null);

  const generatePattern = () => {
    return Array(gridSize * gridSize).fill().map(() => colors[Math.floor(Math.random() * colors.length)]);
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setMistakes(0);
    setMoveTime(1);
    setRoundTime(15);
    const newPattern = generatePattern();
    setTargetGrid(newPattern);
    setPlayerGrid(Array(gridSize * gridSize).fill('red'));
    setGameState('showing');
    setMessage('Memorize the pattern!');
  };

  const resetGame = () => {
    clearInterval(moveTimerRef.current);
    clearInterval(roundTimerRef.current);
    setTargetGrid(Array(gridSize * gridSize).fill('red'));
    setPlayerGrid(Array(gridSize * gridSize).fill('red'));
    setGameState('ready');
    setScore(0);
    setLevel(1);
    setMistakes(0);
    setMoveTime(1);
    setRoundTime(15);
    setMessage('Click Start to begin!');
  };

  useEffect(() => {
    if (gameState === 'showing') {
      setTimeout(() => {
        setGameState('playing');
        setMessage('Match the pattern!');
      }, 2000 - level * 100);
    }
  }, [gameState, level]);

  useEffect(() => {
    if (gameState === 'playing') {
      roundTimerRef.current = setInterval(() => {
        setRoundTime((prev) => {
          if (prev <= 0) {
            clearInterval(roundTimerRef.current);
            setGameState('gameover');
            setMessage('Game Over! Time ran out.');
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('Game3HighScore', score);
            }
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => clearInterval(roundTimerRef.current);
  }, [gameState, score, highScore]);

  const handleTileClick = (index) => {
    if (gameState !== 'playing') return;
    if (moveTime <= 0) return;

    clearInterval(moveTimerRef.current);
    setMoveTime(Math.max(0.5, 1 - level * 0.1));
    moveTimerRef.current = setInterval(() => {
      setMoveTime((prev) => {
        if (prev <= 0) return 0;
        return prev - 0.1;
      });
    }, 100);

    const newPlayerGrid = [...playerGrid];
    const currentColorIndex = colors.indexOf(newPlayerGrid[index]);
    newPlayerGrid[index] = colors[(currentColorIndex + 1) % colors.length];
    setPlayerGrid(newPlayerGrid);
  };

  const checkPattern = () => {
    if (gameState !== 'playing') return;
    const isCorrect = playerGrid.every((color, i) => color === targetGrid[i]);
    if (isCorrect) {
      const newScore = score + level * 20;
      setScore(newScore);
      setLevel(level + 1);
      setMoveTime(Math.max(0.5, 1 - (level + 1) * 0.1));
      setRoundTime(Math.max(5, 15 - (level + 1) * 1));
      setTargetGrid(generatePattern());
      setPlayerGrid(Array(gridSize * gridSize).fill('red'));
      setGameState('showing');
      setMessage(`Level ${level + 1}! Memorize the new pattern.`);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('Game3HighScore', newScore);
      }
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setRoundTime((prev) => Math.max(3, prev - 3));
      setScore(Math.max(0, score - 20));
      setMessage('Wrong pattern! Try again.');
      if (newMistakes >= 3) {
        setGameState('gameover');
        setMessage('Game Over! Too many mistakes.');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('Game3HighScore', score);
        }
      }
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
    gridContainer: {
      display: 'flex',
      gap: '20px',
      marginBottom: '1rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridSize}, 50px)`,
      gap: '3px',
    },
    tile: {
      width: '50px',
      height: '50px',
      border: '2px solid #333',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
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
      width: '150px',
      height: '15px',
      border: '2px solid #333',
      backgroundColor: '#f0f0f0',
      marginBottom: '0.5rem',
      overflow: 'hidden',
    },
    timerFill: {
      height: '100%',
      backgroundColor: (timer, max) => (timer > max / 2 ? '#32cd32' : '#ff4500'),
      width: ({ timer, max }) => `${(timer / max) * 100}%`,
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
      <h1 style={styles.title}>Pattern Blitz</h1>
      <div style={styles.info}>
        Score: {score} | Level: {level} | Mistakes: {mistakes}/3 | High Score: {highScore}
      </div>
      <div style={styles.message}>{message}</div>
      <div style={styles.timerBar}>
        <div style={{ ...styles.timerFill, width: `${(moveTime / (1 - (level - 1) * 0.1)) * 100}%`, backgroundColor: moveTime > 0.5 ? '#32cd32' : '#ff4500' }}></div>
      </div>
      <div style={styles.timerBar}>
        <div style={{ ...styles.timerFill, width: `${(roundTime / (15 - (level - 1) * 1)) * 100}%`, backgroundColor: roundTime > 7.5 ? '#32cd32' : '#ff4500' }}></div>
      </div>
      <div style={styles.gridContainer}>
        <div style={styles.grid}>
          {targetGrid.map((color, index) => (
            <div
              key={index}
              style={{
                ...styles.tile,
                backgroundColor: color,
                ...(gameState !== 'showing' ? styles.tileDisabled : {}),
              }}
            />
          ))}
        </div>
        <div style={styles.grid}>
          {playerGrid.map((color, index) => (
            <div
              key={index}
              style={{
                ...styles.tile,
                backgroundColor: color,
                ...(gameState !== 'playing' ? styles.tileDisabled : {}),
              }}
              onClick={() => handleTileClick(index)}
            />
          ))}
        </div>
      </div>
      <div>
        {gameState === 'ready' && (
          <button style={styles.button} onClick={startGame}>
            Start
          </button>
        )}
        {gameState === 'playing' && (
          <button style={styles.button} onClick={checkPattern}>
            Submit Pattern
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

export default Game3;