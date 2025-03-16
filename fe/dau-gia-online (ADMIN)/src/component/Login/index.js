import { useState } from "react";
import styles from "./login.module.css"
import { Link, useNavigate } from "react-router-dom";
import { url } from "../../util/Url";
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
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
                    const { role } = jwtDecode(token);
                    if (role === "ADMIN") {
                        login(token);
                        toast.success("Đăng nhập thành công", {
                            position: "bottom-right",
                            autoClose: 1000,
                            onClose: () => navigate("/admin-user")
                        })
                    }
                    else {
                        toast.error("Bạn không có quyền đăng nhập vào trang này", {
                            position: "bottom-right",
                            autoClose: 1000,
                        })
                    }


                } else {
                    setError(true);
                    toast.error("Sai thông tin đăng nhập!", {
                        position: "bottom-right",
                        autoClose: 1000
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                setError(true);
                toast.error("Sai thông tin đăng nhập!", {
                    position: "bottom-right",
                    autoClose: 1000
                });
            });
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

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
                        </form>
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </>
    )
}
export default Login; 