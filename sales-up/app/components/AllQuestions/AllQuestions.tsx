import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useTranslation } from '@/app/context/useTranslation';

interface Answer {
  id: number;
  text: string;
  category: string;
  points: number;
  next: number;
}

interface Slide {
  id: number;
  question: string;
  answers?: Answer[];
}

const slidesFiles: Record<string, string> = {
  ro: '/assets/json/slidesRo.json',
  fr: '/assets/json/slidesFr.json',
  de: '/assets/json/slidesDe.json',
  it: '/assets/json/slidesIt.json',
  es: '/assets/json/slidesEs.json',
  en: '/assets/json/slidesEn.json',
};

const AllQuestions: React.FC = () => {
  const { t, language } = useTranslation();
  const [slidesData, setSlidesData] = useState<Slide[]>([]);

  useEffect(() => {
    const loadSlides = async () => {
      const file = slidesFiles[language] || slidesFiles['ro'];
      const res = await fetch(file);
      const data: Slide[] = await res.json();
      setSlidesData(data);
    };
    loadSlides();
  }, [language]);

  const normalizedSlides: Slide[] = (slidesData as Array<{
    id: number | string;
    question: string;
    answers?: Array<{
      id: number | string;
      text: string;
      category: string;
      points: number | string;
      next: number | string;
    }>;
  }>).map((slide) => ({
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

  return (
    <div className={style.container}>
      <button
        className={style.backBtn}
        onClick={() => window.location.href = '/'}
      >
        &larr; {t('back_to_main')}
      </button>
      <h1 className={style.title}>{t('all_questions_and_answers')}</h1>
      <table className={style.table}>
        <thead>
          <tr>
            <th className={style.th}>{t('slide')}</th>
            <th className={style.th}>{t('question')}</th>
            <th className={style.th}>{t('answer')}</th>
            <th className={style.th}>{t('category')}</th>
            <th className={style.th}>{t('points')}</th>
          </tr>
        </thead>
        <tbody>
          {normalizedSlides.map((slide, slideIdx) =>
            slide.answers && slide.answers.length > 0
              ? slide.answers.map((answer, idx) => (
                  <tr
                    key={`${slide.id}-${idx}`}
                    className={
                      idx === slide.answers!.length - 1
                        ? style.lastAnswerRow
                        : undefined
                    }
                  >
                    {idx === 0 ? (
                      <td
                        className={
                          style.td + ' ' + (slideIdx !== 0 ? style.questionBorder : '')
                        }
                        rowSpan={slide.answers ? slide.answers.length : 1}
                      >
                        {slide.id}
                      </td>
                    ) : null}
                    {idx === 0 ? (
                      <td
                        className={
                          style.td + ' ' + (slideIdx !== 0 ? style.questionBorder : '')
                        }
                        rowSpan={slide.answers ? slide.answers.length : 1}
                      >
                        {slide.question}
                      </td>
                    ) : null}
                    <td className={style.td}>{answer.text}</td>
                    <td className={style.td}>{answer.category}</td>
                    <td className={style.td}>{answer.points}</td>
                  </tr>
                ))
              : (
                  <tr key={slide.id} className={style.lastAnswerRow}>
                    <td className={style.td + ' ' + (slideIdx !== 0 ? style.questionBorder : '')}>{slide.id}</td>
                    <td className={style.td + ' ' + (slideIdx !== 0 ? style.questionBorder : '')}>{slide.question}</td>
                    <td className={style.td} colSpan={3}>
                      {t('no_answers')}
                    </td>
                  </tr>
                )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllQuestions;
