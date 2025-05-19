import React from 'react';
import slidesData from '@/public/assets/json/slidesRo.json';
import style from './style.module.scss';

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

const AllQuestions: React.FC = () => {
  return (
    <div className={style.container}>
      <button
        className={style.backBtn}
        onClick={() => window.location.href = '/'}
      >
        &larr; Înapoi la pagina principală
      </button>
      <h1 className={style.title}>Toate întrebările și răspunsurile</h1>
      <table className={style.table}>
        <thead>
          <tr>
            <th className={style.th}>Slide</th>
            <th className={style.th}>Întrebare</th>
            <th className={style.th}>Răspuns</th>
            <th className={style.th}>Categorie</th>
            <th className={style.th}>Puncte</th>
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
                      (Fără răspunsuri)
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
