import styles from "./addProduct.module.css";
import { FaUsers } from "react-icons/fa";
import { FaMoneyCheckDollar, FaBoxArchive } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from './../../interceptor/index';
import { url } from "../../util/Url";
import { useAuth } from "../../context/AuthContext";



function AddProduct() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [files, setFiles] = useState([]);
    const [prevFiles, setPrevFiles] = useState([]);
    const [id, setId] = useState(0);
    const [prod, setProd] = useState({
        "name": "",
        "startingPrice": "",
        "auctionTime": "",
        "category": ""
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        clearTimeout(window.priceValidationTimeout);

        if (name === "startingPrice") {
            const numericValue = value.replace(/\D/g, '');

            window.priceValidationTimeout = setTimeout(() => {
                if (!/^\d*$/.test(numericValue) || Number(numericValue) < 0) {
                    toast.error('Please enter a valid number!', {
                        position: 'bottom-right',
                        autoClose: 1000
                    });
                    return;
                }
            }, 700);

            setProd((prevProd) => ({
                ...prevProd,
                [name]: numericValue ? new Intl.NumberFormat('vi-VN').format(numericValue) + ' VND' : '',
            }));
        } else {
            setProd((prevProd) => ({
                ...prevProd,
                [name]: value,
            }));
        }
    };


    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length + files.length > 4) {
            toast.error('Bạn chỉ có thể chọn tối đa 4 ảnh!', {
                position: 'bottom-right',
                autoClose: 2000
            });
            return;
        }
        console.log("Files selected:", newFiles);
        const filePreviews = newFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setPrevFiles(newFiles => [...newFiles, ...filePreviews]);
        setFiles(prevFiles => [
            ...prevFiles,
            ...newFiles.map(file => file) // Chỉ lưu File, không lưu preview
        ]);
    };


    const handleShowModal = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const confirmChange = async () => {
        try {
            if (!prod.name || !prod.startingPrice || !prod.auctionTime || !prod.category) {
                toast.error('Vui lòng nhập đầy đủ thông tin', {
                    position: 'bottom-right',
                    autoClose: 1000
                });
                return;
            }

            const product = {
                ...prod,
                "startingPrice": parseInt(prod.startingPrice.replace(/\D/g, ''), 10)
            };

            console.log("Gửi request tạo sản phẩm:", product);

            const response = await axiosInstance.post("http://localhost:8081/api/v1/products", product);
            const productId = response.data.data.id;


            if (!productId) {
                throw new Error("Không lấy được ID sản phẩm");
            }

            console.log("Sản phẩm được tạo với ID:", productId);

            if (files.length === 0) {
                toast.error("Bạn chưa chọn ảnh!");
                return;
            }

            const formData = new FormData();

            // Đảm bảo files chứa đúng kiểu dữ liệu
            files.forEach((file) => formData.append("files", file));

            try {
                await axiosInstance.post(
                    `http://localhost:8081/api/v1/products/uploads/${productId}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );

            } catch (error) {
                console.error("Lỗi khi upload ảnh:", error.response?.data || error.message);
                toast.error("Lỗi khi upload ảnh!");
            }


            toast.success('Product added successfully!', {
                position: 'bottom-right',
                autoClose: 1000,
                onClose: () => navigate('/admin-product')
            });

        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            toast.error('Failed to update product.', {
                position: 'bottom-right',
                autoClose: 1000
            });
        } finally {
            setShowModal(false);
        }
    };


    const cancelChange = () => {
        setShowModal(false);
    };

    const handleCancel = () => {
        toast.error('Add Product Canceled', {
            position: 'bottom-right',
            autoClose: 1500,
            onClose: () => navigate('/admin-product')
        });
    };

    const handleRefresh = () => {
        setFiles([]);
        setPrevFiles([]);
    }

    const handleToUsers = () => navigate("/admin-user");
    const handleToProducts = () => navigate("/admin-product");
    const handleToPayHistory = () => navigate("/transaction-history");
    const { logout } = useAuth();
    const handleToLogOut = () => {
        logout();
        navigate("/");
    }

    return (
        <>
            <div className={styles.ui}>
                <div className={styles.sidebar}>
                    <div className={styles.logo}>
                        <h1>ADMIN</h1>
                    </div>
                    <ul className={styles.menu}>
                        <li className={styles.menuItem} onClick={handleToUsers}>
                            <span className={styles.icon}><FaUsers /></span>
                            <span className={styles.text}>Users</span>
                        </li>
                        <li className={`${styles.menuItem} ${styles.active}`} onClick={handleToProducts}>
                            <span className={styles.icon}><FaBoxArchive /></span>
                            <span className={styles.text}>Products</span>
                        </li>
                        <li className={styles.menuItem} onClick={handleToPayHistory}>
                            <span className={styles.icon}><FaMoneyCheckDollar /></span>
                            <span className={styles.text}>Payment History</span>
                        </li>
                    </ul>
                    <div className={styles.sidebarUser} onClick={handleToLogOut}>
                        <img src="/user.png" alt="User Avatar" className={styles.avatar} />
                        <div className={styles.username}>ADMIN</div>
                    </div>
                </div>

                <div className={styles.mainBox}>
                    <div className={styles.title}>ADD PRODUCTS</div>
                    <div className={styles.contentBox}>
                        <form className={styles.form__updateProduct}>
                            <div className={styles.inforBox}>
                                <div className={styles.field}>
                                    <input type="text" name="name" placeholder="Name product" onChange={handleChange} autoComplete="off" />
                                </div>
                                <div className={styles.field}>
                                    <input type="text" name="startingPrice" placeholder="Starting price" onChange={handleChange} autoComplete="off" />
                                </div>
                                <div className={styles.field}>
                                    <input type="datetime-local" name="auctionTime" onChange={handleChange} autoComplete="off" />
                                </div>
                                <div className={styles.cateField}>
                                    <label htmlFor="category">Category:</label>
                                    <select className={styles.cateSelect} name="category" onChange={handleChange}>
                                        <option value="" disabled selected>All</option>
                                        <option value="tui xach">Bag</option>
                                        <option value="dong ho">Watch</option>
                                        <option value="do co">Antique</option>
                                        <option value="giay">Sneakers</option>
                                    </select>
                                </div>
                            </div>
                        </form>

                        <div className={styles.imageBox}>
                            <div className={styles.imgArea}>
                                {prevFiles.length > 0 ? (
                                    prevFiles.map((img, index) => (
                                        <div key={index} className={styles.previewImg}>
                                            <img src={img.preview} alt={`Preview ${index + 1}`} />
                                        </div>
                                    ))
                                ) : (
                                    <label className={styles.fileUpload}>+
                                        <input className={styles.uploadImg} type="file" multiple id="fileInput" onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>
                            <div className={styles.refreBtn} onClick={handleRefresh}>Refresh</div>
                        </div>
                    </div>

                    <div className={styles.btn}>
                        <div className={styles.cancelBtn} onClick={handleCancel}>Cancel</div>
                        <div className={styles.uploadBtn} onClick={handleShowModal}>Add</div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className={styles.notificationAlert}>
                    <div className={styles.notification}>
                        <p>Are you sure you want to add the product?</p>
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

export default AddProduct;