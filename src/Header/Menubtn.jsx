import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userBtn } from "../Redux/Usermenu";

function Menubtn(props) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col justify-center items-center w-1/3 shadow-xl z-40 relative bg-base-100 border-primary border-4 sm:w-full sm:h-full md:w-1/3 md:h-auto">
            <ul className="w-full px-4 box-border sm:flex justify-between py-4 sm:mt-0 md:block md:translate-y-0">
                <li className="w-full">
                    <button className="flex justify-center items-center flex-col py-2 mt-2 border-b-[1px] mb-4 text-center w-full box-border border-neutral sm:mb-0 sm:gap-2 sm:border-b-0 sm:mt-0 md:mt-2 md:mb-4" onClick={() => navigate('/')}>
                        <img src={`${process.env.PUBLIC_URL}/btn/home.svg`} className="mb-2 sm:w-5 sm:mb-0 sm:h-6 md:w-full md:h-5"  alt="홈" />
                        <span className="text-xs font-bold text-[#333] sm:text-sm">홈</span>
                    </button>
                </li>
                <li className="w-full">
                    <button className="flex justify-center items-center flex-col py-2 border-b-[1px] mb-4 text-center w-full box-border border-neutral  sm:mb-0 sm:gap-2 sm:border-none md:border-b-[1px] md:mb-4" onClick={() => dispatch(userBtn("list"))}>
                        <img src={`${process.env.PUBLIC_URL}/btn/pop.svg`}  className="fill-base-content mb-2 sm:w-5 sm:mb-0 sm:h-6 md:w-full md:h-5" alt="찾아보기" />
                        <span className="text-xs font-bold text-[#333] sm:text-sm">인기게시판</span>
                    </button>
                </li>
                <li className="w-full">
                    <button className="flex justify-center items-center flex-col py-2 border-b-[1px] mb-4 text-center w-full box-border border-neutral sm:mb-0 sm:gap-2 sm:border-none md:border-b-[1px] md:mb-4" onClick={() => dispatch(userBtn("main"))}>
                        <img src={`${process.env.PUBLIC_URL}/btn/news.svg`} className="mb-2 sm:w-5 sm:mb-0 sm:h-6 md:w-full md:h-5"  alt="찾아보기" />
                        <span className="text-xs font-bold text-[#333] sm:text-sm">구독게시판</span>
                    </button>
                </li>
                <li className="w-full">
                    <button className="flex justify-center items-center flex-col py-2 border-b-[1px] mb-4 text-center w-full box-border border-neutral  sm:mb-0 sm:gap-2 sm:border-none md:border-b-[1px] md:mb-4" onClick={() => dispatch(userBtn("search"))}>
                        <img src={`${process.env.PUBLIC_URL}/btn/search.svg`} className="mb-2 sm:w-5 sm:mb-0 sm:h-6 md:w-full md:h-5"  alt="게시판" />
                        <span className="text-xs  font-bold text-[#333] sm:text-sm">게시판 찾기</span>
                    </button>
                </li>
                <li className="w-full">
                <button className="flex justify-center items-center flex-col py-2 mb-4 text-center w-full box-border border-neutral sm:mb-0 sm:gap-2 sm:border-none md:mb-4">
                        <img src={`${process.env.PUBLIC_URL}/btn/customer.svg`} className="mb-2  sm:w-4 sm:mb-0 sm:h-6 md:w-full md:h-5"  alt="게시판" />
                        <span className="text-xs  font-bold text-[#333] sm:text-sm">문의 게시판</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Menubtn;
