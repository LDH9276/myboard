import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function UserMenu(props) {
    const userId = useSelector(state => state.userId);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div>
            <ul>
                <li>
                    
                </li>
                {userId ? (
                    <>
                        <li>
                            <button onClick={() => navigate('/mypage')}>내 프로필</button>
                        </li>
                        <li>
                            <button onClick={() => dispatch({type: 'LOGOUT'})}>로그아웃</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <p>비회원입니다.</p>
                        </li>
                        <li>
                            <button onClick={() => navigate('/login')}>로그인</button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default UserMenu;