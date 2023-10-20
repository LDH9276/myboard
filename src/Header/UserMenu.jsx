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
        <div className="w-full mb-4 shadow-xl relative z-0 bg-base-100">
                {userId ? (
                    <ul className="w-full grid grid-cols-3 grid-rows-2">
                        <li className="row-span-2 col-span-1">
                            <img src={`http://localhost/myboard_server/Users/Profile/${userProfile}`} alt={userId} className="w-full h-full object-cover"/>
                        </li>
                        <li className="row-span-1 col-span-2 pl-4 box-border">
                            <p className="text-2xl font-bold w-full">{userId}</p>
                            <p className="text-md">email</p>
                        </li>
                        <li className="row-span-1 col-span-2 pl-4 box-border">
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
