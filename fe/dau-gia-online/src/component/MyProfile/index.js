import styles from "./myProfile.module.css"
import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "../../interceptor";
import { url } from "../../util/Url";

function MyProfile() {
    const email = localStorage.getItem("email");
    const [data, setData] = useState({});
    const [fullName, setFullName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [address, setAddress] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        if (!email) return;

        axiosInstance.get(url + `users/search?search=${email}`)
            .then((res) => {
                if (res.data.data.length > 0) {
                    setData(res.data.data[0]);
                }
            })
            .catch((err) => console.log(err));
    }, [email]);

    useEffect(() => {
        if (data) {
            setFullName(data.fullName || "");
            setNewEmail(data.email || "");
            setAddress(data.address || "");
            setDate(data.dateOfBirth || "");
        }
    }, [data]);

    const [showModal, setShowModal] = useState(false);

    const handleChange = () => {
        setShowModal(true);
    };

    const confirmChange = () => {
        setShowModal(false);
        axiosInstance.put(url + `users/${data.id}`, {
            "email": newEmail || data.email,
            "fullName": fullName || data.fullName,
            "address": address || data.address,
            "dateOfBirth": date || data.dateOfBirth
        })
            .then((res) => {
                console.log(res);
                toast.success("Your information has been successfully updated!", {
                    position: "bottom-right",
                    autoClose: 1500
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const cancelChange = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className={styles.myProfileContainer}>
                <h1 className={styles.h1}>My Profile</h1>
                <p className={styles.p}>Manage profile information to keep your account secure</p>
                <div className={styles.line}></div>

                <div className={styles.content}>
                    <div className={styles.formSection}>
                        <div className={styles.formProfile}>
                            <label htmlFor="fullname">Full name</label>
                            <input name="fullName" value={fullName} required onChange={(e) => setFullName(e.target.value)} type="text" id="fullName" placeholder={data.fullName || "Enter your full name"} />
                        </div>

                        <div className={styles.formProfile}>
                            <label htmlFor="address">Address</label>
                            <input name="address" value={address} required onChange={(e) => setAddress(e.target.value)} type="text" id="address" placeholder={data.address || "Enter your address"} />
                        </div>

                        <div className={styles.formProfile}>
                            <label htmlFor="email">Email</label>
                            <input name="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required type="email" id="email" placeholder={data.email || "Enter your email"} />
                        </div>

                        <div className={styles.formProfile}>
                            <label htmlFor="dob">Date of birth</label>
                            <input name="date" onChange={(e) => setDate(e.target.value)} required type="date" id="dob" value={date || ""} />
                        </div>
                    </div>
                </div>

                <div className={styles.btChange}>
                    <button type="submit" className={styles.btnChange} onClick={handleChange}>Change</button>
                </div>
            </div>

            {showModal && (
                <div className={styles.notificationAlert}>
                    <div className={styles.notification}>
                        <p>Are you sure you want to change the information?</p>
                        <div className={styles.notificationButton}>
                            <button className={styles.btnConfirm} onClick={confirmChange}>Confirm</button>
                            <button className={styles.btnCancel} onClick={cancelChange}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    )
}

export default MyProfile;
