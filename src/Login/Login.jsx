import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendLoginRequest } from '../API/sendLoginRequest';
import { Cookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { login } from '../Redux/Loginout';

function Login(props) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const cookie = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLoginClick = async (event) => {
    event.preventDefault();
    try {
      const data = await sendLoginRequest(id, password);
      localStorage.setItem('access_token', data.access_token);
      cookie.set('refresh_token', data.refresh_token, {path: '/'}, {sameSite: 'strict'}, {httpOnly: true});
      if (data.success === true) {
        console.log('로그인 성공');
        dispatch(login(data.user_id));
        navigate('/');
      } else {
        setError(data.message);
      }

    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div>
        <p>{id}</p>
        <p>{password}</p>
        <form onSubmit={onLoginClick}>
            <input type="text" name="id" id="id" placeholder="id" onChange={(e) => setId(e.target.value)} />
            <input type="password" name="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <input type="submit" value="Login" />
        </form>
        <p>{error}</p>
        <Link to="/signup">회원가입</Link>
    </div>
  );
}

export default Login;