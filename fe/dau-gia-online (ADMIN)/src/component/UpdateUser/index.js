import styles from "./updateUser.module.css";
import { FaUsers } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../interceptor";
import { useAuth } from "../../context/AuthContext";


const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    address: "",
  });
  const [emailExists, setEmailExists] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (!id) {
      toast.error("User ID is missing!", { position: "bottom-right", autoClose: 1000 });
      return;
    }

    axiosInstance.get(`http://localhost:8081/api/v1/users/id/${id}`)
      .then((response) => {
        if (response.data && response.data.data) {
          setUser(response.data.data);
        } else {
          toast.error("User not found!", { position: "bottom-right", autoClose: 1000 });
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data. Please try again later.", {
          position: "bottom-right",
          autoClose: 1000,
        });
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    if (name === "dateOfBirth") {
      validateDate(value);
    }
  };

  const validateDate = (date) => {
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setDateError("Invalid date format. Please use YYYY-MM-DD.");
      return;
    }

    const [year, month, day] = date.split("-").map(Number);
    const isValidDate = (y, m, d) => {
      const date = new Date(y, m - 1, d);
      return date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d;
    };

    if (!isValidDate(year, month, day)) {
      setDateError("Invalid date. Please enter a valid date.");
    } else {
      setDateError("");
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await axiosInstance.get("http://localhost:8081/api/v1/users");
      if (response.data && response.data.data) {
        const users = response.data.data;
        const emailUsed = users.some((userNew) => userNew.email === email && userNew.id !== parseInt(id));
        setEmailExists(emailUsed);
      }
    } catch (error) {
      console.error("Error checking email:", error);
      toast.error("Failed to check email availability. Please try again.", {
        position: "bottom-right",
        autoClose: 1000,
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    validateDate(user.dateOfBirth);
    if (dateError) {
      toast.error(dateError, { position: "bottom-right", autoClose: 1000 });
      return;
    }

    await checkEmailExists(user.email);
    if (emailExists) {
      toast.error("This email is already in use. Please choose another one.", {
        position: "bottom-right",
        autoClose: 1000,
      });
      return;
    }

    setShowModal(true);
  };

  const confirmChange = () => {
    axiosInstance
      .put(`http://localhost:8081/api/v1/users/${id}`, user)
      .then(() => {
        toast.success("User details updated successfully!", {
          position: "bottom-right",
          autoClose: 1000,
          onClose: () => navigate("/admin-user"),
        });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        toast.error("Failed to update user. Please try again.", {
          position: "bottom-right",
          autoClose: 1000,
        });
      });

    setShowModal(false);
  };

  const cancelChange = () => setShowModal(false);
  const handleCancel = () => {
    toast.info("User update canceled.", { position: "bottom-right", autoClose: 1000 });
    navigate("/admin-user");
  };

  // Navigation handlers
  const handleToUsers = () => navigate("/admin-user");
  const handleToProducts = () => navigate("/admin-product");
  const handleToPayHistory = () => navigate("/transaction-history");

  const { logout } = useAuth();
  const handleToLogOut = () => {
    logout();
    navigate("/");
  };


  return (
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>ADMIN</h1>
        </div>
        <ul className={styles.menu}>
          <li className={styles.menuItem + " " + styles.active} onClick={handleToUsers}>
            <span className={styles.icon}>
              <FaUsers />
            </span>
            <span className={styles.text}>Users</span>
          </li>
          <li className={styles.menuItem} onClick={handleToProducts}>
            <span className={styles.icon}>
              <FaBoxArchive />
            </span>
            <span className={styles.text}>Products</span>
          </li>
          <li className={styles.menuItem} onClick={handleToPayHistory}>
            <span className={styles.icon}>
              <FaMoneyCheckDollar />
            </span>
            <span className={styles.text}>Payment History</span>
          </li>
        </ul>
        <div className={styles.sidebarUser} onClick={handleToLogOut}>
          <img
            src="/user.png"
            alt="User Avatar"
            className={styles.avatar}
          />
          <p className={styles.username}>ADMIN</p>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>UPDATE USERS</h1>
        </div>
        <div className={styles.userUpdate}>
          <form className="form__updateUser" onSubmit={handleUpdate}>
            <div className={styles.userDetails}>
              <div className={styles.userColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={user.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.userColumn}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="date">Date of Birth</label>
                  <input
                    type="text"
                    id="date"
                    name="dateOfBirth"
                    value={user.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className={styles.userActions}>
              <button type="button" onClick={handleCancel}>Cancel</button>
              <button type="submit">Update</button>
            </div>
          </form>

          {showModal && (
            <div className={styles.notificationAlert}>
              <div className={styles.notification}>
                <p>Are you sure you want to update the information?</p>
                <div className={styles.notificationButton}>
                  <button className={styles.btnConfirm} onClick={confirmChange}>Confirm</button>
                  <button className={styles.btnCancel} onClick={cancelChange}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;