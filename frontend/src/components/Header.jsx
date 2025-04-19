import AI from "../assets/AI.jpg";
import styles from "../styles/Header.module.css";
import VERSION from "../version";

const Header = ()=>{
    
    return (
        <div className={styles.header}>
            <img src={AI} alt="Logo" className={styles.logo} />
            <h1 className={styles.title} >SMART VEHICLE IGNITION</h1>
            <p className={styles.version}>v{VERSION}</p>
        </div>
    )
};


export default Header;