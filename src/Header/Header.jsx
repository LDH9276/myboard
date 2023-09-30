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
                        <div className="header-usermenu active">
                            <div className="header-usermenu-wrap">
                                <button onClick={()=>dispatch(headerMenuOn(false))} className="header-usermenu-close">
                                    X
                                </button>
                                <UserMenu />
                                <div className="board-submenus">
                                    <Menubtn />
                                    <MenuSub />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="header-usermenu">
                            <UserMenu />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
