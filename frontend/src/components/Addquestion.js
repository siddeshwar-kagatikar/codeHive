import React, { useContext, useState, useEffect } from 'react';
import questionContext from '../context/questionContext';
import ShowQuestion from './ShowQuestion';
import { useNavigate } from "react-router-dom";
import TimerContext from '../context/TimerContext';
import '../styles/AddQuestion.css'; // Import the custom CSS for the color scheme

export default function Addquestion() {
  const [heading, setHeading] = useState("");
  const [question, setQuestion] = useState("");
  const [example, setExample] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const context = useContext(questionContext);
  const { addQuestion } = context;
  const navigate = useNavigate();
  const { timeLeft } = useContext(TimerContext);

  const user = localStorage.getItem('user_type');
  const admin = user === 'admin';

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log("Question Added");
    addQuestion("1213", heading, question, example, difficulty);
  };

  const onMeeting = () => {
    navigate("/interview")
  }

  useEffect(() => {
    if (timeLeft === null && !admin) {
      navigate("/userhome");
    }
  }, [timeLeft, admin, navigate]); 

  return (
    <div className="add-question-container">
      {admin && (
        <button
          className="btn cta-button mt-3"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasScrolling"
          aria-controls="offcanvasScrolling"
        >
          Add Question
        </button>
      )}
      <div className="container mt-3">
        <ShowQuestion />
      </div>
      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabIndex="-1"
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasScrollingLabel">
            Enter Question Details
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="Heading" className="form-label">Heading</label>
              <input
                type="text"
                className="form-control"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="floatingTextarea2" className="form-label">
                Write question details here
              </label>
              <textarea
                className="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{ height: '200px' }}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="floatingTextarea2" className="form-label">Example</label>
              <textarea
                className="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{ height: '100px' }}
                value={example}
                onChange={(e) => setExample(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="difficulty" className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
              >
                <option value="1">Easy</option>
                <option value="2">Medium</option>
                <option value="3">Hard</option>
              </select>
            </div>
            <button className="btn cta-button" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
      <button className="btn cta-button mt-2" type="button" onClick={onMeeting}>
        Create Meeting
      </button>
    </div>
  );
}
