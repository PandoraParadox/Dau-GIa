import { useNavigate } from "react-router-dom";
import styles from "./shoppingCart.module.css"
import { CiDeliveryTruck } from "react-icons/ci";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../../service/AuthService";
import axiosInstance from "../../interceptor";
import { url } from "../../util/Url";

function ShoppingCart() {
    const [cart, setCart] = useState([]);
    const email = localStorage.getItem("email");
    const navigate = useNavigate();
    useEffect(() => {
        axiosInstance.get(url + `users/cart/${email}`)
            .then((res) => {
                setCart(res.data.data);
            })
            .catch((err) => console.log(err))
    }, [])
    console.log(cart)
    return (
        <>
            
            <div className={styles.container}>
                <div className={styles.backgroundCart}>
                    <div className={styles.shoppingCart}>
                        <h1>SHOPPING CART</h1>
                        <div className={styles.cartHeader}>
                            <div>Products</div>
                            <div>Amount</div>
                            <div>Quantity</div>
                        </div>
                        <div className={styles.backgroundProduct}>
                            {
                                cart.map((p) =>
                                    <div className={styles.noProduct} onClick={() => navigate(`/payment/${p.id}`)}>
                                        <div className={styles.cartItem}>
                                            <div className={styles.productInfo}>
                                                <img
                                                    src={`http://localhost:8081/api/v1/products/images/${p.urlResources[0]}`}
                                                    alt="Air Force 1 Low x Louis Vuitton"
                                                />
                                                <p>{p.name}</p>
                                            </div>
                                            <div className={styles.price}>{p.startingPrice}</div>
                                            <div className={styles.quantity}>1</div>

                                        </div>


                                        <div className={styles.shippingFee}>
                                            <div className={styles.icon}>
                                                <CiDeliveryTruck />
                                            </div>
                                            <span>Shipping fee 50.000 VND</span>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default ShoppingCart; 