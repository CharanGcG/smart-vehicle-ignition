import React from 'react';
import { ShieldCheck, Cloud, Cpu, Smile } from 'lucide-react'; // You can swap icons as preferred
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/GuestPage.module.css"; // reuse existing layout styles
import carImage from "../assets/RightSide.jpg"; // Replace with a dedicated about image if available
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
    const navigate = useNavigate();
  return (
    <div className={styles.pageWrapper}>
      <Header />
      <div className={styles.navButtons}>
        <button onClick={() => navigate("/")}>Guest Page</button>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <h1 className={styles.heading}>About Us</h1>
          <span className={styles.subtext}>Unlock your vehicle using your face.</span>

          <section className={styles.content}>
            <h2 className={styles.subHeading}>Who is it for?</h2>
            <p className={styles.subtext}>A resume project built by Charan G to showcase smart, secure, and cloud-integrated systems.</p>
          </section>

          <section className={styles.content}>
            <h2 className={styles.subHeading}>Why this idea?</h2>
            <p className={styles.subtext}>
              Traditional keys can be duplicated or stolen. This system aims to remove that risk with facial recognition for secure vehicle access.
            </p>
          </section>

          <section className={styles.content}>
            <h2 className={styles.subHeading}>Key Features</h2>
            <ul className={styles.subtext}>
              <li><Smile size={20} /> Face Recognition with real-time camera capture</li>
              <li><Cloud size={20} /> Google Cloud Storage for secure image management</li>
              <li><ShieldCheck size={20} /> Emphasis on security and identity protection</li>
              <li><Cpu size={20} /> IoT Integration for smart vehicle control</li>
            </ul>
          </section>

          <section className={styles.content}>
            <h2 className={styles.subHeading}>Coming Soon</h2>
            <ul className={styles.subtext}>
              <li>📵 Spoof detection for enhanced reliability</li>
              <li>💡 Lighting condition adaptation</li>
            </ul>
          </section>

          <section className={styles.content}>
            <p className={styles.subtext}>🚀 Built by <strong>Charan G</strong> for a resume project</p>
            <p className={styles.subtext}>✨ <em>Your face is the key to ignition!</em></p>
          </section>
          

        </div>

        <div className={styles.rightPane}>
          <img src={carImage} alt="Smart Vehicle Visual" style={{ maxWidth: "90%", borderRadius: "1rem" }} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
