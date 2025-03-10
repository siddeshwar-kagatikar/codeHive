import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Addquestion from './components/Addquestion';
import QuestionState from './context/QuestionState';
import CodeState from './context/CodeState';
import { TimerProvider } from './context/TimerContext'; // Import the TimerProvider
import PlayGround from './codeEditor/PlayGround';
import UserHome from './components/UserHome';
import Plag from './components/Plag';
import Testcases from './components/Testcases';
import Conference from './video/Conference';
import Call from './video/Call';

function App() {
  return (
    <div className="App">
      {/* <CodeState>
      <QuestionState>
        <TimerProvider> 
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/userhome" element={<UserHome />} />
              <Route path="/addquestion" element={<Addquestion />} />
              <Route path="/interview" element={<Call/>}/>
              <Route path='/question/:id' element={<PlayGround />} />
              <Route path="/plagcheck/:id" element={<Plag/>} />
              <Route path="/testcases/:id" element={<Testcases />} />
            </Routes>
          </BrowserRouter>
        </TimerProvider>
      </QuestionState>
      </CodeState> */}
      {/* <Conference /> */}
      <Call />
    </div>
  );
}

export default App;
