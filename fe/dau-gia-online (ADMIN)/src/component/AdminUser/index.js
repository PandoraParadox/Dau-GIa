import styles from "./adminUser.module.css";
import { FaUsers } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import { BiSolidInbox } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../interceptor";
import { url } from "../../util/Url";
import { useAuth } from "../../context/AuthContext";


function AdminUser() {
    const [data, setData] = useState([]);
    const [adminLength, setAdminLength] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("get all account")
        axiosInstance.get("http://localhost:8081/api/v1/users")
            .then((res) => {
                setData(res.data.data);
            })
            .catch((err) => console.log(err));
        axiosInstance.get(url + `users/role?role=ADMIN`)
            .then((res) => {
                console.log(res);
                setAdminLength(res.data.data.length)
            })
    }, []);

    const handleDeleteUser = (id) => {
        setUserToDelete(id);
        setShowModal(true);
    };

    const confirmChange = () => {
        axiosInstance.delete(`http://localhost:8081/api/v1/users/${userToDelete}`)

            .then(() => {
                setData(data.filter(user => user.id !== userToDelete));
                setShowModal(false);

                toast.success("User has been successfully deleted!", {
                    position: "bottom-right",
                    autoClose: 1500,
                });
            })
            .catch((err) => console.log(err));
    };

    const cancelChange = () => {
        setShowModal(false);
    };

    const handleToUsers = () => {
        navigate("/admin-user");
    };

    const handleToProducts = () => {
        navigate("/admin-product");
    };

    const handleToPayHistory = () => {
        navigate("/transaction-history");
    };

    const { logout } = useAuth();
    const handleToLogOut = () => {
        logout();
        navigate("/");
    }
    const handleSearch = async (e) => {
        const search = e.target.value;
        const response = await axiosInstance.get(url + `users/search?search=${search}`)
        setData(response.data.data);
    }

    return (
        <>
            <div>
                <div className={styles.app}>
                    <div className={styles.sidebar}>
                        <div className={styles.logo}>
                            <h1>ADMIN</h1>
                        </div>
                        <ul className={styles.menu}>
                            <li onClick={handleToUsers} className={styles.menuItem + " " + styles.active}>
                                <span className={styles.icon}><FaUsers /></span>
                                <span className={styles.text}>Users</span>
                            </li>
                            <li onClick={handleToProducts} className={styles.menuItem}>
                                <span className={styles.icon}><FaBoxArchive /></span>
                                <span className={styles.text}>Products</span>
                            </li>
                            <li onClick={handleToPayHistory} className={styles.menuItem}>
                                <span className={styles.icon}><FaMoneyCheckDollar /></span>
                                <span className={styles.text}>Payment History</span>
                            </li>
                        </ul>
                        <div className={styles.sidebarUser} onClick={handleToLogOut}>
                            <img src="/user.png" alt="User Avatar" className={styles.avatar} />
                            <p className={styles.username}>ADMIN</p>
                        </div>
                    </div>
                    <div className={styles.mainContent}>
                        <div className={styles.header}>
                            <h1>USERS</h1>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <h1>{data.length}</h1>
                                <h1>Total Users</h1>
                            </div>
                            <div className={styles.stat}>
                                <h1>{adminLength}</h1>
                                <h1>Admin</h1>
                            </div>
                        </div>
                        <div className={styles.searchBar}>
                            <input onChange={handleSearch} type="text" placeholder="Search by Name or Email" />
                        </div>
                        <div className={styles.scrollableDiv}>
                            <table className={styles.userTable}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>EMAIL</th>
                                        <th>ADDRESS</th>
                                        <th>DATE OF BIRTH</th>
                                        <th>ROLE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((user) =>
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.fullName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.address}</td>
                                            <td>{user.dateOfBirth}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button onClick={() => navigate(`/update-user/${user.id}`)} className={styles.edit}><BiSolidInbox /></button>
                                                <button onClick={() => handleDeleteUser(user.id)} className={styles.delete}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className={styles.notificationAlert}>
                    <div className={styles.notification}>
                        <p>Are you sure you want to delete this user?</p>
                        <div className={styles.notificationButton}>
                            <button className={styles.btnConfirm} onClick={confirmChange}>Confirm</button>
                            <button className={styles.btnCancel} onClick={cancelChange}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    );
}

export default AdminUser;
