import React, { useContext, useEffect, useState } from 'react'
import questionContext from '../context/questionContext';
import QuestionHead from './QuestionHead';
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

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
    }, []);  // Get questions when component mounts

    useEffect(() => {
        // Only update the questions if the questions are fetched and updatedQuestions is empty
        if (questions.length > 0 && updatedQuestions.length === 0) {
            setUpdatedQuestions(questions);
        }
    }, [questions]);  // This effect runs when the questions are updated

    useEffect(() => {
        socket.on('receive_question', (data) => {
            console.log("Received updated question data:", data);
            // Update the question in the state (find and replace the existing one)
            setUpdatedQuestions((prevQuestions) => {
                return prevQuestions.map((question) =>
                    question._id === data._id ? { ...question, ...data } : question
                );
            });
        });

        // Cleanup the socket listener on unmount
        return () => {
            socket.off('receive_question');
        };
    }, []);  // Empty dependency array ensures this effect runs only once

    return (
        <>
            <div className='container'>
                <h2>Questions</h2>
                <ul className="list-group">
                    {updatedQuestions.length === 0 ? (
                        <p>No questions...</p>
                    ) : (
                        updatedQuestions.map((q) => {
                            return (
                                <QuestionHead 
                                    key={q._id} 
                                    id={q._id} 
                                    heading={q.heading} 
                                    question={q.question} 
                                    example={q.example} 
                                    difficulty={q.difficulty}
                                />
                            );
                        })
                    )}
                </ul>
            </div>
        </>
    );
}
