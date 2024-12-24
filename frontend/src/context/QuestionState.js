import { useState } from 'react';
import QuestionContext from './questionContext';

const QuestionState = (props) => {
  const [questions, setQuestions] = useState([]);
  const host = "http://localhost:5000";

  const getQuestions = async (roomId) => {
    const response = await fetch(`${host}/api/question/getquestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ roomId })
    });
    const json = await response.json();
    console.log(json);
    setQuestions(json);
  }

  const addQuestion = async (roomId, heading, question, example, difficulty) => {
    console.log('entered addQuestion');
    const response = await fetch(`${host}/api/question/addquestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ roomId, heading, question, example, difficulty })
    });
    const json = await response.json();
    console.log(json);
    setQuestions(questions.concat(json));
  }

  const editQuestion = async (id, roomId, heading, question, example, difficulty) => {
    const response = await fetch(`${host}/api/question/editquestion/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ roomId, heading, question, example, difficulty })
    });
    const json = await response.json();
    console.log(json);
    setQuestions(questions.map((question) => question._id === id ? json : question));
  }

  const deleteQuestion = async (id,roomId) => {
    const response = await fetch(`${host}/api/question/deletequestion/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ roomId })
    });
    const json = await response.json();
    console.log(json);
    setQuestions(questions.filter((question) => question._id !== id));
  }

  return (
    <QuestionContext.Provider value={{ questions, getQuestions, addQuestion, editQuestion, deleteQuestion }}>
      {props.children}
    </QuestionContext.Provider>
  );
};

export default QuestionState;