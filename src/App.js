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
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './Redux/Loginout';
import Header from './Header/Header';

function App() {

  const tokenChek = 'http://localhost/myboard_server/JWT_Verify.php';
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  const userId = useSelector(state => state.userId);
  const userName = useSelector(state => state.userName);
  const userInfo = useSelector(state => state.userInfo);
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
        dispatch(login(response.data.user_id, response.data.user_name, response.data.user_info)); // 로그인 상태로 변경
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
    verifyUser();
  }, []);

  return (
    <Router>
      <Header />

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

        <Route path="/write/" element={<Wtite userId={userId} userName={userName} />} />
        <Route path="/write/:id/:mod" element={<Wtite userId={userId} userName={userName} />} />
        <Route path="/read/:id" element={<Read userId={userId} userName={userName} />} />
        <Route path="*" element={<List />} />


      </Routes>
    </Router>
  );
}

export default App;
