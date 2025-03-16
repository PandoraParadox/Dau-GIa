import { useEffect, useState } from "react";
import styles from "./transaction.module.css";
import axiosInstance from "../../interceptor";
import { url } from "../../util/Url";
import { formatCurrency } from "../../util/format";

function TransactionHistory() {
    const [data, setData] = useState([]);
    const email = localStorage.getItem("email");
    const [date, setDate] = useState("");
    const [search, setSearch] = useState("");
    function getTransactionDate(dateString) {
        const [year, month, day] = dateString.split(" ")[0].split("-");
        return `${day}/${month}/${year}`;
    }

    function getTransactionTime(dateString) {
        return dateString.split(" ")[1];
    }
    useEffect(() => {
        axiosInstance.get(url + `transactions/email?email=${email}`)
            .then((res) => {
                console.log(res.data.data);
                setData(res.data.data);
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])
    const handleChangeDate = (e) => {
        const value = e.target.value;
        if (value) {
            axiosInstance.get(url + `transactions/date?email=${email}&date=${value}`)
                .then((res) => {
                    setData(res.data.data)
                })
                .catch((err) => console.log(err))
        }
        else {
            axiosInstance.get(url + `transactions/email?email=${email}`)
            .then((res) => {
                console.log(res.data.data);
                setData(res.data.data);
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }
    const handleChangeSearch = (e) => {
        const value = e.target.value;
        axiosInstance.get(url + `transactions/search?email=${email}&search=${value}`)
            .then((res) => {
                console.log(res);

            })
            .catch((err) => console.log(err))
    }
    return (
        <div className={styles.transactionHistoryContainer}>
            <h2 className="transactionHistoryTitle">Payment History</h2>

            <div className={styles.searchBox}>

                <input name={date} onChange={handleChangeDate} className={styles.searchInput} type="date" placeholder="dd/MM/yyyy" />
                <input name={search} onChange={handleChangeSearch} className={styles.searchInput} type="text" placeholder="Search for content" />
                <button className={styles.searchButton}>Search</button>
            </div>

            <div className={styles.historyList}>
                {data.map((t) => {
                    return <div className={styles.historyItem}>
                        <div className={styles.historyInfo}>
                            <p className={styles.date}>{getTransactionDate(t.transactionDate)}</p>
                            <p className={styles.time}>{getTransactionTime(t.transactionDate)}</p>
                            <p className={styles.content}>Content: {t.content}</p>
                        </div>
                        <p className={styles.amount}>{formatCurrency(t.amount)} VND</p>
                    </div>
                })}

            </div>
        </div>
    );
}

export default TransactionHistory;
