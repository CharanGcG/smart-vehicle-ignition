import styles from "../styles/Footer.module.css";
import VERSION from "../version";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/home";
  return (
    <footer className={styles.footer}>
      <div className={styles.line}></div>
      <p className={styles.text}>Version {VERSION} | Created by <strong>Charan G</strong> | © 2025</p>
      <p className={styles.tagline}>🔐 Your face is the key to ignition</p>
      <p className={styles.extra}>Built with AI for secure mobility</p>
      {!isHomePage && <button className={styles.button} onClick={()=>navigate("/about")}>About Us</button>}
    </footer>
  );
};

export default Footer;
