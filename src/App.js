import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Login from './Login/Login';
import Signup from './Login/Signup';
import Wtite from './Board/Write';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import List from './Board/List';
import Read from './Board/Read';
import { Cookies } from 'react-cookie';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserID] = useState('');
  const tokenChek = 'http://localhost/JTW_testing/JWT_Verify.php';
  const cookies = new Cookies();

  // 토큰 검증
  const verifyUser = async () => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = cookies.get('refresh_token');

    try {
      const response = await axios(tokenChek, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
          'Refresh': refresh_token,
        },
        withCredentials: true,
      });
      if (response.data.success === true) {
        console.log(response.data);
        setIsLoggedIn(true);
        setUserID(response.data.user_id);
        localStorage.setItem('access_token', response.data.access_token);
      }
      else {
        console.log(response.data);
        setIsLoggedIn(false);
        setUserID('');
        localStorage.removeItem('access_token');
        cookies.remove('refresh_token');
      }
    } catch (err) {
      console.log(err);
      setIsLoggedIn(false);
      setUserID('');
      localStorage.removeItem('access_token');
      cookies.remove('refresh_token');
    }
  }

  // 로그아웃
  const logout = async () => {
    if (!userId) {
      alert('로그인 후 이용해주세요.');
      return;
    } else {
      setUserID('');
      setIsLoggedIn(false);
      localStorage.removeItem('access_token');
      cookies.remove('refresh_token');
      alert('로그아웃 되었습니다.');
    }
  }

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          {isLoggedIn === true ? (
            <li>
              <button onClick={logout}>로그아웃</button>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          {isLoggedIn === true ? '' : (
            <li>
              <Link to="/signup">Signup</Link>
            </li>)}
        </ul>
      </nav>

      <div>
        {isLoggedIn === true ? <h1>로그인 되었습니다. {userId}님.</h1> : <h1>로그인을 해주세요.</h1>}
      </div>

      <Routes>
        <Route exact path="/" element={<List />} />
        <Route path="/login" element={
          <Login setUserID={setUserID} setIsLoggedIn={setIsLoggedIn} />
        } />
        <Route path="/signup" element={
          <Signup />
        } />
        <Route path="/write/" element={<Wtite userId={userId} />} />
        <Route path="/write/:id/:mod" element={<Wtite userId={userId} />} />
        <Route path="/read/:id" element={<Read userId={userId} />} />



      </Routes>
    </Router>
  );
}

export default App;
