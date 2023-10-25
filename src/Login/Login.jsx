import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendLoginRequest } from "../API/sendLoginRequest";
import { Cookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../Redux/Loginout";
import "./css/loginsign.css";
import { signupMenuOn } from "../Redux/MenuToggle";
import { loginMenuOff } from "../Redux/MenuToggle";

function Login(props) {
    const isLoggenIn = useSelector((state) => state.isLoggenIn);
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [idForm, setIdForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState(false);
    const cookie = new Cookies();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onLoginClick = async (event) => {
        event.preventDefault();
        try {
            const data = await sendLoginRequest(id, password);
            console.log(data);
            localStorage.setItem("access_token", data.access_token);

            const expires = new Date();
            expires.setDate(expires.getDate() + 7);

            // cookie.set('refresh_token', data.refresh_token, {path: '/', expires, sameSite: 'strict', httpOnly: true});
            if (data.success === true) {
                const userProfile = data.user_profile_name + "." + data.user_profile_ext;
                dispatch(login(data.user_id, data.user_name, data.user_info, userProfile));
                navigate("/");
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const handleIdEvent = () => {
        setIdForm(true);
        setPasswordForm(false);
    };

    const handlePasswordEvent = () => {
        setIdForm(false);
        setPasswordForm(true);
    };

    useEffect(() => {
        if (isLoggenIn === true) {
            navigate("/");
        }
    }, [isLoggenIn]);

    return (
        <div className="fixed w-full h-full top-0 left-0 bg-white/75 z-[10000] backdrop-blur-sm flex justify-center items-center dark:bg-black/75 box-border px-4 bg-base-100">
            <div className="w-full max-w-[800px] bg-base-100 px-4 py-12 relative shadow-lg border-4 border-primary">
                <button onClick={() => dispatch(loginMenuOff())}>
                    <img src={`${process.env.PUBLIC_URL}/btn/close.svg`} className="absolute top-4 right-4 w-4 h-4" alt="close" />
                </button>

                <p className="text-2xl font-bold mt-4 mb-8">Login</p>

                <form onSubmit={onLoginClick}>
                    <input
                        type="text"
                        name="id"
                        id="id"
                        placeholder="id"
                        onChange={(e) => setId(e.target.value)}
                        className={idForm ? "w-full h-12 bg-base-100" : "w-full h-12  bg-base-100"}
                        onClick={() => handleIdEvent()}
                    />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className={passwordForm ? "w-full h-12 bg-base-100" : "w-full h-12  bg-base-100"}
                        onClick={() => handlePasswordEvent()}
                    />

                    <p>{error}</p>

                    <input type="submit" value="Login" className="btn-primary w-full text-center text-white h-12 mb-4" />
                </form>
                <button className="btn-secondary w-full text-center text-white h-12" onClick={() => dispatch(signupMenuOn())}>
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default Login;
