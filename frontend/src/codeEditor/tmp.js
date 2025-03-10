import React,{ useContext, useCallback, useState, useEffect} from 'react'
import { useLocation} from 'react-router-dom'
import '../styles/playground.scss'
import EditorContainer from './EditorContainer';
import { makeSubmission } from './service';
import { useNavigate } from "react-router-dom";
import TimerContext from '../context/TimerContext';
import { useParams } from 'react-router-dom';
import questionContext from '../context/questionContext';
// import { set } from 'mongoose';

export default function PlayGround() {
  const location = useLocation();
  const { qid, heading, question, example } = location.state;
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [testcases, setTestcases] = useState([]);
  const [result, setResult] = useState([]);

  const context = useContext(questionContext);
  const { getTestcases } = context;

  const navigate = useNavigate();
  const { timeLeft } = useContext(TimerContext);

    // Use state to track the current values of heading, question, etc.
    const [currentHeading, setCurrentHeading] = useState(heading);
    const [currentQuestion, setCurrentQuestion] = useState(question);
    const [currentExample, setCurrentExample] = useState(example);
    // const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);

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
      // alert(message);
    }
    else{
      //api success
      setShowLoader(false);
      if(data.status.id === 3){
        setOutput(atob(data.stdout));
      }
      else{
        setOutput(atob(data.stderr));
      }
    }
  }

  const callback2 = ({apiStatus,data,message}) => {
    if(apiStatus === 'loading'){
      setShowLoader(true);
    }
    else if(apiStatus === 'error'){
      setShowLoader(false);
      setOutput('Something went wrong');
      // alert(message);
    }
    else{
      //api success
      setShowLoader(false);
      if(data.status.id === 3){
        setOutput(atob(data.stdout));
      }
      else{
        setOutput(atob(data.stderr));
      }
    }
  }

  const runCode = useCallback(({code,language}) => {
    console.log("input",input);
    makeSubmission({code, language, stdin:input, callback})
  },[input])

  const submitCode = useCallback(({code,language}) => {
    // console.log("input",input);
    // makeSubmission({code, language, stdin:input, callback})

    const fetchTestcases = async () => {
      const data = await getTestcases(qid);
      setTestcases(data.testcases);
    };
    fetchTestcases();

    testcases.map((testcase) => {
      makeSubmission({code, language, stdin:testcase.input, callback2})
      if(output === testcase.output){
        setResult([...result, true]);
      }
      else{
        setResult([...result, false]);
      }
    });
    setOutput(result);

  },[input])


  return (
    <div className='playground-container'>

      <div className='content-container'>
        <div className='editor'>
          <EditorContainer submitCode={submitCode} runCode={runCode} qid={qid} heading={currentHeading} question={currentQuestion} example={currentExample}/>
        </div>
        <div className='input'>
          <div className='input-header'>
            <b>Input: </b>
            <label htmlFor='input' className='icon-container'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
            <span className=''><b>Import Input</b></span>
            </label>
            <input type='file' id="input" style={{display:'none'}} onChange={importInput}/>
          </div> 
          <textarea onChange={changeInputText} value={input}></textarea>
        </div>
        <div className='input'>
        <div className='input-header'>
            <b>Output: </b>
            <button className='icon-container' style={{ border: 'none', outline: 'none', background: 'none'}} onClick={exportOutput}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
            <span className=''><b>Export Output</b></span>
            </button>
          </div>
          <textarea readOnly value={output} onChange={changeOutputText}></textarea> 
        </div>
      </div>
      {showLoader &&<div className='fullpage-loader'>
        <div className='loader'>

        </div>
      </div>}
    </div>
  )
}
