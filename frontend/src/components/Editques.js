import React, { useState, useContext } from 'react';
import questionContext from '../context/questionContext';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

export default function Editques(props) {
    const context = useContext(questionContext);
    const { editQuestion } = context;

    // Modal visibility state
    const [isOpen, setIsOpen] = useState(false);

    // Form data states
    const [heading, setHeading] = useState(props.heading);
    const [question, setQuestion] = useState(props.question);
    const [example, setExample] = useState(props.example);
    const [difficulty, setDifficulty] = useState(props.difficulty);

    // Open Modal and set initial values
    const openModal = () => {
        setHeading(props.heading);
        setQuestion(props.question);
        setExample(props.example);
        setDifficulty(props.difficulty);
        setIsOpen(true);
    };

    // Close Modal
    const closeModal = () => {
        setIsOpen(false);
    };

    // Handle form submission
    const handleEdit = () => {
        editQuestion(props.id, "1213", heading, question, example, difficulty);
        socket.emit('send_question', {
            _id: props.id,
            roomId: "1213",
            heading,
            question,
            example,
            difficulty
        });
        closeModal(); // Close modal after edit
    };

    return (
        <div className="ms-2">
            <button onClick={openModal} className="btn btn-primary">
                Edit
            </button>

            {isOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <h2>Edit Question</h2>
                        <form>
                            <div className="form-group">
                                <label>Heading</label>
                                <input
                                    type="text"
                                    value={heading}
                                    onChange={(e) => setHeading(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Question Details</label>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    rows="5"
                                />
                            </div>
                            <div className="form-group">
                                <label>Example</label>
                                <textarea
                                    value={example}
                                    onChange={(e) => setExample(e.target.value)}
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Difficulty</label>
                                <select
                                    value={difficulty}
                                    onChange={(e) => setDifficulty(Number(e.target.value))}
                                >
                                    <option value="1">Easy</option>
                                    <option value="2">Medium</option>
                                    <option value="3">Hard</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={handleEdit} className="btn btn-success">Save</button>
                                <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Modal CSS */}
            <style>{`
    .custom-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: transparent; /* Fully transparent background */
        display: flex;
        align-items: flex-start; /* Align modal to the top */
        justify-content: flex-start; /* Align modal to the left */
        padding: 50px; /* Distance from top and left */
        z-index: 1000;
        overflow: auto;
    }

    .custom-modal-content {
        background: white;
        padding: 20px;
        border-radius: 10px;
        width: 400px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5); /* Dark shadow around modal */
        animation: fadeIn 0.3s ease;
    }

    .form-group {
        margin-bottom: 15px;
    }
    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }
    .form-group input, 
    .form-group textarea, 
    .form-group select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 14px;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 15px;
    }

    .btn {
        padding: 8px 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    }

    .btn-primary {
        background-color: #007bff;
        color: white;
    }
    .btn-success {
        background-color: #28a745;
        color: white;
    }
    .btn-secondary {
        background-color: #6c757d;
        color: white;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`}</style>



        </div>
    );
}
