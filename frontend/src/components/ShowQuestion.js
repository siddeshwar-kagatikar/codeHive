import React, { useContext, useEffect, useState } from 'react';
import questionContext from '../context/questionContext';
import QuestionHead from './QuestionHead';
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import '../styles/ShowQuestion.css'; // Custom styles for the component
const socket = io.connect('https://codehive-zgga.onrender.com');

export default function ShowQuestion() {
    const context = useContext(questionContext);
    const { getQuestions, questions } = context;
    const navigate = useNavigate();
    const [updatedQuestions, setUpdatedQuestions] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getQuestions("1213");
        } else {
            navigate('/login');
        }
    }, []); // Get questions when component mounts

    useEffect(() => {
        if (questions.length > 0 && updatedQuestions.length === 0) {
            setUpdatedQuestions(questions);
        }
    }, [questions]); // This effect runs when the questions are updated

    useEffect(() => {
        socket.on('receive_question', (data) => {
            console.log("Received updated question data:", data);
            setUpdatedQuestions((prevQuestions) =>
                prevQuestions.map((question) =>
                    question._id === data._id ? { ...question, ...data } : question
                )
            );
        });

        return () => {
            socket.off('receive_question');
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <div className="questions-container">
            <header className="questions-header">
                <h2 className="questions-title">Available Questions</h2>
            </header>
            <ul className="questions-list">
                {updatedQuestions.length === 0 ? (
                    <p className="no-questions">No questions available...</p>
                ) : (
                    updatedQuestions.map((q) => (
                        <QuestionHead
                            key={q._id}
                            id={q._id}
                            heading={q.heading}
                            question={q.question}
                            example={q.example}
                            difficulty={q.difficulty}
                        />
                    ))
                )}
            </ul>
        </div>
    );
}
