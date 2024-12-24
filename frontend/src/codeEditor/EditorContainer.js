import React,{useState,useRef} from 'react'
import '../styles/editorcontainer.scss'
import Editor from "@monaco-editor/react";


const editorOptions = {
  wordWrap: 'on'
}

const fileExtensionMapping = {
  'cpp': 'cpp',
  'python': 'py',
  'java': 'java',
  'javascript': 'js'
}

export default function EditorContainer({runCode,heading,question,example}) {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState('cpp');
  const [theme, setTheme] = useState('vs-dark');
  const [FullScreenMode, setFullScreenMode] = useState(false);
  const codeRef = useRef();
  
  const onChangeCode = (newCode) => {
    codeRef.current = newCode;
    // console.log(codeRef.current);
  }

  const importCode = (e) => {
    const file = e.target.files[0];
    const fileType = file.type.includes('text');
    if(fileType)
    {
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = () => {
          const importedCode = fileReader.result;
          setCode(importedCode);
          codeRef.current = importedCode;
        }
    }
    else
    {
      alert('Invalid file type');
    }
  }

  const exportCode = () => {
    if(codeRef.current === undefined)
    {
      alert('No code to export');
      return;
    }
    const blob = new Blob([codeRef.current], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.'+fileExtensionMapping[language];
    a.click();
  }

  const onChangeLanguage = (e) => {
    setLanguage(e.target.value);
  }

  const onChangeTheme = (e) => {
    setTheme(e.target.value);
  }

  const onChangefullScreen = () => {
    setFullScreenMode(!FullScreenMode);
    
  }

  const onRunCode = () => {
    runCode({code: codeRef.current, language});
  }

  return (
    <div className='root-editor-container' style={FullScreenMode ? styles.fullScreen : {}}>
      <div className='editor-header'>
        <div className='left-container'>
          <b className='title'>{heading}</b>
          <svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
          <button>Save code</button>
{/*--------------------------------------------------------------------------------- off canva begin------------------------------------------------------------------------------- */}

            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
              Show Question
            </button>

            <div class="offcanvas offcanvas-end" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" style={{width:'40vw'}}aria-labelledby="offcanvasScrollingLabel">
              <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasScrollingLabel">{heading}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div class="offcanvas-body">
                <h5>Question</h5>
                <p>{question}</p>
                <h5>Example</h5>
                {example}
              </div>
            </div>
{/*-------------------------------------------------------------------------------- off canva end----------------------------------------------------------------------------------- */}
        </div>
        <div className='right-container'>
          <select onChange={onChangeLanguage} value={language}>
            <option value="cpp">cpp</option>
            <option value="python">python</option>
            <option value="java">java</option>
            <option value="javascript">javascript</option>
          </select>

          <select onChange={onChangeTheme} value={theme}>
            <option value="vs-dark">Dark Mode</option>
            <option value="vs-light">Light Mode</option>
          </select>
        </div>
      </div>
      <div className='editor-body'>
        <Editor
          height="100%"
          language={language}
          value = {code}
          theme={theme}
          options = {editorOptions}
          onChange={onChangeCode}
        />
      </div>
      <div className='editor-footer'>
        <button onClick={onChangefullScreen}>Full Screen</button>
        <label 
  htmlFor="import-code" 
  style={{
    display: 'inline-block',
    padding: '10px 20px',
    background: '#2a3d3a',
    color: '#03f3d7',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background 0.3s, color 0.3s', // Smooth hover effect
  }}
  
  onMouseLeave={(e) => {
    e.target.style.background = '#2a3d3a'; // Reset background color
    e.target.style.color = '#03f3d7'; // Reset text color
  }}

  onMouseEnter={(e) => {
    e.target.style.background ='rgb(99, 157, 151)'; // Slightly darker background on hover
    e.target.style.color = '#33615a'; // Change text color on hover
  }}
>
  Import Code
</label>
        <input type="file" id="import-code" style={{display:'none'}} onChange={importCode}/>
        <button onClick={exportCode}>Export code</button>
        <button onClick={onRunCode}>Run code</button>
      </div>
    </div>
  )
}


const styles = {
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100
  }
}