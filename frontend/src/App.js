import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Addquestion from './components/Addquestion';
import QuestionState from './context/QuestionState';
import { TimerProvider } from './context/TimerContext'; // Import the TimerProvider
import PlayGround from './codeEditor/PlayGround';
import UserHome from './components/UserHome';

function App() {
  return (
    <div className="App">
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
              <Route path='/question/:id' element={<PlayGround />} />
            </Routes>
          </BrowserRouter>
        </TimerProvider>
      </QuestionState>
    </div>
  );
}

export default App;
