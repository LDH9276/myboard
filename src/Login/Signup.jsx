import { useState, useEffect, useRef } from 'react';
import { sendSignRequest } from '../API/sendSignRequest';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './css/loginsign.css';
import { loginMenuOn } from '../Redux/MenuToggle';
import { signupMenuOff } from '../Redux/MenuToggle';
import { errorWindowOn } from '../Redux/Error';

function Sign(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 입력값 State
  const isLoggenIn = useSelector((state) => state.isLoggenIn);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // 입력 성공 여부 State
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // 입력값을 서버로 전송한다.
  const onSubmit = async (event) => {
    event.preventDefault();

    if (id === '') {
      dispatch(errorWindowOn("아이디를 입력해주세요."));
      return;
    }
    if (password === '') {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (passwordCheck === '') {
      alert('비밀번호 확인을 입력해주세요.');
      return;
    }
    if (name === '') {
      alert('이름을 입력해주세요.');
      return;
    }
    if (email === '') {
      alert('이메일을 입력해주세요.');
      return;
    }
    // 비밀번호 일치 여부 확인
    if (password !== passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try { // 응답 성공
      const data = await sendSignRequest(id, password, name, email);

      // 아이디 중복 체크
      if(data.idChk === false) {
        alert('이미 존재하는 아이디입니다.');
        return;
      }

      // 체크 완료
      setSuccess(true);
      if(data.success === true) {
        alert('회원가입이 완료되었습니다.');
        dispatch(loginMenuOn());
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (isLoggenIn) {
      navigate('/');
    }
  }, [isLoggenIn]);

  return (
    <div className='fixed w-full h-full top-0 left-0 bg-white/75 z-[9700] backdrop-blur-sm flex justify-center items-center dark:bg-black/75 box-border px-4 bg-base-100'>
      <div className="w-full bg-base-100 px-4 py-12 relative shadow-lg border-4 border-primary">
        <button onClick={() => dispatch(signupMenuOff())}>X</button>

        <form onSubmit={onSubmit} encType="multipart/form-data">

          <label htmlFor="Id">
            ID
          </label>
          <input type="text" id="id" name="id" value={id} onChange={(event) => setId(event.target.value)} className='loginform-idform'/>
          <label htmlFor="password">
            비밀번호
          </label>
          <input type="password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)}  className='loginform-idform' />

          <label htmlFor="passwordCheck">
            비밀번호 확인
          </label>
          <input type="password" id="passwordCheck" name="passwordCheck" value={passwordCheck} onChange={(event) => setPasswordCheck(event.target.value)} className='loginform-idform' />

          <label htmlFor="email">
            이름
          </label>
          <input type="text" id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} className='loginform-idform' />

          <label htmlFor="email">
            이메일
          </label>
          <input type="text" id="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} className='loginform-idform' />

          <button type="submit">Submit!</button>
          <button type="button" onClick={() => dispatch(loginMenuOn())}>로그인하기</button>
        </form>
        {!success && <div>{error}</div>}
      </div>
    </div>
  );
}

export default Sign;