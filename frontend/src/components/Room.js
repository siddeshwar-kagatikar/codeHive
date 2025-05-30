import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditorContainer from '../codeEditor/EditorContainer';
import { makeSubmission } from '../codeEditor/service';
import Video from './Video';

function Room() {
  const { roomId } = useParams();

  // Code editor states
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showLoader, setShowLoader] = useState(false);

  const changeInputText = (e) => {
    setInput(e.target.value);
  };

  const callback = ({ apiStatus, data, message }) => {
    if (apiStatus === 'loading') {
      setShowLoader(true);
    } else if (apiStatus === 'error') {
      setShowLoader(false);
      setOutput('Something went wrong');
    } else {
      // API success
      setShowLoader(false);
      if (data.status.id === 3) {
        setOutput(atob(data.stdout));
      } else {
        setOutput(atob(data.stderr));
      }
    }
  };

  const submitCode = () => {
    // Not implemented
  };

  const runCode = useCallback(({ code, language }) => {
    console.log('input', input);
    makeSubmission({ code, language, stdin: input, callback });
  }, [input]);

  return (
    <div className="playground-container" >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem', width: '40.33%' }}>
            
          <Video />

          {/* Input Box */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#94a3b8' }}>Input</label>
            <textarea
              style={{
                width: '100%',
                height: '120px',
                resize: 'vertical',
                padding: '0.75rem',
                fontSize: '1rem',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              value={input}
              onChange={changeInputText}
            />
          </div>

          {/* Output Box */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#94a3b8' }}>Output</label>
            <textarea
              style={{
                width: '100%',
                height: '120px',
                resize: 'vertical',
                padding: '0.75rem',
                fontSize: '1rem',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              value={output}
              readOnly
            />
          </div>
      </div>

      {/* Code Editor Panel */}
      <div className="editor-panel">
        <EditorContainer runCode={runCode} submitCode={submitCode} roomId={roomId} />
         {/* Loader */}
        {/* {showLoader && (
            <div className="loader-container">
            <div className="loader"></div>
            </div>
        )} */}
      </div>

     
    </div>
  );
}

export default Room;
