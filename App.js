import './App.css';
import Signin from './components/signin.jsx'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Mainpage from './components/mainpage.jsx';

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
      <Route path="/signin" element={<Signin />} />
        <Route path='/user' element={<Mainpage />}/>
      </Routes>
    </div>
  );
}

export default App;
