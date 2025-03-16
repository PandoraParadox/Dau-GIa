import { Link, useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url } from "../../util/Url";
import { format } from "date-fns";
import { FaRegEye } from "react-icons/fa";
import { IoEyeOffOutline } from "react-icons/io5";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const validatePassword = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pass);
  };
  const validateFullName = (name) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return regex.test(name);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      toast.error(
        "Nhập mật khẩu ít nhất phải có 8 kí tự có số, chữ cái đầu phải viết hoa và có kí tự đặc biệt",
        {
          position: "bottom-right",
          autoClose: 2000,
        }
      );
      return;
    }
    if (password != retypePassword) {
      toast.error("Mật khẩu chưa khớp", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } 
    if (!validateFullName(fullName)) {
      toast.error("Full Name không được chứa số hoặc ký tự đặc biệt", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }
    else {
      axios
        .post(url + "users/register", {
          email: email,
          password: password,
          retypePassword: retypePassword,
          fullName: fullName,
          address: address,
          dateOfBirth: date,
        })
        .then((res) => {
          if (res.data.status != 200) { 
            toast.warn("Người dùng đã tồn tại", {
              position: "bottom-right",
              autoClose: 2000,
            });
          } else {
            toast.success("Đăng ký thành công", {
              position: "bottom-right",
              autoClose: 2000,
              onClose: () => navigate("/"),
            });
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Có vấn đề trong việc đăng ký", {
            position: "bottom-right",
            autoClose: 2000,
          });
        });
    }
  };

  return (
    <>
      <div className={styles.backgroundImage}>
        <header>
          <div className={styles.headerContent}>
            <img src="/Logo.jpg" alt="Logo" className={styles.headerLogo} />
            <h1 className={styles.headerTitle}>Register</h1>
          </div>
        </header>
        <div className="d-flex align-items-center">
          <div className="container">
            <div
              className="row justify-content-center"
              style={{ margin: "20px" }}
            >
              <div className={`col-lg-6 col-md-8 ${styles.registerBox}`}>
                <div className={`col-lg-12 ${styles.registerTitle}`}>
                  Register
                  <div className={styles.registerLine}></div>
                </div>
                <div className={`col-lg-12 ${styles.registerForm}`}>
                  <form method="post" onSubmit={handleSubmit}>
                    <div className="row">
                      {/* Bên trái */}
                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <input
                            required
                            type="email"
                            className={`form-control ${styles.inputEmail}`}
                            name={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <span></span>
                          <label>Email</label>
                        </div>
                        <div
                          className={
                            styles.formGroup + " " + styles.eyeIconShow
                          }
                        >
                          <input
                            required
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${styles.inputPassword}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={styles.eyeButton}
                          >
                            {showPassword ? <FaRegEye /> : <IoEyeOffOutline />}
                          </button>
                          <span></span>
                          <label>Password</label>
                        </div>

                        <div
                          className={
                            styles.formGroup + " " + styles.eyeIconShow
                          }
                        >
                          <input
                            required
                            type={showRetypePassword ? "text" : "password"}
                            className={`form-control ${styles.inputRepassword}`}
                            value={retypePassword}
                            onChange={(e) => setRetypePassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowRetypePassword(!showRetypePassword)
                            }
                            className={styles.eyeButton}
                          >
                            {showRetypePassword ? (
                              <FaRegEye />
                            ) : (
                              <IoEyeOffOutline />
                            )}
                          </button>
                          <span></span>
                          <label>Re-enter Password</label>
                        </div>
                      </div>

                      {/* Bên phải */}
                      <div className="col-md-6">
                        <div className={styles.formGroup}>
                          <input
                            required
                            type="text"
                            className={`form-control ${styles.inputFullname}`}
                            name={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                          <span></span>
                          <label>Full Name</label>
                        </div>
                        <div className={styles.formGroup}>
                          <input
                            required
                            type="date"
                            className={`form-control ${styles.inputDate}`}
                            placeholder="Date"
                            name={date}
                            onChange={(e) => setDate(e.target.value)}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <input
                            required
                            type="text"
                            className={`form-control ${styles.inputAddress}`}
                            name={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                          <span></span>
                          <label>Address</label>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`col-12 ${styles.loginBtm} ${styles.loginButton} justify-content-center d-flex`}
                    >
                      <button
                        type="submit"
                        className={styles.btnOutlinePrimary}
                      >
                        Register
                      </button>
                    </div>
                    <div className={`${styles.loginLink} text-center mt-3`}>
                      <p>
                        Back to Login? <Link to="/"> Login </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Register;
