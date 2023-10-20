import React from "react";

function Menubtn(props) {
    return (
        <div className="flex flex-col justify-center items-center w-1/3 shadow-xl z-40 relative bg-base-100">
            <ul className="w-full px-4 box-border">
                <li>
                    <button className="flex justify-center items-center flex-col py-2 mt-2 border-b-[1px] mb-4 text-center w-full box-border">
                        <img src={`${process.env.PUBLIC_URL}/btn/home.svg`} alt="홈" />
                        <span className="text-sm">홈</span>
                    </button>
                </li>
                <li>
                    <button className="flex justify-center items-center flex-col py-2 border-b-[1px] mb-4 text-center w-full box-border">
                        <img src={`${process.env.PUBLIC_URL}/btn/notice.svg`} alt="게시판" />
                        <span className="text-sm">홈</span>
                    </button>
                </li>
                <li>
                    <button className="flex justify-center items-center flex-col py-2 border-b-[1px] mb-4 text-center w-full box-border">
                        <img src={`${process.env.PUBLIC_URL}/btn/news.svg`} alt="게시판" />
                        <span className="text-sm">홈</span>
                    </button>
                </li>
                <li>
                    <button className="flex justify-center items-center flex-col py-2 border-b-[1px] mb-4 text-center w-full box-border">
                        <img src={`${process.env.PUBLIC_URL}/btn/customer.svg`} alt="게시판" />
                        <span className="text-sm">홈</span>
                    </button>
                </li>
                <li>
                    <button className="flex justify-center items-center flex-col py-2 mb-2 text-center w-full box-border">
                        <img src={`${process.env.PUBLIC_URL}/btn/stickcon.svg`} alt="게시판" />
                        <span className="text-sm">홈</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Menubtn;
