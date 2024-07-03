import React, { useState } from 'react';
import styles from './App.module.css';

function QuestionForm({ socket }) {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState(Array(4).fill(''));
  const [correctAnswer, setCorrectAnswer] = useState('1');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending question');
    socket.send(JSON.stringify({
      type: 'new-question',
      question,
      answers,
      correctAnswer
    }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.question_form}>
      <input type="text" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Enter question" required />
      {answers.map((answer, index) => (
        <input key={index} type="text" value={answer} onChange={e => {
          const newAnswers = [...answers];
          newAnswers[index] = e.target.value;
          setAnswers(newAnswers);
        }} placeholder={`Answer ${index + 1}`} required />
      ))}
      <label>Correct answer:</label>
      <select value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)}>
        <option value="1">Answer 1</option>
        <option value="2">Answer 2</option>
        <option value="3">Answer 3</option>
        <option value="4">Answer 4</option>
      </select>
      <button type="submit">Submit Question</button>
    </form>
  );
}

export default QuestionForm;
