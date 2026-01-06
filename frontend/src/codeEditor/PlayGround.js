import React,{ useContext, useCallback, useState, useEffect} from 'react'
import { useLocation} from 'react-router-dom'
import '../styles/playground.scss'
import EditorContainer from './EditorContainer';
import { makeSubmission } from './service';
import { useNavigate } from "react-router-dom";
import TimerContext from '../context/TimerContext';
import { useParams } from 'react-router-dom';
import questionContext from '../context/questionContext';
import codeContext from '../context/codeContext';

import io from 'socket.io-client';
const socket = io.connect('https://codehive-zgga.onrender.com');

export default function PlayGround() {
  const location = useLocation();
  const { qid, heading, question, example } = location.state;
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [testcases, setTestcases] = useState([]);
  const [result, setResult] = useState([]);
  const [showModal, setShowModal] = useState(false); // For Test Case Modal
  const [showTestCaseResult, setShowTestCaseResult] = useState(false);
  const [passedTestCases, setPassedTestCases] = useState(0);
  const [totalTestCases, setTotalTestCases] = useState(0);


  const context = useContext(questionContext);
  const { getTestcases } = context;
  const codeContextData = useContext(codeContext);
  const { saveCode } = codeContextData;

  const navigate = useNavigate();
  const { timeLeft } = useContext(TimerContext);

     // Use state to track the current values of heading, question, etc.
     const [currentHeading, setCurrentHeading] = useState(heading);
     const [currentQuestion, setCurrentQuestion] = useState(question);
     const [currentExample, setCurrentExample] = useState(example);
     // const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);

     // Listening for broadcasted questions
    useEffect(() => {
      socket.on('receive_question', (data) => {
          console.log("Received updated question:", data);
          setCurrentQuestion(data.question)
          setCurrentHeading(data.heading)
          setCurrentExample(data.example)
      });
      // Cleanup on unmount
      return () => {
          socket.off('receive_question');
      };
    }, []);
 
     useEffect(() => {
       // Update the state when the change
       setCurrentHeading(heading);
       setCurrentQuestion(question);
       setCurrentExample(example);
       // setCurrentDifficulty(difficulty);
     }, [heading, question, example]);
 
     const user = localStorage.getItem('user_type');
     const admin = user === 'admin';
 
     useEffect(() => {
       if (timeLeft === null && !admin) {
         navigate("/userhome");
       }
       // console.log(!admin);
       // console.log(timeLeft);
     }, [timeLeft, admin, navigate]); // Added timeleft and admin as dependencies
 
   const importInput = (e) => {
     const file = e.target.files[0];
     const fileType = file.type.includes('text');
     if(fileType)
     {
         const fileReader = new FileReader();
         fileReader.readAsText(file);
         fileReader.onload = () => {
           const importedInput = fileReader.result;
           // document.querySelector('.input textarea').value = importedInput;
           setInput(importedInput);
         }
     }
     else
     {
       alert('Invalid file type');
     }
   }
 
   const exportOutput = () => {
     if(output === '')
     {
       alert('No output to export');
       return;
     }
     const blob = new Blob([output.trim()], {type: 'text/plain'});
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'output.txt';
     a.click();
   }
 
   const changeInputText = (e) => {
     setInput(e.target.value);
   }
 
   const changeOutputText = (e) => {
     setOutput(e.target.value);
   }
 
   const callback = ({apiStatus,data,message}) => {
     if(apiStatus === 'loading'){
       setShowLoader(true);
     }
     else if(apiStatus === 'error'){
       setShowLoader(false);
       setOutput('Something went wrong');
      //  setResult((prevResult) => [...prevResult, 'Fail']);
       // alert(message);
     }
     else{
       //api success
       setShowLoader(false);
       if(data.status.id === 3){
         setOutput(atob(data.stdout));
        //  setResult((prevResult) => [...prevResult, atob(data.stdout)]);
       }
       else{
         setOutput(atob(data.stderr));
        //  setResult((prevResult) => [...prevResult, 'Fail']);
       }
     }
   }
 
   const runCode = useCallback(({code,language}) => {
     console.log("input",input);
     makeSubmission({code, language, stdin:input, callback})
   },[input])
 
  
  const submitCode = useCallback(async ({ code, language }) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); 

    // Fetch testcases
    const data = await getTestcases(qid);
    const testcases = data.testcases;
    setTestcases(testcases); // Optional, if you want to update state
  
    let allPassed = true;
    let pass=0;
    for (let i = 0; i < 1; i++) {
      const testinput = testcases[i].input;
      const testoutput = testcases[i].output;
  
      // Await the result of submission
      await makeSubmission({ code, language, stdin: testinput, callback});
      await sleep(2000);
  
      // Compare output with expected output
      if (output.trim() !== testoutput.trim()) { // trim to avoid extra space issues
        allPassed = false;
        console.log("output:",output)
        console.log("ground truth:",testoutput)
        console.log("ground input:", testinput) 
        console.log('Failed in testcase', i);
      }
      else pass = pass+1;
    }
  
    if (allPassed) {
      await saveCode(qid,language,code,true);
      console.log('All testcases passed');
    }
    else {
      await saveCode(qid,language,code,false);
      console.log('Some testcases failed');
    }
    setShowTestCaseResult(true);
    setPassedTestCases(pass);
    setTotalTestCases(testcases.length);
  }, [qid, setTestcases]); // Add qid and setTestcases in dependency array
  
    return (
      <>
     {showTestCaseResult && (
      <div className="testcase-result-container">
        <div className="testcase-result-box">
          <button className="close-btn" onClick={() => setShowTestCaseResult(false)}>✖</button>
          <h3>Test Cases Result</h3>
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(passedTestCases / totalTestCases) * 100}%`,
              }}
            ></div>
            <span className="progress-text">{passedTestCases} / {totalTestCases}</span>
          </div>
        </div>
      </div>
    )}


    <div className="playground-container">
    {/* Left Question Panel */}
    <div className="question-panel">
      {/* Heading */}
      <h1 className="heading">{currentHeading}</h1>

      {/* Question Section */}
      <div className="example-section mt-3">
        <h4 className="section-title">Question</h4>
        <div className="content-box">{currentQuestion}</div>
      </div>

      {/* Example Section */}
      <div className="example-section mt-3">
        <h4 className="section-title">Example</h4>
        <div className="content-box">{currentExample}</div>
      </div>

      <div className="input-output-container py-4">
       <label className='py-1' style={{ fontSize: '1rem', fontWeight: 'bold' }}>Input: </label>
            <div className="input-section">
              <textarea value={input} style={{width:'80%', height:'20vh'}} onChange={changeInputText}></textarea>
            </div>
            <label style={{ fontSize: '1rem', fontWeight: 'bold' }}>Output: </label>
            <div className="output-section">
              <textarea value={output} style={{width:'80%', height:'20vh'}} readOnly></textarea>
            </div>
          </div>

    </div>

        {/* Right Editor Panel */}
        <div className="editor-panel">
          <EditorContainer runCode={runCode} submitCode={submitCode}/>
        </div>

        {/* Loader */}
        {showLoader && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
      </>
    );
}
