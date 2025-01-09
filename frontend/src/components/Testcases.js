import React, { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import questionContext from '../context/questionContext';

export default function Testcases() {
  const context = useContext(questionContext);
  const { addTestcase, getTestcases } = context;
  const { id } = useParams();

  const [testcases, setTestcases] = useState([]);

  useEffect(() => {
    const fetchTestcases = async () => {
      const data = await getTestcases(id);
      setTestcases(data.testcases);
    };
    fetchTestcases();
    console.log(testcases);
  }, []);


  const onaddTestcase = () => {
    setTestcases([
      ...testcases,
      { id: Date.now(), input: "", output: "" },
    ]);
  };

  const handleInputChange = (id, field, value) => {
    setTestcases(
      testcases.map((testcase) =>
        testcase.id === id ? { ...testcase, [field]: value } : testcase
      )
    );
  };

  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // Reset height to calculate new height
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const deleteTestcase = (id) => {
    setTestcases(testcases.filter((testcase) => testcase.id !== id));
  };

  const handleSubmit = () => {
    addTestcase(id, testcases);
  }

  return (
    <div>
      <button className="btn btn-primary mt-3" onClick={onaddTestcase}>
        Add Testcase
      </button>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Input</th>
            <th>Output</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {testcases.map((testcase) => (
            <tr key={testcase.id}>
              <td>
                <textarea
                  className="form-control"
                  value={testcase.input}
                  onChange={(e) =>
                    handleInputChange(testcase.id, "input", e.target.value)
                  }
                  onInput={adjustHeight}
                  rows="1"
                  style={{ overflow: "hidden", resize: "none" }}
                />
              </td>
              <td>
                <textarea
                  className="form-control"
                  value={testcase.output}
                  onChange={(e) =>
                    handleInputChange(testcase.id, "output", e.target.value)
                  }
                  onInput={adjustHeight}
                  rows="1"
                  style={{ overflow: "hidden", resize: "none" }}
                />
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTestcase(testcase.id)}
                >
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-success mt-3" onClick={handleSubmit}>Save Test Cases</button>
    </div>
  );
}
