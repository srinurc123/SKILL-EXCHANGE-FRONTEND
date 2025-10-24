import React, { useState, useEffect, useRef } from 'react';

const Game2 = () => {
  const gridSize = 6;
  const symbols = ['★', '▲', '■', '●'];
  const [grid, setGrid] = useState(Array(gridSize * gridSize).fill(null));
  const [lockedTiles, setLockedTiles] = useState([]);
  const [targetSequence, setTargetSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [gameState, setGameState] = useState('ready'); // ready, showing, playing, gameover
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('Game2HighScore') || 0);
  const [moveTime, setMoveTime] = useState(0.8);
  const [roundTime, setRoundTime] = useState(12);
  const [bonusTime, setBonusTime] = useState(3);
  const [message, setMessage] = useState('Click Start to begin!');
  const moveTimerRef = useRef(null);
  const roundTimerRef = useRef(null);
  const bonusTimerRef = useRef(null);

  const generateGrid = () => {
    const newGrid = Array(gridSize * gridSize).fill(null);
    const positions = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    const activeCount = 10 + Math.min(level, 5);
    const lockedCount = 2 + Math.floor(level / 2);
    const newLocked = [];
    for (let i = 0; i < lockedCount; i++) {
      const idx = Math.floor(Math.random() * positions.length);
      newLocked.push(positions.splice(idx, 1)[0]);
    }
    for (let i = 0; i < activeCount; i++) {
      const idx = Math.floor(Math.random() * positions.length);
      newGrid[positions.splice(idx, 1)[0]] = symbols[Math.floor(Math.random() * symbols.length)];
    }
    setLockedTiles(newLocked);
    return newGrid;
  };

  const generateSequence = () => {
    const seqLength = Math.min(4 + Math.floor(level / 3), 6);
    return Array(seqLength).fill().map(() => symbols[Math.floor(Math.random() * symbols.length)]);
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setMistakes(0);
    setMoveTime(0.8);
    setRoundTime(12);
    setBonusTime(3);
    setGrid(generateGrid());
    setTargetSequence(generateSequence());
    setPlayerSequence([]);
    setGameState('showing');
    setMessage('Memorize the sequence!');
  };

  const resetGame = () => {
    clearInterval(moveTimerRef.current);
    clearInterval(roundTimerRef.current);
    clearInterval(bonusTimerRef.current);
    setGrid(Array(gridSize * gridSize).fill(null));
    setLockedTiles([]);
    setTargetSequence([]);
    setPlayerSequence([]);
    setGameState('ready');
    setScore(0);
    setLevel(1);
    setMistakes(0);
    setMoveTime(0.8);
    setRoundTime(12);
    setBonusTime(3);
    setMessage('Click Start to begin!');
  };

  useEffect(() => {
    if (gameState === 'showing') {
      setTimeout(() => {
        setGameState('playing');
        setMessage('Match the sequence!');
      }, 1500 - level * 100);
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
              localStorage.setItem('Game2HighScore', score);
            }
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
      bonusTimerRef.current = setInterval(() => {
        setBonusTime((prev) => (prev <= 0 ? 0 : prev - 0.1));
      }, 100);
    }
    return () => {
      clearInterval(roundTimerRef.current);
      clearInterval(bonusTimerRef.current);
    };
  }, [gameState, score, highScore]);

  const handleTileClick = (index) => {
    if (gameState !== 'playing' || moveTime <= 0 || lockedTiles.includes(index)) return;
    clearInterval(moveTimerRef.current);
    setMoveTime(Math.max(0.4, 0.8 - level * 0.05));
    moveTimerRef.current = setInterval(() => {
      setMoveTime((prev) => (prev <= 0 ? 0 : prev - 0.1));
    }, 100);

    const currentSymbol = grid[index];
    if (!currentSymbol) return;
    const newGrid = [...grid];
    const symbolIndex = symbols.indexOf(currentSymbol);
    newGrid[index] = symbols[(symbolIndex + 1) % symbols.length];
    setGrid(newGrid);
    const newPlayerSeq = [...playerSequence, newGrid[index]];
    setPlayerSequence(newPlayerSeq);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== targetSequence[newPlayerSeq.length - 1]) {
      setScore(Math.max(0, score - 15));
      setMessage('Wrong symbol! Try again.');
      setPlayerSequence([]);
      return;
    }

    if (newPlayerSeq.length === targetSequence.length) {
      const bonus = bonusTime > 0 ? 50 : 0;
      const newScore = score + 30 + bonus;
      setScore(newScore);
      setLevel(level + 1);
      setMoveTime(Math.max(0.4, 0.8 - (level + 1) * 0.05));
      setRoundTime(Math.max(6, 12 - (level + 1) * 0.5));
      setBonusTime(3);
      setGrid(generateGrid());
      setTargetSequence(generateSequence());
      setPlayerSequence([]);
      setMessage(`Level ${level + 1}! Memorize the new sequence.`);
      setGameState('showing');
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('Game2HighScore', newScore);
      }
    }
  };

  const checkSequence = () => {
    if (gameState !== 'playing') return;
    if (playerSequence.length !== targetSequence.length) {
      setMessage('Incomplete sequence!');
      return;
    }
    const isCorrect = playerSequence.every((sym, i) => sym === targetSequence[i]);
    if (isCorrect) {
      const bonus = bonusTime > 0 ? 50 : 0;
      setScore(score + 30 + bonus);
      setLevel(level + 1);
      setMoveTime(Math.max(0.4, 0.8 - (level + 1) * 0.05));
      setRoundTime(Math.max(6, 12 - (level + 1) * 0.5));
      setBonusTime(3);
      setGrid(generateGrid());
      setTargetSequence(generateSequence());
      setPlayerSequence([]);
      setGameState('showing');
      setMessage(`Level ${level + 1}! Memorize the new sequence.`);
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setScore(Math.max(0, score - 30));
      setRoundTime((prev) => Math.max(3, prev - 2));
      setPlayerSequence([]);
      setMessage('Wrong sequence! Try again.');
      if (newMistakes >= 2) {
        setGameState('gameover');
        setMessage('Game Over! Too many mistakes.');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('Game2HighScore', score);
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
      background: 'linear-gradient(135deg, #6ab0ff, #c3a6ff)',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '1rem',
      color: '#fff',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridSize}, 50px)`,
      gap: '3px',
      marginBottom: '1rem',
    },
    tile: {
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #333',
      backgroundColor: '#fff',
      fontSize: '1.5rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    tileLocked: {
      backgroundColor: '#555',
      color: '#fff',
      cursor: 'not-allowed',
    },
    tileDisabled: {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    sequence: {
      fontSize: '1.8rem',
      color: '#fff',
      marginBottom: '1rem',
    },
    info: {
      marginBottom: '1rem',
      fontSize: '1.2rem',
      color: '#fff',
    },
    message: {
      fontSize: '1.5rem',
      color: gameState === 'gameover' ? '#ff3333' : '#fff',
      marginBottom: '1rem',
    },
    timerBar: {
      width: '150px',
      height: '12px',
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
      <h1 style={styles.title}>Chaos Cipher</h1>
      <div style={styles.info}>
        Score: {score} | Level: {level} | Mistakes: {mistakes}/2 | High Score: {highScore}
      </div>
      <div style={styles.message}>{message}</div>
      <div style={styles.sequence}>
        {gameState === 'showing' ? targetSequence.join(' ') : playerSequence.join(' ')}
      </div>
      <div style={styles.timerBar}>
        <div style={{ ...styles.timerFill, width: `${(moveTime / (0.8 - (level - 1) * 0.05)) * 100}%`, backgroundColor: moveTime > 0.4 ? '#32cd32' : '#ff4500' }}></div>
      </div>
      <div style={styles.timerBar}>
        <div style={{ ...styles.timerFill, width: `${(roundTime / (12 - (level - 1) * 0.5)) * 100}%`, backgroundColor: roundTime > 6 ? '#32cd32' : '#ff4500' }}></div>
      </div>
      <div style={styles.timerBar}>
        <div style={{ ...styles.timerFill, width: `${(bonusTime / 3) * 100}%`, backgroundColor: bonusTime > 1.5 ? '#32cd32' : '#ff4500' }}></div>
      </div>
      <div style={styles.grid}>
        {grid.map((symbol, index) => (
          <div
            key={index}
            style={{
              ...styles.tile,
              ...(lockedTiles.includes(index) ? styles.tileLocked : {}),
              ...(gameState !== 'playing' || lockedTiles.includes(index) ? styles.tileDisabled : {}),
            }}
            onClick={() => handleTileClick(index)}
          >
            {symbol}
          </div>
        ))}
      </div>
      <div>
        {gameState === 'ready' && (
          <button style={styles.button} onClick={startGame}>
            Start
          </button>
        )}
        {gameState === 'playing' && (
          <button style={styles.button} onClick={checkSequence}>
            Submit Sequence
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

export default Game2;