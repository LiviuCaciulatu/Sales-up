'use client';

import React, { useState } from 'react';
import slidesData from '@/public/assets/json/slidesRo.json';
import style from './style.module.scss';
import Timer from '../Timer/Timer';
import { useRouter } from 'next/navigation';

type Answer = {
  id: number;
  text: string;
  category: string;
  points: number;
  next: number;
};

type Slide = {
  id: number;
  question: string;
  answers?: Answer[];
};

type Score = {
  greeting: number;
  proposal: number;
  closing: number;
  csus: number;
  calificare: number;
  total: number;
};

// Add a type for user answers
interface UserAnswer {
  slideId: number;
  question: string;
  selectedAnswer: string;
  category: string;
  points: number;
}

// Use the correct type for slidesData and answers, and ensure all ids are numbers
const normalizedSlides: Slide[] = (slidesData as Array<{ id: number | string; question: string; answers?: Array<{ id: number | string; text: string; category: string; points: number | string; next: number | string; }>; }> ).map((slide) => ({
  id: Number(slide.id),
  question: slide.question,
  answers:
    Array.isArray(slide.answers) && slide.answers.length > 0
      ? slide.answers.map((answer) => ({
          id: Number(answer.id),
          text: answer.text,
          category: answer.category,
          points: Number(answer.points),
          next: Number(answer.next),
        }))
      : undefined,
}));

const getRatingLabel = (total: number): string => {
  if (total <= 15) return 'Lost in the store';
  if (total <= 35) return 'Beginner';
  if (total <= 55) return 'Advanced';
  if (total <= 75) return 'Senior consultant';
  return 'King of the Day';
};

const Game = () => {
  const router = useRouter();
  const [currentId, setCurrentId] = useState<number>(1);
  const [score, setScore] = useState<Score>({
    greeting: 0,
    proposal: 0,
    closing: 0,
    csus: 0,
    calificare: 0,
    total: 0,
  });
  const [timerActive, setTimerActive] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  const currentSlide = normalizedSlides.find((slide) => slide.id === currentId);

  React.useEffect(() => {
    if (currentSlide && Array.isArray(currentSlide.answers) && currentSlide.answers.length > 0) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
      if (elapsedTime === null && timerActive) {
        setElapsedTime((prev) => {
          if (prev !== null) return prev;
          const timerDiv = document.querySelector('[data-timer-remaining]');
          if (timerDiv) {
            const remaining = parseInt(timerDiv.getAttribute('data-timer-remaining') || '300', 10);
            return 300 - remaining;
          }
          return 0;
        });
      }
    }
  }, [currentSlide, elapsedTime, timerActive]);

  const handleTimerStop = (remaining: number) => {
    const timeSpent = 300 - remaining;
    setElapsedTime(timeSpent);
    if (remaining === 0) {
      setTimeUp(true);
      setCurrentId(22);
    }
  };

  const handleAnswerClick = (answer: Answer) => {
    setTimeUp(false);
    if (
      normalizedSlides.find((slide) => slide.id === answer.next)?.answers === undefined &&
      elapsedTime === null
    ) {
      const timerDiv = document.querySelector('[data-timer-remaining]');
      let timeTaken = 0;
      if (timerDiv) {
        const remaining = parseInt(timerDiv.getAttribute('data-timer-remaining') || '300', 10);
        timeTaken = 300 - remaining;
      }
      setElapsedTime(timeTaken);
    }
    const updatedScore = { ...score };

    if (updatedScore.hasOwnProperty(answer.category)) {
      updatedScore[answer.category as keyof Score] += answer.points;
    }

    updatedScore.total += answer.points;

    // Save the user's answer
    setUserAnswers((prev) => {
      const updated = [
        ...prev,
        {
          slideId: currentSlide?.id || 0,
          question: currentSlide?.question || '',
          selectedAnswer: answer.text,
          category: answer.category,
          points: answer.points,
        },
      ];
      console.log('User Answers:', updated);
      return updated;
    });

    setScore(updatedScore);
    setCurrentId(answer.next);
  };

  const resetGame = () => {
    setScore({
      greeting: 0,
      proposal: 0,
      closing: 0,
      csus: 0,
      calificare: 0,
      total: 0,
    });
    setCurrentId(1);
    setTimerResetKey((k) => k + 1);
    setElapsedTime(null);
    setTimeUp(false);
    setUserAnswers([]);
  };

  if (!currentSlide) {
    return <div>Question not found.</div>;
  }

  return (
    <div className={style.container}>
      <p className={style.slideId}>Slide: {currentSlide.id}</p>
      <div className={style.subContainer}>

        {Array.isArray(currentSlide.answers) && currentSlide.answers.length > 0 && (
          <Timer isActive={timerActive} onStop={handleTimerStop} resetKey={timerResetKey} />
        )}
        <h2 className={style.question}>{currentSlide.question}</h2>

        {Array.isArray(currentSlide.answers) && currentSlide.answers.length > 0 ? (
          <div className={style.answer} key={`answers-${currentSlide.id}`}>
            {currentSlide.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswerClick(answer)}
                className={style.btn}
              >
                {answer.text}
              </button>
            ))}
          </div>
        ) : currentSlide.id === 22 ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Timp parcurs: </span>
              <span style={{ fontWeight: 600 }}>{elapsedTime !== null ? `${Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:${(elapsedTime % 60).toString().padStart(2, '0')}` : '--:--'}</span>
              {timeUp && (
                <div style={{ color: 'red', fontWeight: 700, marginTop: 8 }}>Timpul a expirat!</div>
              )}
            </div>
            <div className={style.points}>
              <div className={style.pointsContainer}>
                <h3 className={style.score}>Scor final:</h3>
                <ul className={style.scoreList}>
                  <li className={style.scoreElement}>Greeting: {score.greeting}</li>
                  <li className={style.scoreElement}>Proposal: {score.proposal}</li>
                  <li className={style.scoreElement}>Closing: {score.closing}</li>
                  <li className={style.scoreElement}>CSUS: {score.csus}</li>
                  <li className={style.scoreElement}>Calificare: {score.calificare}</li>
                  <li className={style.total}>Total: {score.total}</li>
                </ul>
                <p className={style.rating}>
                  Calificativul tău este: <strong>{getRatingLabel(score.total)}</strong>
                </p>

              </div>
            </div>
            <div className={style.actions}>
              <button className={style.btn} onClick={resetGame}>
                Start over
              </button>
              <button className={style.btn} onClick={() => setCurrentId(38)}>
                Close the day
              </button>
            </div>
          </>
        ) : currentSlide.id === 38 ? (
          <div className={style.points}>
            <div className={style.pointsContainer}>
              <p>În total, ai adus magazinului suma de ... USD</p>
              <p>Calificativul tău este: <strong>{getRatingLabel(score.total)}</strong></p>
              <p>Ai făcut ... vânzări</p>
              <table style={{ width: '100%', marginTop: 24, borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>Slide</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>Întrebare</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>Răspuns</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>Categorie</th>
                    <th style={{ border: '1px solid #ccc', padding: 4 }}>Puncte</th>
                  </tr>
                </thead>
                <tbody>
                  {userAnswers.map((ua, idx) => (
                    <tr key={idx}>
                      <td style={{ border: '1px solid #ccc', padding: 4 }}>{ua.slideId}</td>
                      <td style={{ border: '1px solid #ccc', padding: 4 }}>{ua.question}</td>
                      <td style={{ border: '1px solid #ccc', padding: 4 }}>{ua.selectedAnswer}</td>
                      <td style={{ border: '1px solid #ccc', padding: 4 }}>{ua.category}</td>
                      <td style={{ border: '1px solid #ccc', padding: 4 }}>{ua.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className={style.btn} onClick={resetGame}>
                Incepe o nouă zi
              </button>
            </div>
          </div>
        ) : (
          <div className={style.actions}>
            <button className={style.btn} onClick={() => setCurrentId(22)}>
              Calculează punctaj
            </button>
            <button className={style.btn} onClick={resetGame}>
              Start over
            </button>
            <button className={style.btn} onClick={() => setCurrentId(38)}>
              Close the day
            </button>
          </div>
        )}
      </div>
      <div className={style.footer}>
        <a
          href="https://cleancodeit.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={style.copyright}
          style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
        >
          &copy; {new Date().getFullYear()}  CleanCodeIT
        </a>
        <div className={style.logo}>
          <img
            src="/assets/svg/logo-cc.svg"
            alt="CleanCodeIT Logo"
            style={{ maxWidth: '60px', height: 'auto', cursor: 'pointer' }}
            onClick={() => router.push('/all-questions')}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
