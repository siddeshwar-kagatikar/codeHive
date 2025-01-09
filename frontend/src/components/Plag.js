import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import codeContext from '../context/codeContext';
import '../styles/plag.css';

export default function Plag() {
    const { id } = useParams();
    const context = useContext(codeContext);

    const {plags, plagCheck } = context;

    useEffect(() => {
        plagCheck(id);
        // console.log(plags);
    }, [])

  return (
    <div>
        <h2 className="text-center my-4">Plagiarism Check Results</h2>
      <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Student 1</th>
            <th>Student 2</th>
            <th>Similarity</th>
          </tr>
        </thead>
        <tbody>
          {plags.map((plag, index) => (
            <tr
              key={index}
              className={parseFloat(plag.similarity) > 50 ? 'highlight-row' : ''}
            >
              <td>{plag.student1}</td>
              <td>{plag.student2}</td>
              <td>{plag.similarity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
