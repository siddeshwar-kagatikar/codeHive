import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Addquestion from './components/Addquestion';
import QuestionState from './context/QuestionState';


function App() {
  return (
    <div className="App">
    <QuestionState>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/addquestion" element={<Addquestion/>} />
        </Routes>
      </BrowserRouter>
      </QuestionState>
    </div>
  );
}

export default App;
