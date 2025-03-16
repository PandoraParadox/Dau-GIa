import React, { useState } from "react";
import { IoIosAddCircle, IoIosCall, IoIosCart } from "react-icons/io";
import { IoCart } from "react-icons/io5";
import { FaWallet } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { RiDeleteBin2Fill } from "react-icons/ri";
import "./default.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from './../component/Login/index';
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
function Header({ setFilter, setSearch }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [category, setCategory] = useState("");
    const [type, setType] = useState(null);
    const [activeButton, setActiveButton] = useState(null);

    const handleClickCategory = (e) => {
        const value = e.target.value;
        console.log(setFilter);
        setFilter({
            category: value,
            type,
            sort: activeButton == null ? "" : activeButton
        })
        setCategory(value);

    }
    const handleClickType = (e) => {
        const value = e.target.value;
        setFilter({
            category,
            type: value == "" ? null : value,
            sort: activeButton == null ? "" : activeButton
        })
        setType(value);
    }


    const handleFilterClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    }


    const handleButtonClick = (index) => {
        if (index == 0) {
            setFilter({
                category,
                type,
                sort: "asc"
            })
        }
        else if (index == 1) {
            setFilter({
                category,
                type,
                sort: "desc"
            })
        }

        else {
            setFilter({
                category: "",
                type: null,
                sort: ""
            })
            handleFilterClick();
        }

        setActiveButton(prevIndex => (prevIndex === index ? null : index));
    };
    const handleAccount = () => {
        setIsAccountOpen(!isAccountOpen);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePaymentClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }




    return (
        <>

            <div className="header">
                <div className="header__above">
                    <div className="above__content">
                        <ul>
                            <NavLink to="/help-contact">
                                <li>
                                    <div className="above__phone above__default"><IoIosCall style={{ color: "black" }} /></div>
                                </li>
                            </NavLink>
                            <NavLink to="/shopping-cart">
                                <li>
                                    <div className="above__cart above__default">
                                        <IoIosCart style={{ color: "black" }} />
                                    </div>
                                </li>
                            </NavLink>
                            <li>
                                <div
                                    className="above__payment above__default"
                                    style={{ color: "black" }}
                                    onClick={handlePaymentClick}
                                >
                                    <FaWallet style={{ color: "black" }} />
                                    12$
                                </div>
                            </li>

                            <li>
                                <div onClick={handleAccount} onc className="above__image above__default" >
                                    <img src={process.env.PUBLIC_URL + "/user.png"} alt="Logo" />
                                    {isAccountOpen ? (
                                        <div className="above__image--add">
                                            <Link to="/my-profile" style={{ color: "black" }}>
                                                <div className="add__button">
                                                    <div className="add__button--circle"><FaUser /></div>
                                                    <p className="add__button--title">Trang cá nhân</p>
                                                </div>
                                            </Link>
                                            <Link to="/transaction-history/1" style={{ color: "black" }}>
                                                <div className="add__button">
                                                    <div className="add__button--circle"><MdAttachMoney /></div>
                                                    <p className="add__button--title">Lịch sử giao dịch</p>
                                                </div>
                                            </Link>
                                            <div onClick={handleLogout} className="add__button">
                                                <div className="add__button--circle">
                                                    <IoLogOut />
                                                </div>
                                                <p className="add__button--title">Đăng xuất</p>
                                            </div>
                                        </div>
                                    ) : ""}

                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="header__below">
                    <div className="below__content">
                        <Link to="/home">
                            <div className="below__image">
                                <img src={process.env.PUBLIC_URL + "/Logo.jpg"} alt="Logo" />
                            </div>
                        </Link>
                        <div className="below__search">
                            <div className="below__magnifying"><FaMagnifyingGlass /></div>
                            <input onChange={handleSearch} placeholder="Tìm kiếm" />
                            <div className="below__filter" onClick={handleFilterClick}>
                                <FaFilter /> Filter
                            </div>
                            {isDropdownOpen && (
                                <div className="dropdown-list">
                                    <div className="dropdown-list__left">
                                        <p>Phân loại</p>
                                        <select onChange={handleClickCategory} value={category} >
                                            <option value="">Tất cả</option>
                                            <option value="Dong ho">Đồng hồ</option>
                                            <option value="Tui xach">Túi xách</option>
                                            <option value="Giay">Giày</option>
                                            <option value="Do co">Đồ cổ</option>
                                        </select>
                                    </div>
                                    <div className="dropdown-list__center">
                                        <p>Loại hàng</p>
                                        <select onChange={handleClickType} value={type}>
                                            <option value="">Tất cả</option>
                                            <option value="AUCTION_PRODUCT">Hàng đấu giá</option>
                                            <option value="INVENTORY">Hàng tồn kho</option>

                                        </select>
                                    </div>
                                    <div className="dropdown-list__right">
                                        <button
                                            className={`dropdown-list__img ${activeButton === 0 ? "active" : ""}`}
                                            onClick={() => handleButtonClick(0)}
                                        >
                                            <HiSortAscending />
                                        </button>

                                        <button
                                            className={`dropdown-list__img ${activeButton === 1 ? "active" : ""}`}
                                            onClick={() => handleButtonClick(1)}
                                        >
                                            <HiSortDescending />
                                        </button>

                                        <button
                                            className={`dropdown-list__img ${activeButton === 2 ? "active" : ""}`}
                                            onClick={() => handleButtonClick(2)}
                                        >
                                            <RiDeleteBin2Fill />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="s"></div>
                    </div>
                </div>
            </div>
            {/* Modal QR */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>Quét mã QR để nạp tiền</h2>
                        <img src={process.env.PUBLIC_URL + "/qr.png"} alt="QR Code" className="qr-image" />
                    </div>
                </div>
            )}
        </>

    );
}

export default Header;
