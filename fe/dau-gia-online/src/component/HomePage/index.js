import { Link, useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import Header from "../../default/Header";
import styles from "./homePage.module.css";
import { useEffect, useState } from "react";
import axiosInstance from "../../interceptor";
import { url } from './../../util/Url';
import { formatCurrency } from "../../util/format";
import { compareTime, convertDateTime } from "../../util/formatDate";
import { format, addMinutes, isBefore, isAfter, isWithinInterval, addSeconds } from "date-fns";
import { eventEmitter } from "../../util/eventMitter";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from "../../context/AuthContext";
function HomePage() {
    const size = 12;
    const navigate = useNavigate();
    const [totalPage, setTotalPage] = useState(0);
    const [products, setProducts] = useState([]);
    const [checkDate, setCheckDate] = useState();
    const { filter, search } = useOutletContext();
    const { login } = useAuth();
    var { category, type, sort } = filter;
    sort = sort ?? "";
    category = category ?? "";
    const [currentPage, setCurrentPage] = useState(1);




    const startPage = Math.max(1, Math.min(currentPage - 2, totalPage - 4));
    const endPage = Math.min(totalPage, startPage + 4);


    const handlePageClick = (page) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    };

    // Xác định trạng thái đấu giá
    const getAuctionStatus = (auctionTime) => {
        const auctionStartTime = new Date(auctionTime);
        const auctionEndTime = addSeconds(auctionStartTime, 90);
        const now = new Date();

        if (isBefore(now, auctionStartTime)) {
            return ` ${format(auctionStartTime, 'HH:mm dd/MM/yyyy')}`;
        } else if (isWithinInterval(now, { start: auctionStartTime, end: auctionEndTime })) {
            return "Auctioning...";
        } else {
            return "Auction Ended !";
        }
    }
    const handleAuctioning = (time) => {

    }

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    useEffect(() => {
        if (search) {
            axiosInstance.get(`products/by-search?page=${currentPage}&size=${size}&search=${search}`)
                .then((res) => {
                    setProducts(res.data.data.items);
                    setTotalPage(res.data.data.totalPages);
                })
                .catch((err) => console.log(err));
        } else {
            const filterUrl = type == null
                ? `products/by-filter?page=${currentPage}&size=${size}&sort=${sort}&category=${category}`
                : `products/by-filter?page=${currentPage}&size=${size}&sort=${sort}&category=${category}&type=${type}`;

            axiosInstance.get(filterUrl)
                .then((res) => {
                    setProducts(res.data.data.items);
                    setTotalPage(res.data.data.totalPages);
                })
                .catch((err) => console.log(err));
        }
    }, [currentPage, sort, type, category, search]);

    return (
        <>
            <div className={styles.ui}>
                <div className={styles.headerBox}>
                    <Slider {...sliderSettings}>
                        <div>
                            <img src="/slider1.jpg" alt="Hình 1" />
                        </div>
                        <div>
                            <img src="/slider2.jpg" alt="Hình 2" />
                        </div>
                        <div>
                            <img src="/slider3.jpg" alt="Hình 3" />
                        </div>
                        <div>
                            <img src="/slider4.jpg" alt="Hình 4" />
                        </div>
                    </Slider>
                </div>

                <div className={styles.cateBox}>
                    <div className={styles.cateTitle}>Explore Popular Categories</div>
                    <div className={styles.catePro}>
                        <div className={styles.cate1 + " " + styles.rt}>
                            <div className={styles.image1 + " " + styles.cateImg}><img src={process.env.PUBLIC_URL + "/watch.png"} alt="" /></div>
                            <div className={styles.name}>Watch</div>
                        </div>
                        <div className={styles.cate2 + " " + styles.rt}>
                            <div className={styles.image2 + " " + styles.cateImg}><img src={process.env.PUBLIC_URL + "/bag.png"} alt="" /></div>
                            <div className={styles.name}>Bag</div>
                        </div>
                        <div className={styles.cate3 + " " + styles.rt}>
                            <div className={styles.image3 + " " + styles.cateImg}><img src={process.env.PUBLIC_URL + "/sneakers.png"} alt="" /></div>
                            <div className={styles.name}>Sneakers</div>
                        </div>
                        <div className={styles.cate4 + " " + styles.rt}>
                            <div className={styles.image4 + " " + styles.cateImg}><img src={process.env.PUBLIC_URL + "/antique.png"} alt="" /></div>
                            <div className={styles.name}>Antique</div>
                        </div>
                    </div>
                </div>
                <div className={styles.aucBox}>
                    <div className={styles.aucTitle}>Auction today</div>
                    <div className={styles.product}>
                        {products.map((p) =>
                            <div className={styles.product2 + " " + styles.proSe} onClick={() => navigate(`/detail-product/${p.id}`)}>
                                <div className={styles.proImg}>
                                    <img src={`http://localhost:8081/api/v1/products/images/${p.urlResources[0]}`} alt="" />
                                </div>
                                <div className={styles.proName}>{p.name}</div>
                                <div className={styles.proPrice}>{formatCurrency(p.startingPrice)}VND</div>
                                <div className={styles.time}>{getAuctionStatus(p.auctionTime)}</div>
                            </div>
                        )}
                    </div>
                    <div className={styles.listPage}>
                        <div
                            className={`${styles.start} ${styles.list} ${currentPage === 1 ? styles.disabled : ""}`}
                            onClick={() => handlePageClick(currentPage - 1)}
                        >
                            {"<"}
                        </div>

                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                            <div
                                key={page}
                                className={`${styles.number} ${styles.list} ${currentPage === page ? styles.active : ""}`}
                                onClick={() => handlePageClick(page)}
                            >
                                {page}
                            </div>
                        ))}

                        <div
                            className={`${styles.end} ${styles.list} ${currentPage === totalPage ? styles.disabled : ""}`}
                            onClick={() => handlePageClick(currentPage + 1)}
                        >
                            {">"}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
