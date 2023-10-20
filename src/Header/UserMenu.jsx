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
        <div className="w-full mb-4 shadow-xl relative z-0 bg-base-100 border-4 border-secondary box-border">
                {userId ? (
                    <ul className="w-full grid grid-cols-3 grid-rows-2 relative">
                        <li className="row-span-2 col-span-1 max-w-[235px] w-full relative pb-[100%]">
                            <img src={`http://localhost/myboard_server/Users/Profile/${userProfile}`} alt={userId} className="w-full h-full object-cover absolute top-0 left-0"/>
                        </li>
                        <li className="row-span-1 col-span-2 pl-4 box-border flex flex-col justify-center items-center">
                            <p className="text-xl font-bold w-full md:text-2xl lg:text-4xl">{userId}</p>
                            <p className="text-xs w-full md:text-base lg:mt-2 lg:text-xl">email</p>
                        </li>
                        <li className="row-span-1 col-span-2 px-4 flex flex-around my-2 gap-2 items-center md:items-end mb-4">
                            <button onClick={() => handleMyprofilePage()} className="w-1/2 h-8 bg-secondary text-white text-sm md:h-14">프로필 수정</button>
                            <button onClick={() => dispatch(logout())} className="w-1/2 h-8 border-secondary border-[1px] text-secondary text-sm md:h-14">로그아웃</button>
                        </li>
                    </ul>
                ) : (
                    <ul className="w-full grid grid-cols-3 grid-rows-2 relative">
                        <li className="row-span-2 col-span-1 max-w-[235px] w-full relative pb-[100%]">
                            <img src={`http://localhost/myboard_server/Users/Profile/default.png`} alt={userId} className="w-full h-full object-cover absolute top-0 left-0"/>
                        </li>
                        <li className="row-span-1 col-span-2 pl-4 box-border flex flex-col justify-center items-center">
                            <p className="text-lg font-bold w-full md:text-2xl lg:text-4xl">
                                로그인 해주세요.
                            </p>
                        </li>
                        <li className="row-span-1 col-span-2 px-4 flex flex-around my-2 gap-2 items-center md:items-end mb-4">
                            <button onClick={() => handleLoginMenuClick()} className="w-full bg-secondary py-2 text-white">로그인</button>
                        </li>
                    </ul>
                )}
        </div>
    );
}

export default UserMenu;
