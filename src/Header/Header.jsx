import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import './css/header.css';

function Header(props) {
    const userId = useSelector(state => state.userId);
    const [menu, setMenu] = useState(false);

    return (
        <header className='header-top'>
            <div className="header-wrap">
                <div className="header-homemenu">
                    <Link to="/">
                        Home
                    </Link>
                </div>
                <div className="header-userbtn">
                    <button onClick={menu ? () => setMenu(false) : () => setMenu(true)}>
                        {userId ? userId : '로그인'}
                    </button>
                    {menu ? (
                        <div className="header-usermenu active">
                            <UserMenu />
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