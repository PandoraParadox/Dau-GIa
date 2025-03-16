import { useState } from "react";
import styles from "./forgotPassword.module.css";
import { ToastContainer, toast } from "react-toastify";
import { IoIosMail } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";
import { url } from "../../util/Url";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    // Gửi email xác nhận
    const handleSendEmail = async () => {
        if (!email) {
            toast.error("Please enter your email.", {
                position: "bottom-right",
                autoClose: 2000,
            });
            return;
        }

        try {
            await axios.post(url + `forgot-password?email=${email}`);
            setStep(2);
            toast.success("Verification code sent to email!", {
                position: "bottom-right",
                autoClose: 2000,
            });
        } catch (err) {
            toast.error("Cannot find user with email: " + email, {
                position: "bottom-right",
                autoClose: 2000,
            });
        }
    };

    // Xác nhận và đổi mật khẩu
    const handleResetPassword = async () => {
        if (!code || !newPassword || !confirmPassword) {
            toast.error("Please fill in all fields.", {
                position: "bottom-right",
                autoClose: 2000,
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!", {
                position: "bottom-right",
                autoClose: 2000,
            });
            return;
        }

        try {
            await axios.post(url + "forgot-password/change-password", {
                email: email,
                code: code,
                password: newPassword,
            });
            toast.success("Password changed successfully!", {
                position: "bottom-right",
                autoClose: 2000,
                onClose: navigate("/")
            });
            setStep(1); // Reset về bước nhập email
            setEmail("");
            setCode("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            toast.error("Invalid verification code.", {
                position: "bottom-right",
                autoClose: 2000,
            });
        }
    };

    return (
        <>
            <div>
                <div className={styles.background}>
                    <header>
                        <div className={styles.headerContent}>
                            <img src="/Logo.jpg" alt="Logo" className={styles.headerLogo} />
                            <h1 className={styles.headerTitle}>Password Reset</h1>
                        </div>
                    </header>
                    <div className={styles.container}>
                        <h1 className={styles.h1}>Password reset</h1>
                        <p className={styles.instructions}>
                            You will receive instructions for resetting your password.
                        </p>

                        {/* Form */}
                        <form>
                            {step === 1 && (
                                <div className={styles.khung}>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <span></span>
                                    <label>Your email address</label>
                                </div>
                            )}

                            {step === 2 && (
                                <>
                                    <div className={styles.khung}>
                                        <input
                                            type="text"
                                            required
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                        />
                                        <span></span>
                                        <label>Verification Code</label>
                                    </div>

                                    <div className={styles.khung}>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <span></span>
                                        <label>New Password</label>
                                    </div>

                                    <div className={styles.khung}>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <span></span>
                                        <label>Confirm New Password</label>
                                    </div>
                                </>
                            )}
                        </form>

                        {/* Buttons */}
                        {step === 1 ? (
                            <button type="button" className={styles.sendButton} onClick={handleSendEmail}>
                                <IoIosMail /> SEND
                            </button>
                        ) : (
                            <button type="button" className={styles.sendButton} onClick={handleResetPassword}>
                                <IoIosMail /> RESET PASSWORD
                            </button>
                        )}
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
