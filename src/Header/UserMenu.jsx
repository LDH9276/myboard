import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginMenuOn, loginMenuOff } from "../Redux/MenuToggle";
import { headerMenuOn } from "../Redux/Loginout";
import { logout } from "../Redux/Loginout";

function UserMenu(props) {
    const userId = useSelector((state) => state.userId);
    const loinMenu = useSelector((state) => state.loginMenu);
    const signupMenu = useSelector((state) => state.signupMenu);
    const userProfile = useSelector((state) => state.userProfile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLoginMenuClick = () => {
        if (!loinMenu) {
            dispatch(loginMenuOn());
        } else {
            dispatch(loginMenuOff());
        }
    };
    const handleMyprofilePage = () => {
        navigate("/mypage");
        dispatch(headerMenuOn(false));
    };

    return (
        <div className="header-userprofile">
                {userId ? (
                    <ul className="userprofile-login">
                        <li className="profile">
                            <img src={`http://localhost/myboard_server/Users/Profile/${userProfile}`} alt={userId} />
                        </li>
                        <li>
                            <p>{userId}</p>
                            <p>email</p>
                        </li>
                        <li className="userprofile-button-wrap">
                            <button onClick={() => handleMyprofilePage()} className="userprofile-button-modify">프로필 수정</button>
                            <button onClick={() => dispatch(logout())} className="userprofile-button-logout">로그아웃</button>
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <li>
                            <p>비회원입니다.</p>
                        </li>
                        <li>
                            <button onClick={() => handleLoginMenuClick()}>로그인</button>
                        </li>
                    </ul>
                )}
        </div>
    );
}

export default UserMenu;
