import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from "./sign-in.js"
import ChatPage from './chat-page.js';

function App() {
  return (
    <Router>
      <MainRoutes />
    </Router>
  );
};

const MainRoutes = () => {

  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path='/chat-page' element={<ChatPage />}/>
      </Routes>
    </div>
  );
}

export default App;
