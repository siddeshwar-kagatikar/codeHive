import React, { useContext} from 'react'
import { Link } from 'react-router-dom';
import questionContext from '../context/questionContext';
import Editques from './Editques';

export default function QuestionHead(props) {
  const context = useContext(questionContext);
  const {deleteQuestion} = context;
  let admin = localStorage.getItem('user_type');

  const handleDel = () => {
    deleteQuestion(props.id, "1213");
  }

  return (
<li className="list-group-item d-flex justify-content-between align-items-center">
    <Link 
        to={{
            pathname: `/question/${props.id}`
        }}
        state={{
            heading: props.heading,
            question: props.question,
            example: props.example,
        }}
        className="text-decoration-none"
    >
        {props.heading}
    </Link>
    <div className="d-flex align-items-center">
        <span 
            className={`badge ${
                props.difficulty === 1 
                    ? 'bg-success' 
                    : props.difficulty === 2 
                    ? 'bg-warning text-dark' 
                    : 'bg-danger'
            } me-2`}
        >
            {props.difficulty === 1 
                ? 'Easy' 
                : props.difficulty === 2 
                ? 'Medium' 
                : 'Hard'}
        </span>
        {admin && (
            <button className="btn btn-danger btn-sm" aria-label="Remove" onClick={handleDel}>X</button>
        )}
        {/* Add Edit button */}
        {admin && <Editques key={props.id} heading={props.heading} question={props.question} example={props.example} difficulty={props.difficulty} id={props.id}/>}
    </div>
</li>

  )
}
