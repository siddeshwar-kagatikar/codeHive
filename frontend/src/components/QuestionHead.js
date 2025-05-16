import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import questionContext from '../context/questionContext';
import Editques from './Editques';
import '../styles/QuestionHead.css'; // Custom styles for this component

export default function QuestionHead(props) {
  const context = useContext(questionContext);
  const { deleteQuestion } = context;
  const user = localStorage.getItem('user_type');
  const admin = user === 'admin';
  const navigate = useNavigate();

  const [currentHeading, setCurrentHeading] = useState(props.heading);
  const [currentQuestion, setCurrentQuestion] = useState(props.question);
  const [currentExample, setCurrentExample] = useState(props.example);
  const [currentDifficulty, setCurrentDifficulty] = useState(props.difficulty);

  useEffect(() => {
    setCurrentHeading(props.heading);
    setCurrentQuestion(props.question);
    setCurrentExample(props.example);
    setCurrentDifficulty(props.difficulty);
  }, [props.heading, props.question, props.example, props.difficulty]);

  const handleDel = () => {
    deleteQuestion(props.id, "1213");
    window.location.reload();
  };

  const onPlagCheck = () => {
    navigate(`/plagcheck/${props.id}`);
  };

  const onAddTestcases = () => {
    navigate(`/testcases/${props.id}`);
  };

  return (
    <li className="question-item">
      <div className="question-header">
        <Link
          to={{
            pathname: `/question/${props.id}`,
          }}
          state={{
            qid: props.id,
            heading: currentHeading,
            question: currentQuestion,
            example: currentExample,
          }}
          className="question-title"
        >
          {currentHeading}
        </Link>
        <span
          className={`difficulty-badge ${
            currentDifficulty === 1
              ? 'difficulty-easy'
              : currentDifficulty === 2
              ? 'difficulty-medium'
              : 'difficulty-hard'
          }`}
        >
          {currentDifficulty === 1
            ? 'Easy'
            : currentDifficulty === 2
            ? 'Medium'
            : 'Hard'}
        </span>
      </div>
      <div className="question-actions">
        {admin && (
          <button
            className="btn-delete"
            aria-label="Remove"
            onClick={handleDel}
          >
            Delete
          </button>
        )}
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
        {admin && (<button
          className="btn-plag-check"
          aria-label="Plagiarism Check"
          onClick={onPlagCheck}
        >
          Plag Check
        </button>)}
        {admin && (<button
          className="btn-add-testcases"
          aria-label="Add Test Cases"
          onClick={onAddTestcases}
        >
          Add Testcases
        </button>)}
      </div>
    </li>
  );
}
