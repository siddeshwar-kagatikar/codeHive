import React, { useState, useEffect, useContext } from 'react';
import questionContext from '../context/questionContext';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

export default function Editques(props) {
    const context = useContext(questionContext);
    const { editQuestion } = context;

    // Initialize state with props
    const [heading, setHeading] = useState(props.heading);
    const [question, setQuestion] = useState(props.question);
    const [example, setExample] = useState(props.example);
    const [difficulty, setDifficulty] = useState(props.difficulty);

    // Update state if props change
    useEffect(() => {
        setHeading(props.heading);
        setQuestion(props.question);
        setExample(props.example);
        setDifficulty(props.difficulty);
    }, [props.heading, props.question, props.example, props.difficulty]);

    const handleEdit = () => {
        // Handle editing logic
        editQuestion(props.id, "1213", heading, question, example, difficulty);
        socket.emit('send_question', {
            _id: props.id,
            roomId: "1213",
            heading,
            question,
            example,
            difficulty
        });
    };

    // Unique modal ID
    const modalId = `editModal-${props.id}`;

    return (
        <div className="ms-2">
            <button 
                type="button" 
                className="btn btn-primary" 
                data-bs-toggle="modal" 
                data-bs-target={`#${modalId}`}>
                Edit
            </button>

            <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}-label`} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={`${modalId}-label`}>Edit Question</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="Heading" className="form-label">Heading</label>
                                    <input 
                                        type="text" 
                                        className="form-control"  
                                        value={heading} 
                                        onChange={(e) => setHeading(e.target.value)} 
                                        required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="floatingTextarea2" className="form-label">Write question details here</label>
                                    <textarea 
                                        className="form-control" 
                                        placeholder="Leave a comment here" 
                                        id="floatingTextarea2" 
                                        style={{ height: '200px' }} 
                                        value={question} 
                                        onChange={(e) => setQuestion(e.target.value)}>
                                    </textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="floatingTextarea2" className="form-label">Example</label>
                                    <textarea 
                                        className="form-control" 
                                        placeholder="Leave a comment here" 
                                        id="floatingTextarea2" 
                                        style={{ height: '100px' }} 
                                        value={example} 
                                        onChange={(e) => setExample(e.target.value)}>
                                    </textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="difficulty" className="form-label">Difficulty</label>
                                    <select 
                                        className="form-select" 
                                        aria-label="Default select example"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(Number(e.target.value))}>
                                        <option defaultValue>Choose...</option>
                                        <option value="1">Easy</option>
                                        <option value="2">Medium</option>
                                        <option value="3">Hard</option>
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleEdit}>Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
