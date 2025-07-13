'use client';

import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import Timer from '../Timer/Timer';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/context/useTranslation';
import { supabase } from '@/utils/supabaseClient';
import Navigation from './Navigation';

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

interface UserAnswer {
  slideId: number;
  question: string;
  selectedAnswer: string;
  category: string;
  points: number;
}

const slidesFiles: Record<string, string> = {
  ro: '/assets/json/slidesRo.json',
  fr: '/assets/json/slidesFr.json',
  de: '/assets/json/slidesDe.json',
  it: '/assets/json/slidesIt.json',
  es: '/assets/json/slidesEs.json',
  en: '/assets/json/slidesEn.json',
};

const getRatingLabel = (total: number): string => {
  if (total <= 15) return 'Lost in the store';
  if (total <= 35) return 'Beginner';
  if (total <= 55) return 'Advanced';
  if (total <= 75) return 'Senior consultant';
  return 'King of the Day';
};

const Game = () => {
  const router = useRouter();
  const { t, language } = useTranslation();
  const [slidesData, setSlidesData] = useState<Slide[]>([]);
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
  const [showImage, setShowImage] = useState(true);
  const [proposal, setProposal] = useState<number | null>(null);
  const [sale, setSale] = useState<number | null>(null);
  const [numberOfSales, setNumberOfSales] = useState<number>(0);

  const proposalRules = [
    { questionId: 28, answerId: 1, action: 'set', value: 599 },
    { questionId: 28, answerId: 2, action: 'set', value: 649 },
    { questionId: 29, answerId: 1, action: 'set', value: 599 },
    { questionId: 29, answerId: 2, action: 'set', value: 649 },
    { questionId: 30, answerId: 2, action: 'set', value: 599 },
    { questionId: 34, answerId: 2, action: 'set', value: 649 },
    { questionId: 13, answerId: 3, action: 'set', value: 599 },
    { questionId: 37, answerId: 1, action: 'set', value: 1019 },
    { questionId: 37, answerId: 2, action: 'set', value: 599 },
    { questionId: 14, answerId: 2, action: 'set', value: 729 },
    { questionId: 14, answerId: 3, action: 'set', value: 1019 },
    { questionId: 33, answerId: 2, action: 'add', value: 49 },
    { questionId: 16, answerId: 2, action: 'add', value: 49 },
    { questionId: 32, answerId: 2, action: 'subtract_percent', value: 5 },
    { questionId: 15, answerId: 2, action: 'subtract_percent', value: 3 },
  ];

  const saleRules = [
    { questionId: 16, answerId: 1 },
    { questionId: 16, answerId: 3 },
    { questionId: 17, answerId: 1 },
    { questionId: 17, answerId: 3 },
    { questionId: 17, answerId: 4 },
  ];

  useEffect(() => {
    const loadSlides = async () => {
      const file = slidesFiles[language] || slidesFiles['ro'];
      const res = await fetch(file);
      const data: Slide[] = await res.json();
      setSlidesData(data);
      setCurrentId(1);
      setScore({
        greeting: 0,
        proposal: 0,
        closing: 0,
        csus: 0,
        calificare: 0,
        total: 0,
      });
      setElapsedTime(null);
      setTimeUp(false);
      setUserAnswers([]);
      setProposal(null);
    };
    loadSlides();
  }, [language]);

  const normalizedSlides: Slide[] = slidesData.map((slide: Slide) => ({
    id: Number(slide.id),
    question: slide.question,
    answers:
      Array.isArray(slide.answers) && slide.answers.length > 0
        ? slide.answers.map((answer: Answer) => ({
            id: Number(answer.id),
            text: answer.text,
            category: answer.category,
            points: Number(answer.points),
            next: Number(answer.next),
          }))
        : undefined,
  }));

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
    proposalRules.forEach(rule => {
      if (currentId === rule.questionId && answer.id === rule.answerId) {
        if (rule.action === 'set') {
          setProposal(rule.value);
        } else if (rule.action === 'add') {
          setProposal(prev => (prev ?? 0) + rule.value);
        } else if (rule.action === 'subtract_percent') {
          setProposal(prev => prev !== null ? Math.round(prev * (1 - rule.value / 100)) : prev);
        }
      }
    });

    saleRules.forEach(rule => {
      if (currentId === rule.questionId && answer.id === rule.answerId) {
        setSale(prev => (prev ?? 0) + (proposal ?? 0));
        setNumberOfSales(prev => prev + 1);
      }
    });
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
    setProposal(null);
  };

  const resetGameAndSales = () => {
    resetGame();
    setNumberOfSales(0);
    setSale(0);
  };

  const updateSalesInDatabase = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: salesData, error: salesError } = await supabase
      .from('users')
      .select('number_of_sales, total_sales')
      .eq('id', user.id)
      .single();
    if (salesError) return;
    const dbSales = typeof salesData?.number_of_sales === 'number' ? salesData.number_of_sales : 0;
    const newTotalSalesCount = dbSales + numberOfSales;
    await supabase
      .from('users')
      .update({ number_of_sales: newTotalSalesCount })
      .eq('id', user.id);
    const dbTotalSales = typeof salesData?.total_sales === 'number' ? salesData.total_sales : 0;
    const newTotalSalesValue = dbTotalSales + (sale ?? 0);
    await supabase
      .from('users')
      .update({ total_sales: newTotalSalesValue })
      .eq('id', user.id);
  };

  const saveSession = async () => {
    if (currentSlide?.id !== 38 && currentSlide?.id !== 22) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    try {
      await supabase.from('user_sessions').insert([
        {
          user_id: user.id,
          date: new Date().toISOString(),
          duration: elapsedTime ?? null,
          score,
          rating: getRatingLabel(score.total),
          sales_made: sale,
          game_summary: userAnswers
        }
      ]);
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  };

  useEffect(() => {
    setShowImage(true);
  }, [currentSlide?.id]);

  if (!currentSlide) {
    return <div>Question not found.</div>;
  }

  return (
    <div className={style.container}>
      <Navigation goToSlide38={() => setCurrentId(38)} onRestartGame={resetGame} />
      <p className={style.slideId}>{t('slide')}: {currentSlide.id}</p>
      <div className={style.subContainer}>
        {Array.isArray(currentSlide.answers) && currentSlide.answers.length > 0 && (
          <Timer isActive={timerActive} onStop={handleTimerStop} resetKey={timerResetKey} />
        )}
        {showImage && (
          <img
            src={`/assets/jpg/${currentSlide.id}.jpg`}
            alt={`Slide ${currentSlide.id}`}
            className={style.slideImage}
            onError={() => setShowImage(false)}
          />
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
              <span style={{ fontWeight: 600 }}>{t('time_spent')}: </span>
              <span style={{ fontWeight: 600 }}>{elapsedTime !== null ? `${Math.floor(elapsedTime / 60).toString().padStart(2, '0')}:${(elapsedTime % 60).toString().padStart(2, '0')}` : '--:--'}</span>
              {timeUp && (
                <div style={{ color: 'red', fontWeight: 700, marginTop: 8 }}>{t('time_expired')}</div>
              )}
            </div>
            <div className={style.points}>
              <div className={style.pointsContainer}>
                <h3 className={style.score}>{t('final_score')}:</h3>
                <ul className={style.scoreList}>
                  <li className={style.scoreElement}>{t('greeting')}: {score.greeting}</li>
                  <li className={style.scoreElement}>{t('proposal')}: {score.proposal}</li>
                  <li className={style.scoreElement}>{t('closing')}: {score.closing}</li>
                  <li className={style.scoreElement}>{t('csus')}: {score.csus}</li>
                  <li className={style.scoreElement}>{t('calificare')}: {score.calificare}</li>
                  <li className={style.total}>{t('total')}: {score.total}</li>
                </ul>
                <p className={style.rating}>
                  {t('your_rating')}: <strong>{getRatingLabel(score.total)}</strong>
                </p>
              </div>
            </div>
            <div className={style.actions}>
              <button className={style.btn} onClick={resetGame}>
                {t('start_over')}
              </button>
              <button className={style.btn} onClick={async () => { await saveSession(); setCurrentId(38); }}>
                {t('close_the_day')}
              </button>
            </div>
          </>
        ) : currentSlide.id === 38 ? (
          <div className={style.points}>
            <div className={style.pointsContainer}>
              <p>{t('total_brought_to_store').replace('...', String(sale !== null ? sale : '0'))}</p>
              <p>{t('your_rating')}: <strong>{getRatingLabel(score.total)}</strong></p>
              <p>{t('sales_made').replace('...', String(numberOfSales))}</p>
              <div className={style.responsiveTable}>
                <table style={{ width: '100%', marginTop: 24, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ccc', padding: 4 }}>{t('slide')}</th>
                      <th style={{ border: '1px solid #ccc', padding: 4 }}>{t('question')}</th>
                      <th style={{ border: '1px solid #ccc', padding: 4 }}>{t('answer')}</th>
                      <th style={{ border: '1px solid #ccc', padding: 4 }}>{t('category')}</th>
                      <th style={{ border: '1px solid #ccc', padding: 4 }}>{t('points')}</th>
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
              </div>
              <button className={style.btn} onClick={resetGameAndSales}>
              {t('start_over')}
            </button>
            <button className={style.btn} onClick={() => router.push('/menu')}>
              {t('menu')}
            </button>
            </div>
          </div>
        ) : (
          <div className={style.actions}>
            <button className={style.btn} onClick={() => setCurrentId(22)}>
              {t('calculate_score')}
            </button>
            <button className={style.btn} onClick={resetGameAndSales}>
              {t('start_over')}
            </button>
            <button className={style.btn} onClick={async () => { await saveSession(); setCurrentId(38); updateSalesInDatabase(); }}>
              {t('close_the_day')}
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
            width={60}
            height={60}
            style={{ maxWidth: '60px', height: 'auto', cursor: 'pointer' }}
            onClick={() => router.push('/all-questions')}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
