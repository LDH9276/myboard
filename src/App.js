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
import Mypage from './Login/Mypage';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { login, logout } from './Redux/Actions';

function App() {

  const tokenChek = 'http://localhost/myboard_server/JWT_Verify.php';
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const userId = useSelector(state => state.userId);
  const cookies = new Cookies();
  const dispatch = useDispatch();

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
        dispatch(login(response.data.user_id)); // 로그인 상태로 변경
        localStorage.setItem('access_token', response.data.access_token);
      }
      else {
        console.log(response.data);
        dispatch(logout()); // 로그아웃 상태로 변경
        localStorage.removeItem('access_token');
        cookies.remove('refresh_token');
      }
    } catch (err) {
      console.log(err);
      dispatch(logout()); // 로그아웃 상태로 변경
      localStorage.removeItem('access_token');
      cookies.remove('refresh_token');
    }
  }

  useEffect(() => {
    console.log(isLoggedIn);
  }, [isLoggedIn]);


  // 로그아웃
  const handleLogout = async () => {
    if (!userId) {
      alert('로그인 후 이용해주세요.');
      return;
    } else {
      dispatch(logout()); // 로그아웃 상태로 변경
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
              <button onClick={() => handleLogout()}>로그아웃</button>
              <Link to="/mypage">마이페이지</Link>
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
        <Route exact path="/:boardname" element={<List />} />
        <Route path="/login" element={
          <Login />
        } />
        <Route path="/signup" element={
          <Signup />
        } />
        <Route path="/mypage" element={
          <Mypage userId={userId} />
        } />

        <Route path="/write/:boardname" element={<Wtite userId={userId} />} />
        <Route path="/write/:id/:mod" element={<Wtite userId={userId} />} />
        <Route path="/read/:id" element={<Read userId={userId} />} />



      </Routes>
    </Router>
  );
}

export default App;
