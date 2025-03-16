import { useEffect, useState } from "react";
import styles from "./login.module.css"
import { Link, useNavigate } from "react-router-dom";
import { url } from "../../util/Url";
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();




    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(url + "users/login", {
            email,
            password
        })
            .then((res) => {
                console.log(res);
                const token = res.data.data;
                if (token) {
                    login(token);
                    toast.success("Log in successfully", {
                        position: "bottom-right",
                        autoClose: 1000,
                        onClose: () => navigate("/home")
                    })

                } else {
                    setError(true);
                    toast.error("Wrong login information!", {
                        position: "bottom-right",
                        autoClose: 1000
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                setError(true);
                toast.error("Wrong login information!", {
                    position: "bottom-right",
                    autoClose: 1000
                });
            });
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleOAuth2 = (register) => {
        window.location.href = `http://localhost:8081/oauth2/authorization/${register}`
    }

    return (
        <>
            <div>
                <div className={styles.background}>
                    <header>
                        <div className={styles.headerContent}>
                            <img src="/Logo.jpg" alt="Logo" className={styles.headerLogo} />
                            <h1 className={styles.headerTitle}>Login</h1>
                        </div>
                    </header>
                    <div className={styles.container}>
                        <h1 className={styles.h1}>Login</h1>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.khung}>
                                <input type="email" required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <span></span>
                                <label>Email</label>
                            </div>
                            <div className={styles.khung}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.passwordInput}
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowPassword}
                                    className={styles.eyeButton}
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                                <span></span>
                                <label>Password</label>
                            </div>
                            <input type="submit" value="Login" />
                            <div className={styles.socialLogin}>
                                <button onClick={() => handleOAuth2("google")} type="button" className={styles.googleLogin}>
                                    <FaGoogle /> Login with Google
                                </button>
                                <button onClick={() => handleOAuth2("github")} type="button" className={styles.githubLogin}>
                                    <FaGithub /> Login with GitHub
                                </button>
                            </div>
                            <div className={styles.forgotPassword}>
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>
                            <div className={styles.signupLink}>
                                Not a member? <Link to="/register">Signup</Link>
                            </div>
                        </form>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </>
    )
}
export default Login; 