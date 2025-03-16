import { useEffect, useState } from "react";
import styles from "./payment.module.css"
import { FaTruck } from "react-icons/fa";
import { useAsyncError, useParams } from "react-router-dom";
import axiosInstance from './../../interceptor/index';
import { url } from "../../util/Url";
import { formatCurrency } from "../../util/format";
import { provinces } from "../../util/distance";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransactionSuccessful from './../TransactionSuccessful/index';

function Payment() {
    const [product, setProduct] = useState({});
    const [shippingFee, setShippingFee] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [address, setAddress] = useState({});
    const [date, setDate] = useState("dd/MM/yyyy");
    const { id } = useParams();
    const [selectedShipping, setSelectedShipping] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isAgreed, setIsAgreed] = useState(false);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [inputAddress, setInputAddress] = useState("");
    const [isNameValid, setIsNameValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isAddressValid, setIsAddressValid] = useState(false);
    const [isShippingValid, setIsShippingValid] = useState(false);


    const handleShippingFee = (index) => {
        setSelectedShipping((prev) => {
            if (prev === index) {
                setShippingFee(0);
                setSpeed(0);
                setTotalAmount(product.startingPrice)
                return null;
            } else {
                if (index === 1) {
                    setShippingFee(50000);
                    setTotalAmount(product.startingPrice + 50000)

                    setSpeed(60);
                } else if (index === 2) {
                    setShippingFee(1000000);
                    setTotalAmount(product.startingPrice + 1000000)

                    setSpeed(120);
                } else {
                    setTotalAmount(product.startingPrice + 2000000)
                    setShippingFee(2000000);
                    setSpeed(900);
                }
                return index;
            }
        });
    };

    const validAddress = (address) => {
        if (!address) {
            toast.error("Địa chỉ không được để trống", {
                position: "bottom-right",
                autoClose: 3000,
            });
            return false;
        }
        const regex = /(.+?),\s*(Đường .+?),\s*(Phường .+?),\s*(Quận \d+|Huyện .+?),\s*(?:Tỉnh|Thành phố|TP\.?)\s*(.+)/;
        const match = address.match(regex);

        if (!match) {
            toast.error("Địa chỉ không đúng định dạng. Vui lòng nhập theo cấu trúc: Số nhà, Đường [Tên đường], Phường [Tên phường], Quận/Huyện [Tên quận/huyện], Tỉnh/Thành phố [Tên tỉnh/thành phố]", {
                position: "bottom-right",
                autoClose: 10000,
            })
            return false;
        }
        const province = match[5];
        if (provinces.some((p) => p.name === province)) {
            setAddress(provinces.find((p) => p.name === province));
            return true;
        }
        else {
            toast.error("Địa chỉ không tồn tại", {
                position: "bottom-right",
                autoClose: 3000,
            })
            return false;
        }
    }
    useEffect(() => {
        setIsShippingValid(shippingFee > 0);
    }, [shippingFee]);

    const validPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) {
            toast.error("Số điện thoại không được để trống", {
                position: "bottom-right",
                autoClose: 3000,
            });
            return false;
        }
        const phoneRegex = /^(0[2-9]{1}\d{8})$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error("Số điện thoại không hợp lệ", {
                position: "bottom-right",
                autoClose: 1000,
            });
            return false;
        }
        return true;
    }

    const handlePhoneNumber = (e) => {
        const result = e.target.value.trim();
        setPhone(result);
        setIsPhoneValid(validPhoneNumber(result));
    };

    const handleAdress = (e) => {
        const result = e.target.value;
        if (result) setIsAddressValid(validAddress(result));
        else setDate("dd/MM/yyyy")
    }
    const validName = (nameStr) => {
        if (!nameStr) {
            toast.error("Tên không được để trống", {
                position: "bottom-right",
                autoClose: 3000,
            });
            return false;
        }
        if (nameStr.length < 2) {
            toast.error("Tên phải có ít nhất 2 ký tự", {
                position: "bottom-right",
                autoClose: 3000,
            });
            return false;
        }
        return true;
    };

    const handleNameChange = (e) => {
        const result = e.target.value.trim();
        setName(result);
        setIsNameValid(validName(result));
    };
    const calculateDate = (distance, speed, shippingFee) => {
        if (!distance || speed <= 0 || !shippingFee) return "Dữ liệu không hợp lệ";

        const hours = distance / speed;
        const now = new Date();
        let additionalDays = 0;
        if (shippingFee === 50000) additionalDays = 4;
        else if (shippingFee === 1000000) additionalDays = 3;
        else if (shippingFee === 2000000) additionalDays = 2;

        now.setDate(now.getDate() + additionalDays);
        now.setHours(now.getHours() + Math.floor(hours));
        now.setMinutes(now.getMinutes() + Math.round((hours % 1) * 60));

        return now.toLocaleDateString("vi-VN");
    };

    useEffect(() => {
        if (address.distance && speed > 0 && shippingFee > 0) {
            setDate(calculateDate(address.distance, speed, shippingFee));
        }
    }, [address, speed, shippingFee]);

    useEffect(() => {
        axiosInstance.get(url + `products/${id}`)
            .then((res) => {
                setProduct(res.data.data);
            })
            .catch((err) => console.log(err))

    }, [])

    const handleAgreementChange = (e) => {
        setIsAgreed(e.target.checked);
    };

    const handlePayment = () => {

        axiosInstance.get(url + `payment/vn-pay?amount=${totalAmount}&bankCode=NCB`)
            .then((res) => {
                const url = res.data.data.paymentUrl;
                console.log(res)
                window.location.href = url;
                localStorage.setItem("id", product.id);
                localStorage.setItem("totalAmount", totalAmount);
            })
            .catch((res) => console.log(res))
    }
    return (
        <>

            <div className={styles.ui}>
                <div className={styles.textCenter}>
                    <div className={styles.title}>PAYMENT</div>
                </div>
                <div className={styles.frame}>
                    <div className={styles.box1}>
                        <div className={styles.addrBox}>
                            <div className={styles.boxName}>
                                ORDER INFORMATION
                            </div>
                            <input onBlur={handleNameChange} className={styles.inputName} type="text" placeholder="Name" />
                            <input onBlur={handlePhoneNumber} className={styles.inputPhone} type="text" placeholder="Phone number" />
                            <input onBlur={handleAdress} className={styles.inputAddr} type="text" placeholder="Address" />
                        </div>
                        <div className={styles.space}></div>
                        <div className={styles.formBox}>
                            <div className={styles.delivBox}>
                                <div className={styles.formTitle}>Form of delivery</div>
                                <div className={styles.delivContent}><a className={styles.icon}><FaTruck /></a> Delivered to your location</div>
                            </div>
                            <div className={styles.shipBox}>
                                <div className={styles.formTitle}>Shipping by</div>
                                <div className={`${styles.btnGroup} ${styles.dFlex} ${styles.justifyContentCenter}`} role="group">
                                    <input type="radio" className={styles.btnCheck} name="shipping" id="motorbike" checked={selectedShipping === 1} readOnly />
                                    <label
                                        onClick={() => handleShippingFee(1)}
                                        className={`${styles.btn} ${selectedShipping === 1 ? styles.btnPrimary : styles.btnOutlineSecondary} ${styles.mx2}`}
                                        htmlFor="motorbike"
                                    >
                                        Motorbike
                                    </label>

                                    <input type="radio" className={styles.btnCheck} name="shipping" id="plane" checked={selectedShipping === 2} readOnly />
                                    <label
                                        onClick={() => handleShippingFee(2)}
                                        className={`${styles.btn} ${selectedShipping === 2 ? styles.btnPrimary : styles.btnOutlineSecondary} ${styles.mx2}`}
                                        htmlFor="plane"
                                    >
                                        Van
                                    </label>
                                    <input type="radio" className={styles.btnCheck} name="shipping" id="van" checked={selectedShipping === 3} readOnly />
                                    <label
                                        onClick={() => handleShippingFee(3)}
                                        className={`${styles.btn} ${selectedShipping === 3 ? styles.btnPrimary : styles.btnOutlineSecondary} ${styles.mx2}`}
                                        htmlFor="van"
                                    >
                                        Plane
                                    </label>
                                </div>


                            </div>
                            <div className={styles.dateBox}>
                                <div className={styles.formTitle}>Delivery date</div>
                                <div className={styles.dateSelect}>{date}</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.box2}>
                        <div className={styles.boxTitle}>
                            ORDERS
                        </div>
                        <div className={styles.productName}>
                            {product.name}
                        </div>
                        <div className={styles.inforBox}>
                            <div className={styles.priceBox}>
                                <div className={styles.priceItem + " " + styles.font1}>Price of the item: </div>
                                <div className={styles.price + " " + styles.font2}>{formatCurrency(product.startingPrice)} VND</div>
                            </div>
                            <div className={styles.feeBox}>
                                <div className={styles.shipFee + " " + styles.font1}>Shipping fee: </div>
                                <div className={styles.fee + " " + styles.font2}>{formatCurrency(shippingFee)} VND</div>
                            </div>
                            <div className={styles.pilici}>
                                <input className={styles.tick} onChange={handleAgreementChange} checked={isAgreed} type="checkbox" />
                                <span className={styles.poliAgree}>I agree to all <a href="#" target="_blank" className={styles.poliLink}>operating policies</a></span>
                            </div>
                        </div>
                        <div className={styles.boxFinal}>
                            <div className={styles.finalInfor}>
                                <div className={styles.totalAmount}>Total Amount</div>
                                <div className={styles.totalPrice + " " + styles.font3}>{formatCurrency(product.startingPrice + shippingFee)} VND</div>
                            </div>
                            <div className={styles.btn} >
                                <button onClick={handlePayment} disabled={!isAgreed || !isNameValid || !isPhoneValid || !isAddressValid|| !isShippingValid} className={styles.agreeBtn}>Agree to ship</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
export default Payment;
