import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userBtn } from "../Redux/Usermenu";

function Menubtn(props) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col justify-center items-center w-1/3 shadow-xl z-40 relative bg-base-100 border-primary border-4">
            <ul className="w-full px-4 box-border">
                <li>
                    <button className="flex justify-center items-center flex-col py-2 mt-2 border-b-[1px] mb-4 text-center w-full box-border" onClick={() => navigate('/')}>
                        <img src={`${process.env.PUBLIC_URL}/btn/home.svg`} className="mb-2"  alt="홈" />
                        <span className="text-sm font-bold text-[#333]">홈</span>
                    </button>
                </li>
                <li>
                    <button className="flex justify-center items-center flex-col py-2 border-b-[1px] mb-4 text-center w-full box-border" onClick={() => dispatch(userBtn("list"))}>
                        <img src={`${process.env.PUBLIC_URL}/btn/pop.svg`}  className="mb-2" alt="찾아보기" />
                        <span className="text-sm font-bold text-[#333]">인기게시판</span>
                    </button>
                </li>
                <li>
                    <button className="flex justify-center items-center flex-col py-2 border-b-[1px] mb-4 text-center w-full box-border" onClick={() => dispatch(userBtn("main"))}>
                        <img src={`${process.env.PUBLIC_URL}/btn/news.svg`} className="mb-2"  alt="찾아보기" />
                        <span className="text-sm font-bold text-[#333]">구독게시판</span>
                    </button>
                </li>
                <li>
                    <button className="flex justify-center items-center flex-col py-2 border-b-[1px] mb-4 text-center w-full box-border" onClick={() => dispatch(userBtn("search"))}>
                        <img src={`${process.env.PUBLIC_URL}/btn/search.svg`} className="mb-2"  alt="게시판" />
                        <span className="text-sm  font-bold text-[#333]">게시판 찾기</span>
                    </button>
                </li>
                <li>
                <button className="flex justify-center items-center flex-col py-2 mb-4 text-center w-full box-border">
                        <img src={`${process.env.PUBLIC_URL}/btn/customer.svg`} className="mb-2"  alt="게시판" />
                        <span className="text-sm  font-bold text-[#333]">문의 게시판</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Menubtn;
