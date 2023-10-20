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
        <div className="loginform-wrap">
            <div className="loginform-box">
                <button onClick={() => dispatch(loginMenuOff())}>X</button>
                <form onSubmit={onLoginClick}>
                    <input
                        type="text"
                        name="id"
                        id="id"
                        placeholder="id"
                        onChange={(e) => setId(e.target.value)}
                        className={idForm ? "loginform-idform active" : "loginform-idform"}
                        onClick={() => handleIdEvent()}
                    />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className={passwordForm ? "loginform-idform active" : "loginform-idform"}
                        onClick={() => handlePasswordEvent()}
                    />

                    <p>{error}</p>

                    <input type="submit" value="Login" className="loginform-loginbtn" />
                </form>
                <button className="loginform-signupbtn" onClick={() => dispatch(signupMenuOn())}>
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default Login;
