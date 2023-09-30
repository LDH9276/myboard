import React from 'react';

function Menubtn(props) {
    return (
        <div className='userprofile-menubtn-wrap'>
            <ul>
                <li>
                    <button>
                        <img src={`${process.env.PUBLIC_URL}/btn/home.svg`} alt="홈"/>
                        홈
                    </button>
                </li>
                <li>
                    <button>
                        <img src={`${process.env.PUBLIC_URL}/btn/notice.svg`} alt="게시판"/>
                        공지사항
                    </button>
                </li>
                <li>
                    <button>
                        <img src={`${process.env.PUBLIC_URL}/btn/news.svg`} alt="게시판"/>
                        유저뉴스
                    </button>
                </li>
                <li>
                    <button>
                        <img src={`${process.env.PUBLIC_URL}/btn/customer.svg`} alt="게시판"/>
                        지원센터
                    </button>
                </li>
                <li>
                    <button>
                        <img src={`${process.env.PUBLIC_URL}/btn/stickcon.svg`} alt="게시판"/>
                        스티커샵
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Menubtn;