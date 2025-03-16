import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './updateProduct.module.css';
import { FaUsers, FaBoxArchive, FaMoneyCheckDollar } from 'react-icons/fa6';
import axiosInstance from '../../interceptor';
import { useAuth } from "../../context/AuthContext";


function UpdateProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        startingPrice: '',
        auctionTime: '',
        category: '',
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axiosInstance.get(`http://localhost:8081/api/v1/products/${id}`)
            .then(response => {
                const productData = response.data.data;
                console.log(productData)
                // if (productData.auctionTime) {
                //     productData.auctionTime = productData.auctionTime.replace("T", " ");
                // }
                setProduct(productData);
            })
            .catch(error => console.error('Error fetching product data', error));
    }, [id]);

    const formatCurrency = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat("vi-VN").format(value) + " VND";
    };

    const parseCurrency = (value) => {
        return value.replace(/\D/g, "");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "startingPrice") {
            const numericValue = parseCurrency(value);
            setProduct(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setProduct(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!product.name || !product.startingPrice || !product.auctionTime || !product.category) {
            toast.error('All fields must be filled out!', {
                position: 'bottom-right',
                autoClose: 1500
            });
            return;
        }
        setShowModal(true);
    };

    const confirmChange = () => {
        if (Number(product.startingPrice) < 0) {
            toast.error('Starting Price must be a valid positive number!', {
                position: 'bottom-right',
                autoClose: 1100
            });
            return;
        }

        let formattedTime = product.auctionTime;

        formattedTime = formattedTime.replace(" ", "T");

        if (formattedTime.length === 16) {
            formattedTime += ":00";
        }

        const updatedProduct = {
            ...product,
            startingPrice: Number(product.startingPrice),
            auctionTime: formattedTime
        };



        axiosInstance.put(`http://localhost:8081/api/v1/products/${id}`, updatedProduct)
            .then(() => {
                toast.success('Product information updated successfully!', {
                    position: 'bottom-right',
                    autoClose: 1000,
                    onClose: () => navigate('/admin-product')
                });
            })
            .catch(error => {
                console.error('Error updating product', error);
                toast.error('Failed to update product.', {
                    position: 'bottom-right',
                    autoClose: 1100
                });
            });

        setShowModal(false);
    };

    const cancelChange = () => setShowModal(false);

    const handleCancel = () => {
        toast.error('Update Canceled', {
            position: 'bottom-right',
            autoClose: 1100,
            onClose: () => navigate("/admin-product")
        });
    };

    const { logout } = useAuth();
    const handleToLogOut = () => {
        logout();
        navigate("/");
    }

    return (
        <div className={styles.ui}>
            <div className={styles.sidebar}>
                <div className={styles.logo}><h1>ADMIN</h1></div>
                <ul className={styles.menu}>
                    <li className={styles.menuItem} onClick={() => navigate("/admin-user")}>
                        <FaUsers className={styles.icon} /><span>Users</span>
                    </li>
                    <li className={`${styles.menuItem} ${styles.active}`} onClick={() => navigate("/admin-product")}>
                        <FaBoxArchive className={styles.icon} /><span>Products</span>
                    </li>
                    <li className={styles.menuItem} onClick={() => navigate("/transaction-history")}>
                        <FaMoneyCheckDollar className={styles.icon} /><span>Payment History</span>
                    </li>
                </ul>
                <div className={styles.sidebarUser} onClick={() => handleToLogOut()}>
                    <img src="/user.png" alt="User Avatar" className={styles.avatar} />
                    <div className={styles.username}>ADMIN</div>
                </div>
            </div>

            <div className={styles.mainBox}>
                <div className={styles.title}>UPDATE PRODUCTS</div>
                <div className={styles.contentBox}>
                    <form className={styles.form__updateProduct} onSubmit={handleUpdate}>
                        <div className={styles.inforBox}>
                            <div className={styles.field}>
                                <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Product Name" autoComplete="off" />
                            </div>
                            <div className={styles.field}>
                                <input type="text" name="startingPrice" value={product.startingPrice} onChange={handleChange} placeholder="Starting Price" autoComplete="off" />
                            </div>
                            <div className={styles.field}>
                                <input
                                    type="datetime-local"
                                    name="auctionTime"
                                    value={product.auctionTime}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.cateField}>
                                <label>Category:</label>
                                <select defaultValue={product.category} name="category" value={product.category} onChange={handleChange}>
                                    <option value="">Select</option>
                                    <option value="tui xach">Bag</option>
                                    <option value="dong ho">Watch</option>
                                    <option value="do co">Antique</option>
                                    <option value="giay">Sneakers</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div className={styles.btn}>
                    <div className={styles.cancelBtn} onClick={handleCancel}>Cancel</div>
                    <button type="button" className={styles.uploadBtn} onClick={handleUpdate}>Upload</button>
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
        </div>
    );
}

export default UpdateProduct;
