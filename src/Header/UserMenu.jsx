import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginMenuOn, loginMenuOff } from "../Redux/MenuToggle";
import { logout } from "../Redux/Loginout";

function UserMenu(props) {
    const userId = useSelector((state) => state.userId);
    const loinMenu = useSelector((state) => state.loginMenu);
    const signupMenu = useSelector((state) => state.signupMenu);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLoginMenuClick = () => {
        if (!loinMenu) {
            dispatch(loginMenuOn());
        } else {
            dispatch(loginMenuOff());
        }
    };

    return (
        <div>
            <ul>
                <li></li>
                {userId ? (
                    <>
                        <li>
                            <button onClick={() => navigate("/mypage")}>내 프로필</button>
                        </li>
                        <li>
                            <button onClick={() => dispatch(logout())}>로그아웃</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <p>비회원입니다.</p>
                        </li>
                        <li>
                            <button onClick={() => handleLoginMenuClick()}>로그인</button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default UserMenu;
