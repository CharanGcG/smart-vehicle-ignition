import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import RightVisual from "../components/RightVisual";
import styles from "../styles/GuestPage.module.css";
import Footer from "../components/Footer";

const GuestPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.pageWrapper}>
        <div className={styles.container}>
            <div className={styles.leftPane}>
                <Header />
                <div className={styles.content}>
                    <h1 className={styles.heading}>
                        AI Powered<br />Vehicle Ignition
                    </h1>
                    <p className={styles.subtext}>Start your vehicle without a physical key!</p>
                    <div className={styles.buttons}>
                        <button onClick={() => navigate("/login")}>Login</button>
                        <button onClick={() => navigate("/register")}>Signup</button>
                    </div>
                </div>
            </div>
            <div className={styles.rightPane}>
                <RightVisual />
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default GuestPage;
