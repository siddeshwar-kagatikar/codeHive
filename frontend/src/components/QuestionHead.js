import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import questionContext from '../context/questionContext';
import Editques from './Editques';

export default function QuestionHead(props) {
  const context = useContext(questionContext);
  const { deleteQuestion } = context;
  const user = localStorage.getItem('user_type');
  const admin = user === 'admin';

  // Use state to track the current values of heading, question, etc.
  const [currentHeading, setCurrentHeading] = useState(props.heading);
  const [currentQuestion, setCurrentQuestion] = useState(props.question);
  const [currentExample, setCurrentExample] = useState(props.example);
  const [currentDifficulty, setCurrentDifficulty] = useState(props.difficulty);

  useEffect(() => {
    // Update the state when the props change
    setCurrentHeading(props.heading);
    setCurrentQuestion(props.question);
    setCurrentExample(props.example);
    setCurrentDifficulty(props.difficulty);
  }, [props.heading, props.question, props.example, props.difficulty]);

  const handleDel = () => {
    deleteQuestion(props.id, "1213");
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <Link
        to={{
          pathname: `/question/${props.id}`,
        }}
        state={{
          heading: currentHeading,
          question: currentQuestion,
          example: currentExample,
        }}
        className="text-decoration-none"
      >
        {currentHeading}
      </Link>
      <div className="d-flex align-items-center">
        <span
          className={`badge ${
            currentDifficulty === 1
              ? 'bg-success'
              : currentDifficulty === 2
              ? 'bg-warning text-dark'
              : 'bg-danger'
          } me-2`}
        >
          {currentDifficulty === 1
            ? 'Easy'
            : currentDifficulty === 2
            ? 'Medium'
            : 'Hard'}
        </span>
        {admin && (
          <button
            className="btn btn-danger btn-sm"
            aria-label="Remove"
            onClick={handleDel}
          >
            X
          </button>
        )}
        {/* Add Edit button */}
        {admin && (
          <Editques
            key={props.id}
            heading={currentHeading}
            question={currentQuestion}
            example={currentExample}
            difficulty={currentDifficulty}
            id={props.id}
          />
        )}
      </div>
    </li>
  );
}
