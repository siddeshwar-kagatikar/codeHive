import React,{ useContext, useCallback, useState, useEffect} from 'react'
import { useLocation} from 'react-router-dom'
import '../styles/playground.scss'
import EditorContainer from './EditorContainer';
import { makeSubmission } from './service';
import { useNavigate } from "react-router-dom";
import TimerContext from '../context/TimerContext';
import { useParams } from 'react-router-dom';
import questionContext from '../context/questionContext';

export default function PlayGround() {
  const location = useLocation();
  const { qid, heading, question, example } = location.state;
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [testcases, setTestcases] = useState([]);
  const [result, setResult] = useState([]);
  const [showModal, setShowModal] = useState(false); // For Test Case Modal

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
 
   const submitCode = useCallback(({ code, language }) => {
    setResult([]);
  
    const fetchTestcases = async () => {
      const data = await getTestcases(qid);
      setTestcases(data.testcases);
    };
  
    const processSubmissions = async () => {
      if (!testcases || testcases.length === 0) return;
  
      const newResults = []; // Temporary array to store results
      for (let i = 0; i < testcases.length; i++) {
        await makeSubmission({ 
          code, 
          language, 
          stdin: testcases[i].input, 
          callback: (output) => {
            // if (output === testcases[i].output) {
            //   newResults.push(true);
            // } else {
            //   newResults.push(false);
            // }
            newResults.push(output)
          }
        });
      }
  
      setResult(newResults);
      console.log("result: ", newResults);
    };
  
    const fetchAndProcess = async () => {
      await fetchTestcases();
      await processSubmissions();
    };
  
    fetchAndProcess();
  }, [input]);
    return (
    <div className="playground-container">
    {/* Left Question Panel */}
    <div className="question-panel">
      {/* Heading */}
      <h1 className="heading">{heading}</h1>

      {/* Question Section */}
      <div className="example-section mt-3">
        <h4 className="section-title">Question</h4>
        <div className="content-box">{question}</div>
      </div>

      {/* Example Section */}
      <div className="example-section mt-3">
        <h4 className="section-title">Example</h4>
        <div className="content-box">{example}</div>
      </div>

      <div className="input-output-container">
            <div className="input-section">
              <label>Input</label>
              <textarea value={input} onChange={changeInputText}></textarea>
            </div>
            <div className="output-section">
              <label>Output</label>
              <textarea value={output} readOnly></textarea>
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
    );
}
