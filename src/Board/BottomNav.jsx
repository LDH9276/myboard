import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function BottomNav(props) {
  const navigate = useNavigate();

  return (
    <div className='main-bottom-wrap'>
      <button onClick={() => navigate('/write')} className='main-write-btn'>
        <img src={`${process.env.PUBLIC_URL}/btn/write.svg`} alt="write" />
      </button>
    </div>
  );
}

export default BottomNav;