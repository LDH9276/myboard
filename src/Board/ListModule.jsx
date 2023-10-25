import React from "react";

function ListModule({ postCategory, setBoardCate, boardCate, autoRefresh, setAutoRefresh }) {
    return (
        <div className="board-module-wrap">
            <ul className="board-module-category">
                <li className={boardCate === "*" ? "board-category-btn active" : "board-category-btn text-base-content"}>
                    <button onClick={() => setBoardCate("*")}>전체</button>
                </li>
                {postCategory.map((category, index) => (
                    <li key={index} className={boardCate === index ? "board-category-btn active" : "board-category-btn text-base-content "}>
                        <button onClick={() => setBoardCate(index)}>{category}</button>
                    </li>
                ))}
            </ul>

            <p className="board-module-autorefresh">
                <span className="text-base-content">최신 글 알림</span>
                {autoRefresh ? 
                    <button onClick={() => setAutoRefresh(false)}>ON</button> : 
                    <button onClick={() => setAutoRefresh(true)}>OFF</button>
                }
            </p>
        </div>
    );
}

export default ListModule;
