import React, { useContext, useState, useEffect } from 'react'
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
                return <QuestionHead key={q.id} heading={q.heading} />;
            })}
            </ul>
        </div>
    {/* <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between align-items-center">
            A second item
            <button className="btn btn-danger btn-sm" aria-label="Remove">X</button>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
            A third item
            <button className="btn btn-danger btn-sm" aria-label="Remove">X</button>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
            A fourth item
            <button className="btn btn-danger btn-sm" aria-label="Remove">X</button>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
            And a fifth one
            <button className="btn btn-danger btn-sm" aria-label="Remove">X</button>
        </li>
    </ul> */}
    </>
  )
}
