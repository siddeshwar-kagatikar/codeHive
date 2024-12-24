import React, { useContext, useEffect } from 'react'
import questionContext from '../context/questionContext';
import QuestionHead from './QuestionHead';
import { useNavigate } from "react-router-dom";

export default function ShowQuestion() {
    const context = useContext(questionContext);
    const {getQuestions} = context;
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token')){ getQuestions("1213"); }
        else{
            navigate('/login')
        }
    },[])
    const {questions} = context;
  return (
    <>
        <div className='container'>
            <h2>Questions</h2>
            <ul className="list-group">
            {questions.map((q) => {
                return <QuestionHead key={q._id} id={q._id} heading={q.heading} question={q.question} example={q.example} difficulty={q.difficulty}/>;
            })}
            </ul>
        </div>
    </>
  )
}
