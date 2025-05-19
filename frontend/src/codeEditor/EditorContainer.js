import React, { useState, useRef, useEffect, useContext } from 'react';
import codeContext from '../context/codeContext';
import '../styles/editorcontainer.scss';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

const editorOptions = {
  wordWrap: 'on',
};

const fileExtensionMapping = {
  cpp: 'cpp',
  python: 'py',
  java: 'java',
  javascript: 'js',
};

export default function EditorContainer({ submitCode, runCode, qid, heading, question, example, roomId }) {
  const context = useContext(codeContext);
  const { prevcode, getCode } = context;

  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('cpp');
  const [theme, setTheme] = useState('vs-dark');
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [isContainerVisible, setContainerVisible] = useState(false);
  const codeRef = useRef();

  const [currentHeading, setCurrentHeading] = useState(heading);
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [currentExample, setCurrentExample] = useState(example);

  useEffect(() => {
    setCurrentHeading(heading);
    setCurrentQuestion(question);
    setCurrentExample(example);
  }, [heading, question, example]);

  const getCodefunc = async (qid, language) => {
    await getCode(qid, language);
    setCode(prevcode);
    codeRef.current = prevcode;
  };

  useEffect(() => {
    getCodefunc(qid, language);
  }, [qid, language]);

  const onChangeCode = (newCode) => {
    setCode(newCode);
    codeRef.current = newCode;

    if (socket && roomId) {
      socket.emit('send_code', { roomId, code: newCode });
    }
  };

  useEffect(() => {
    if (socket) {
      const handleReceiveCode = ({ roomId: receivedRoomId, code: receivedCode }) => {
        if (receivedRoomId === roomId) {
          setCode(receivedCode);
          codeRef.current = receivedCode;
        }
      };
  
      socket.on('receive_code', handleReceiveCode);
  
      // Cleanup on unmount
      return () => {
        socket.off('receive_code', handleReceiveCode);
      };
    }
  }, [socket, roomId]);

  const importCode = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('text')) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        setCode(reader.result);
        codeRef.current = reader.result;
      };
    } else {
      alert('Invalid file type');
    }
  };

  const exportCode = () => {
    if (!codeRef.current) {
      alert('No code to export');
      return;
    }
    const blob = new Blob([codeRef.current], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${fileExtensionMapping[language]}`;
    a.click();
  };

  const onRunCode = () => {
    runCode({ code: codeRef.current, language });
  };

  const onSubmitCode = () => {
    submitCode({ code: codeRef.current, language });
  };

  const toggleFullScreen = () => {
    setFullScreenMode(!fullScreenMode);
  };

  const toggleContainer = () => {
    setContainerVisible(!isContainerVisible);
  };

  return (
    <div
      className="root-editor-container"
      style={
        fullScreenMode
          ? { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }
          : {}
      }
    >
      <div className="editor-header">
        <div className="right-container">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="vs-dark">Dark Mode</option>
            <option value="vs-light">Light Mode</option>
          </select>
        </div>
      </div>
      <div className="editor-body">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={theme}
          options={editorOptions}
          onChange={onChangeCode}
        />
      </div>
      <div className="editor-footer">
        <button onClick={onSubmitCode}>Submit Code</button>
        <button onClick={() => document.getElementById("import-code").click()}>
          Import Code
        </button>
        <input
          type="file"
          id="import-code"
          style={{ display: "none" }}
          onChange={importCode}
        />
        <input type="file" id="import-code" style={{ display: "none" }} onChange={importCode} />
        <button onClick={exportCode}>Export Code</button>
        <button onClick={onRunCode}>Run Code</button>
        {/* <button onClick={toggleFullScreen}>
          {fullScreenMode ? "Exit Full Screen" : "Full Screen"}
        </button> */}
      </div>
    </div>
  );  
}
