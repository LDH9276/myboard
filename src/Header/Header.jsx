import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { headerMenuOn } from "../Redux/Loginout";
import UserMenu from "./UserMenu";
import Menubtn from "./Menubtn";
import MenuSub from "./MenuSub";
import "./css/header.css";

function Header(props) {
    const userId = useSelector((state) => state.userId);
    const userProfile = useSelector((state) => state.userProfile);
    const headerMenu = useSelector((state) => state.headerMenu);
    const dispatch = useDispatch();
    const [menu, setMenu] = useState(false);

    return (
        <header className="header-top">
            <div className="header-wrap">
                <div className="header-homemenu">
                    <Link to="/">
                        <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="home" />
                    </Link>
                </div>
                <div className="header-userbtn">
                    <button onClick={headerMenu ? () => dispatch(headerMenuOn(false)) : () => dispatch(headerMenuOn(true))} className="header-userprofile-btn">
                        {userId ? (
                            <img src={`http://localhost/myboard_server/Users/Profile/${userProfile}`} alt={userId} />
                        ) : (
                            <img src={`http://localhost/myboard_server/Users/Profile/menu.png`} alt="not login" />
                        )}
                    </button>
                    {headerMenu ? (
                        <div className="fixed w-full h-full top-0 left-0 bg-white/75 z-[10000] backdrop-blur-sm flex justify-center items-center dark:bg-black/75">
                            <div className="w-full max-w-[768px] box-border px-4 relative">
                                <button onClick={() => dispatch(headerMenuOn(false))} className="block w-4 h-4 absolute right-8 top-4 z-50">
                                    <img src={`${process.env.PUBLIC_URL}/btn/close.svg`} className="w-full h-full" alt="close" />
                                </button>
                                <UserMenu />
                                <div className="flex w-full gap-4">
                                    <Menubtn />
                                    <MenuSub />
                                </div>
                                <div className="flex flex-col justify-center items-center w-full my-4 py-2 shadow-xl z-40 relative bg-secondary">
                                    <p className=" text-white">&copy; Able Designs</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="fixed w-full h-full top-0 left-0 bg-white/75 z-[9980] backdrop-blur-sm hidden">
                            <UserMenu />
                            <div className="w-full">
                                <p>&copy; Able Designs</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
