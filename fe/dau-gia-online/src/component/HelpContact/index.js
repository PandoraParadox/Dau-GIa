import styles from "./helpContact.module.css"
import { IoSearch } from "react-icons/io5";
import { BiLike, BiDislike } from "react-icons/bi";

function HelpContact() {
    return (
        <>
            <div className={styles.mb}>
                <div className={styles.title}>Help & Contact</div>
                <div className={styles.mainBox}>
                    <div className={styles.box1}>
                        <div className={styles.ques1}>HOW CAN WE HELP YOU TODAY?</div>
                    </div>
                    <div className={styles.box2}>
                        <form action="#" target="_self" method="get"></form>
                        <input type="text" name="search" className={styles.field} autoComplete="off" placeholder="Search aBuy Help..." />
                        <button className={styles.button}><IoSearch /></button>
                    </div>
                    <div className={styles.box3}>
                        <div className={styles.box3Frame}>
                            <div className={styles.helpAcc}>
                                <div className={styles.helpAcc1}>
                                    <div className={styles.text1}>Get help with a hacked account</div>
                                    <div className={styles.text22}>If you think someone is trying to hack your account—or already has—we’ll work with you to secure it. For your protection, we may place a temporary hold on your account.</div>
                                </div>
                                <div className={styles.helpAcc2}>
                                    <div className={styles.text3}>Quick tip</div>
                                    <div className={styles.text2}>If you can’t sign in to your account, contact us at <a href="#">0123456789</a> immediately and we'll help to secure it.</div>
                                </div>
                                <div className={styles.helpAcc2}>
                                    <div className={styles.text3}>Top Takeaway</div>
                                    <div className={styles.text2}>If you believe your account has been hacked, change your password as soon as possible.
                                        If you can’t sign in, contact us immediately and we’ll help you secure your account.</div>
                                </div>
                            </div>
                            <div className={styles.helpItem}>
                                <div className={styles.helpItem1}>
                                    <div className={styles.text1}>Get help with an item that hasn't arrived</div>
                                    <div className={styles.text2}>If the estimated delivery date for your order has passed and your item hasn't arrived, you can let the seller know by reporting that you didn't receive it.</div>
                                </div>
                                <div className={styles.helpItem2}>
                                    <div className={styles.text3}>Quick Tip</div>
                                    <div className={styles.text2}>Once you report that the item has not arrived, you can check the status of your request at any time in your shopping cart or by contacting us on <a href="#">0123456789</a>.</div>
                                </div>
                                <div className={styles.helpItem2}>
                                    <div className={styles.text3}>Tip</div>
                                    <div className={styles.text2}>You won't be able to re-open the request or case once it's closed.</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.hf}>
                            <div className={styles.que2}>Was this article helpful?</div>
                            <div className={styles.icon}><BiLike /></div>
                            <div className={styles.icon}><BiDislike /></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default HelpContact;
