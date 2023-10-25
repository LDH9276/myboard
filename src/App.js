import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./App.css";
import axios from "axios";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import Wtite from "./Board/Write";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import List from "./Board/List";
import Read from "./Board/Read";
import { Cookies } from "react-cookie";
import Mypage from "./Login/Mypage";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./Redux/Loginout";
import { boardLimit } from "./Redux/Board";
import Header from "./Header/Header";
import Board from "./Board/Board";
import Main from "./Main/Main";
import ErrorWindow from "./Header/ErrorWindow";
import { useMediaQuery } from "react-responsive";
import { themeChange } from "theme-change";
import { set } from "lodash";

function App() {
    const tokenChek = "http://localhost/myboard_server/JWT_Verify.php";
    const boardLimitCheck = "http://localhost/myboard_server/Board/Board_LimiteCheck.php";
    const isLoading = useSelector((state) => state.isLoading);
    const userId = useSelector((state) => state.userId);
    const userName = useSelector((state) => state.userName);
    const loginMenu = useSelector((state) => state.loginMenu);
    const signupMenu = useSelector((state) => state.signupMenu);
    const cookies = new Cookies();
    const dispatch = useDispatch();

    const THEME_LIGHT = useMemo(() => "mytheme");
    const THEME_DARK = useMemo(() => "dark");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const systemPreference = useMediaQuery({ query: "(prefers-color-scheme: dark)" });

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "default");

    useEffect(() => {
        localStorage.setItem("theme", theme);

        const localTheme = localStorage.getItem("theme");
        const defaultMode = localStorage.getItem("defaultMode");
        const osTheme = systemPreference ? "dark" : "mytheme";
        console.log(localTheme, osTheme);

        if (localTheme === "dark" && osTheme === "mytheme") {
            setIsDarkMode(true);
        } else if (localTheme === "mytheme" && osTheme === "dark") {
            setIsDarkMode(false);
        } else if (localTheme === "dark" && osTheme === "dark") {
            setIsDarkMode(true);
        } else if (defaultMode === "true" && osTheme === "dark") {
            setIsDarkMode(true);
        } else if (defaultMode === "true" && osTheme === "mytheme") {
            setIsDarkMode(false);
        }
    }, [theme, systemPreference]);

    useEffect(() => {
        document.querySelector("html").setAttribute("data-theme", isDarkMode ? THEME_DARK : THEME_LIGHT);
    }, [isDarkMode]);

    const handleTheme = useCallback(() => {
        const theme = localStorage.getItem("theme");
        if (theme === "mytheme") {
            localStorage.setItem("theme", "dark");
            localStorage.setItem("darkMode", true);
            setIsDarkMode(true);
            setTheme("dark");
        } else if (theme === "default") {
            const osTheme = systemPreference ? "dark" : "mytheme";
            if (osTheme === "dark") {
                localStorage.setItem("theme", "dark");
                localStorage.setItem("darkMode", true);
                setIsDarkMode(true);
                setTheme("dark");
            } else {
                localStorage.setItem("theme", "mytheme");
                localStorage.setItem("darkMode", false);
                setIsDarkMode(false);
                setTheme("mytheme");
            }
        } else {
            localStorage.setItem("theme", "mytheme");
            localStorage.setItem("darkMode", false);
            setIsDarkMode(false);
            setTheme("mytheme");
        }
    }, []);

    const handleDefaultTheme = useCallback(() => {
        const osTheme = systemPreference ? "dark" : "mytheme";
        if (localStorage.getItem("defaultMode") === "false" || localStorage.getItem("defaultMode") === null) {
            localStorage.setItem("defaultMode", true);
            if (osTheme === "dark") {
                localStorage.setItem("theme", "dark");
                localStorage.setItem("darkMode", true);
                setIsDarkMode(true);
                setTheme("default");
            } else {
                localStorage.setItem("theme", "mytheme");
                localStorage.setItem("darkMode", false);
                setIsDarkMode(false);
                setTheme("default");
            }
        } else {
            localStorage.setItem("defaultMode", false);
            if (osTheme === "dark") {
                localStorage.setItem("theme", "dark");
                localStorage.setItem("darkMode", true);
                setIsDarkMode(true);
                setTheme("default");
            } else {
                localStorage.setItem("theme", "mytheme");
                localStorage.setItem("darkMode", false);
                setIsDarkMode(false);
                setTheme("default");
            }
        }
    }, []);

    useEffect(() => {
        if(isDarkMode){
            themeChange("dark");
        } else {
            themeChange("mytheme");
        }
    }, [isDarkMode]);

    // 토큰 검증
    const verifyUser = async () => {
        const access_token = localStorage.getItem("access_token");
        const refresh_token = cookies.get("refresh_token");

        try {
            const response = await axios(tokenChek, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
                withCredentials: true,
            });
            if (response.data.success === true) {
                console.log(response.data);
                const userProfile = response.data.user_profile_name + "." + response.data.user_profile_ext;
                dispatch(login(response.data.user_id, response.data.user_name, response.data.user_info, userProfile)); // 로그인 상태로 변경
                localStorage.setItem("access_token", response.data.access_token);
            } else {
                console.log(response.data);
                dispatch(logout()); // 로그아웃 상태로 변경
                cookies.remove("refresh_token");
            }
        } catch (err) {
            console.log(err);
            localStorage.removeItem("access_token");
            cookies.remove("refresh_token");
        }
    };

    const readBoardList = async () => {
        try {
            const response = await axios.get(boardLimitCheck);
            dispatch(boardLimit(response.data.list[0].last_board, response.data.list[0].last_post));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        verifyUser();
        readBoardList();
    }, []);

    return (
        <Router data-set-theme={isDarkMode ? THEME_LIGHT : THEME_DARK}>
            <ErrorWindow />
            <Header handleTheme={handleTheme} isDarkMode={isDarkMode} handleDefaultTheme={handleDefaultTheme}/>
            {loginMenu ? <Login /> : null}
            {signupMenu ? <Signup /> : null}
            {isLoading ? (
                <div>
                    <span className="fixed loading loading-ring w-[72px] top-1/2 right-1/2 translate-x-1/2 z-[9982] text-primary"></span>
                    <span className="fixed font-xl top-2/6 right-1/2 translate-x-1/2 z-[9982] text-primary"></span>
                    <div className="fixed w-full h-full top-0 left-0 bg-base-100/75 z-[9980] backdrop-blur-sm"></div>
                </div>
            ) : null}

            <Routes>
                <Route exact path="/" element={<Main />} />
                <Route exact path="/:boardname" element={<List />} />
                <Route path="/mypage" element={<Mypage userId={userId} />} />
                <Route path="/write/" element={<Wtite userId={userId} userName={userName} />} />
                <Route path="/write/:id/:mod" element={<Wtite userId={userId} userName={userName} />} />
                <Route path="/Board/:id" element={<Board userId={userId} userName={userName} />} />
                <Route path="/read/:id" element={<Read userId={userId} userName={userName} />} />
                <Route path="*" element={<Main />} />
            </Routes>
        </Router>
    );
}

export default App;
