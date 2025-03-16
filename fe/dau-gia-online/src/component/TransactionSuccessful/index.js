import React, { useEffect, useState } from 'react';
import styles from "./transactionSuccessful.module.css";
import { SiTicktick } from "react-icons/si";
import axiosInstance from '../../interceptor';
import { url } from '../../util/Url';
import { toast } from 'react-toastify';

function TransactionSuccessful() {
    const email = localStorage.getItem("email");
    const amount = localStorage.getItem("totalAmount");
    const [id, setId] = useState(localStorage.getItem("id"))
    console.log(email, amount)
    useEffect(() => {
        debugger
        console.log("delete");
        axiosInstance.delete(url + `products/${id}`)
            .then(() => {
                localStorage.removeItem("id");
                return axiosInstance.post(url + `transactions`, {
                    "email": email,
                    "amount": parseInt(amount)
                });
            })
            .then((res) => {
                console.log(res);
                localStorage.removeItem("totalAmount");
            })
            .catch((err) => {
                toast.error("Create transaction failed", {
                    position: "bottom-right",
                    autoClose: 2000
                });
                console.log(err);
            });
    }, []);

    return (
        <div className={styles.confirmation}>
            <div className={styles.confirmationIcon}>
                <SiTicktick className={styles.icon} />
            </div>
            <h1 className={styles.confirmationTitle}>Payment successful</h1>
            <p className={styles.confirmationMessage}>
                Your order has been successfully paid. ABUY will contact you soon to deliver the product and service.
            </p>
            <a className={styles.confirmationButton} href="/home">Back to HomePage</a>
        </div>
    );
}

export default TransactionSuccessful;
