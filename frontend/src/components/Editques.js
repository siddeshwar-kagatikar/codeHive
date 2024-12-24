import React, { useState, useContext } from 'react'
import questionContext from '../context/questionContext';

export default function Editques(props) {
    const context = useContext(questionContext);
    const {editQuestion} = context;

      const [heading, setHeading] = useState(props.heading);
      const [question, setQuestion] = useState(props.question);
      const [example, setExample] = useState(props.example);
      const [difficulty, setDifficulty] = useState(props.difficulty);
    
      const handleEdit = () => {
        console.log(difficulty);
        editQuestion(props.id, "1213", heading, question, example, difficulty);
      }

  return (
    <div className="ms-2">
      
    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Edit
    </button>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Question</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                 <form>
                    <div className="mb-3">
                        <label htmlFor="Heading" className="form-label">Heading</label>
                        <input type="text" className="form-control"  value={heading} onChange={(e)=>setHeading(e.target.value)} required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="floatingTextarea2" className="form-label">Write question details here</label>
                        <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: '200px'}} value={question} onChange={(e)=>setQuestion(e.target.value)}></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="floatingTextarea2" className="form-label">Example</label>
                        <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style={{height: '100px'}} value={example} onChange={(e)=>setExample(e.target.value)}></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="difficulty" className="form-label">Difficulty</label>
                        <select className="form-select" aria-label="Default select example">
                            <option defaultValue>Choose...</option>
                            <option value="1" onClick={(e)=>{setDifficulty(1)}}>Easy</option>
                            <option value="2" onClick={(e)=>{setDifficulty(2)}}>Medium</option>
                            <option value="3" onClick={(e)=>{setDifficulty(3)}}>Hard</option>
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
  )
}
