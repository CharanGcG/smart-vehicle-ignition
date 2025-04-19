import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "../styles/GuestPage.module.css";
import RightVisual from "../components/RightVisual";
import toast from 'react-hot-toast';
import Footer from "../components/Footer";


function LoginForm({ setUserId, setRegisteredImage }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("user_id", email);
      setLoading(true);
      const response = await axios.post("http://localhost:8000/login/", formData);

      if (response.data && response.data.base64_image) {
        setUserId(email);
        setRegisteredImage(response.data.base64_image);
        localStorage.setItem("userId", response.data.user_id); // Store userId for later use
        localStorage.setItem("regImage", response.data.base64_image);
        toast.success("Login successful!");
        navigate("/home"); // Redirect to home page after successful login
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.detail;
      if (status === 404) {
        toast.error(message);
      } else {
        toast.error(message);
      }
    } finally{
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
    <div className={styles.container}>
      <div className={styles.leftPane}>
      <Header/>
      <h2 className={styles.subHeading}>Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <div className={styles.buttons}>
        <button type="submit" disabled = {!email || loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
        <button onClick={()=>navigate("/register")}>Go To Register Page</button>
        </div>

      </form>
      
      </div>


      <div className={styles.rightPane}>
        <RightVisual/>
      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default LoginForm;
