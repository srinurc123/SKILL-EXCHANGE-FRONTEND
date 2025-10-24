import React, { useState, useEffect, useRef } from 'react';

const Game5 = () => {
  const questions = [
    { q: "What is the capital of France?", a: ["Paris", "London", "Berlin", "Madrid"], correct: 0 },
    { q: "Which planet is known as the Red Planet?", a: ["Jupiter", "Mars", "Venus", "Mercury"], correct: 1 },
    { q: "Who painted the Mona Lisa?", a: ["Van Gogh", "Da Vinci", "Picasso", "Monet"], correct: 1 },
    { q: "What is the chemical symbol for Gold?", a: ["Au", "Ag", "Fe", "Cu"], correct: 0 },
    { q: "Which country hosted the 2020 Olympics?", a: ["Brazil", "China", "Japan", "France"], correct: 2 },
    { q: "What is the largest mammal?", a: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], correct: 1 },
    { q: "Who wrote 'Pride and Prejudice'?", a: ["Jane Austen", "Charles Dickens", "Mark Twain", "Virginia Woolf"], correct: 0 },
    { q: "What is 2 + 2 × 3?", a: ["8", "12", "10", "6"], correct: 0 },
    { q: "Which element has atomic number 1?", a: ["Helium", "Hydrogen", "Oxygen", "Nitrogen"], correct: 1 },
    { q: "What is the longest river in the world?", a: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: 1 },
    { q: "Who discovered penicillin?", a: ["Fleming", "Curie", "Edison", "Tesla"], correct: 0 },
    { q: "What is the currency of Japan?", a: ["Yuan", "Yen", "Won", "Dollar"], correct: 1 },
    { q: "Which gas is most abundant in Earth's atmosphere?", a: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correct: 2 },
    { q: "Who was the first man on the moon?", a: ["Gagarin", "Armstrong", "Aldrin", "Glenn"], correct: 1 },
    { q: "What is the square root of 16?", a: ["2", "4", "8", "6"], correct: 1 },
    { q: "Which country is known as the Land of the Rising Sun?", a: ["China", "Japan", "Korea", "Thailand"], correct: 1 },
    { q: "What is the chemical formula for water?", a: ["H2O", "CO2", "NaCl", "O2"], correct: 0 },
    { q: "Who wrote 'Romeo and Juliet'?", a: ["Shakespeare", "Chaucer", "Milton", "Dante"], correct: 0 },
    { q: "What is the smallest prime number?", a: ["1", "2", "3", "5"], correct: 1 },
    { q: "Which continent is the Sahara Desert in?", a: ["Asia", "Africa", "Australia", "South America"], correct: 1 },
  ];

  const [gameState, setGameState] = useState('ready'); // ready, playing, gameover
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('triviaRushHighScore') || 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [message, setMessage] = useState('Click Start to begin!');
  const timerRef = useRef(null);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    const shuffled = shuffleArray(questions).slice(0, 10);
    setSelectedQuestions(shuffled);
    setScore(0);
    setLevel(1);
    setMistakes(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(20);
    setGameState('playing');
    setMessage('Answer quickly!');
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    setSelectedQuestions([]);
    setScore(0);
    setLevel(1);
    setMistakes(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(20);
    setGameState('ready');
    setMessage('Click Start to begin!');
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            const newMistakes = mistakes + 1;
            setMistakes(newMistakes);
            setScore(Math.max(0, score - 10));
            setMessage('Time out! Next question...');
            if (newMistakes >= 3) {
              setGameState('gameover');
              setMessage('Game Over! Too many mistakes.');
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('triviaRushHighScore', score);
              }
              return 0;
            }
            if (currentQuestionIndex < 9) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
              setTimeLeft(Math.max(15, 20 - level * 1));
            } else {
              setGameState('gameover');
              setMessage('Game Over! Quiz completed.');
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('triviaRushHighScore', score);
              }
            }
            return Math.max(15, 20 - level * 1);
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState, currentQuestionIndex, mistakes, score, highScore, level]);

  const handleAnswer = (index) => {
    if (gameState !== 'playing') return;
    clearInterval(timerRef.current);
    const correct = index === selectedQuestions[currentQuestionIndex].correct;
    if (correct) {
      setScore(score + 10);
      setMessage('Correct! Next question...');
    } else {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setScore(Math.max(0, score - 5));
      setMessage('Wrong answer! Next question...');
      if (newMistakes >= 3) {
        setGameState('gameover');
        setMessage('Game Over! Too many mistakes.');
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('triviaRushHighScore', score);
        }
        return;
      }
    }
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(Math.max(15, 20 - level * 1));
    } else {
      setGameState('gameover');
      setMessage('Game Over! Quiz completed.');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('triviaRushHighScore', score);
      }
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && currentQuestionIndex > 0 && currentQuestionIndex % 3 === 0) {
      setLevel(level + 1);
      setMessage(`Level ${level + 1}! Time reduced.`);
    }
  }, [currentQuestionIndex]);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #2ecc71, #f1c40f)',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '2.5rem',
      marginBottom: '1rem',
      color: '#fff',
    },
    question: {
      fontSize: '1.8rem',
      color: '#fff',
      marginBottom: '1.5rem',
      textAlign: 'center',
      maxWidth: '600px',
    },
    options: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '1rem',
    },
    optionButton: {
      padding: '15px 20px',
      fontSize: '1.2rem',
      backgroundColor: '#0066cc',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    optionButtonHover: {
      backgroundColor: '#0055a4',
    },
    optionButtonDisabled: {
      backgroundColor: '#999',
      cursor: 'not-allowed',
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
      width: '300px',
      height: '15px',
      border: '2px solid #333',
      backgroundColor: '#f0f0f0',
      marginBottom: '1rem',
      overflow: 'hidden',
    },
    timerFill: {
      height: '100%',
      backgroundColor: timeLeft > 10 ? '#32cd32' : '#ff4500',
      width: `${(timeLeft / (20 - (level - 1) * 1)) * 100}%`,
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
      <h1 style={styles.title}>Rapid Trivia Rush</h1>
      <div style={styles.info}>
        Score: {score} | Level: {level} | Question: {currentQuestionIndex + 1}/10 | Mistakes: {mistakes}/3 | High Score: {highScore}
      </div>
      <div style={styles.message}>{message}</div>
      <div style={styles.timerBar}>
        <div style={styles.timerFill}></div>
      </div>
      {gameState === 'playing' && selectedQuestions[currentQuestionIndex] && (
        <>
          <div style={styles.question}>{selectedQuestions[currentQuestionIndex].q}</div>
          <div style={styles.options}>
            {selectedQuestions[currentQuestionIndex].a.map((answer, index) => (
              <button
                key={index}
                style={{
                  ...styles.optionButton,
                  ...(gameState !== 'playing' ? styles.optionButtonDisabled : {}),
                }}
                onClick={() => handleAnswer(index)}
                onMouseEnter={(e) => (e.target.style.backgroundColor = '#0055a4')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = '#0066cc')}
                disabled={gameState !== 'playing'}
              >
                {answer}
              </button>
            ))}
          </div>
        </>
      )}
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

export default Game5;