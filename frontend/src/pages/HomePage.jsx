import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import car from "../assets/Car.jpg";
import styles from "../styles/HomePage.module.css";
import Footer from "../components/Footer";

function HomePage() {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState("Time To DRIVE");
  const [vehicleState, setVehicleState] = useState("LOCKED");
  const [comparingFaces, setComparingFaces] = useState(false);
  const [stoppingVehicle, setStoppingVehicle] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);


  const [registeredImage, setRegisteredImage] = useState(() => {
    return localStorage.getItem("regImage") || "";
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || "";
  });
  

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);
  


  useEffect(() => {
    // On mount, restore cooldown from localStorage if it exists and is valid
    if (!cooldownUntil) {
      const savedCooldown = localStorage.getItem("cooldownUntil");
      if (savedCooldown) {
        const parsedCooldown = parseInt(savedCooldown, 10);
        if (!isNaN(parsedCooldown) && parsedCooldown > Date.now()) {
          setCooldownUntil(parsedCooldown);
        } else {
          localStorage.removeItem("cooldownUntil");
        }
      }
    }
  
    let interval = null;
  
    if (cooldownUntil) {
      interval = setInterval(() => {
        const secondsLeft = Math.ceil((cooldownUntil - Date.now()) / 1000);
        if (secondsLeft <= 0) {
          setCooldownUntil(null);
          setCooldownRemaining(0);
          setResponseMessage("Cooldown ended. You can try again.");
          setVehicleState("LOCKED");
          localStorage.removeItem("cooldownUntil");
          clearInterval(interval);
        } else {
          setCooldownRemaining(secondsLeft);
        }
      }, 1000);
    }
  
    return () => clearInterval(interval);
  }, [cooldownUntil]);
  
  
  
  

  const captureAndRecognize = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return toast.error("Failed to capture image");

    setCapturedImage(imageSrc);
    setComparingFaces(true);

    try {
      const response = await axios.post("http://localhost:8000/capture-and-recognize/", {
        user_id: userId,
        captured_image_base64: imageSrc,
        registered_image_base64: registeredImage,
      });

      if(response.data.message){
        setResponseMessage(response.data.message)
      }
      if(response.data.vehicle_state){
        setVehicleState(response.data.vehicle_state);
      }

      if (response.data.success) {
        toast.success(response.data.message || "Face matched!");
      } else if (response.data.cooldown) {
        toast.error(response.data.message || "Cooldown in effect");
        if (response.data.cooldown_seconds) {
          const cooldownEndTime = Date.now() + response.data.cooldown_seconds * 1000;
          setCooldownUntil(cooldownEndTime);
          setCooldownRemaining(response.data.cooldown_seconds);
          localStorage.setItem("cooldownUntil", cooldownEndTime);
        }
      } else {
        toast.error(response.data.message || "Face not matched");
      }

    } catch (err) {
      toast.error("Recognition failed.");
      console.error(err);
    } finally{
      setComparingFaces(false);
    }
  };

  const stopVehicle = async () => {
    setStoppingVehicle(true);
    try {
      const response = await axios.post("http://localhost:8000/stop-vehicle/");
      setResponseMessage(response.data.message);
      setVehicleState("LOCKED");
      toast.success("Vehicle stopped.");
    } catch (err) {
      toast.error("Failed to stop vehicle.");
    } finally {
      setStoppingVehicle(false);
    }
  };

  return (
    <div>
    <div className={styles.container}>
      <Header />
      <span>USER ID: <input type="text" value={userId} readOnly className={styles.userId} /></span>
      <button
      className={styles.logoutButton}
      onClick={() => {
      localStorage.removeItem("userId");
      localStorage.removeItem("regImage");
      localStorage.removeItem("cooldownUntil");
      toast.success("Logged out successfully!");
      navigate("/login");
      //window.location.reload(); // optional: refresh to clear state across app
      
     }}
    >
      Logout
      </button>


      <div className={styles.mainContent}>
        <div className={styles.leftPanel}>
          <div className={styles.videoWrapper}>
            <div className={styles.videoBox}>
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className={styles.webcam} />
              
            </div>
            <div className={styles.imageBox}>
              {registeredImage ? (
                <img
                  src={`data:image/jpeg;base64,${registeredImage}`}
                  alt="Registered"
                  className={styles.image}
                />
              ) : (
                <p>No registered image</p>
              )}
              
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button className={styles.captureButton} onClick={captureAndRecognize} disabled={vehicleState!=="LOCKED" || comparingFaces || cooldownUntil} >{comparingFaces ? "Comparing Faces..." : "Capture image"}</button>
            <button className={styles.stopButton} onClick={stopVehicle} disabled={vehicleState!=="RUNNING" || stoppingVehicle || cooldownUntil} >{stoppingVehicle ? "Stopping Vehicle..." : "Stop Vehicle"}</button>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <img src={car} alt="Car" className={styles.carImage} />
          <div className={styles.statusBox}>
            Vehicle is: <span
                          className={`${styles.state} ${
                          vehicleState === "LOCKED"
                          ? styles.locked
                          : vehicleState === "RUNNING"
                          ? styles.running
                          : styles.cooldown
                        }`}
                        >
                          {vehicleState}
                        </span>
          </div>
          <div className={styles.statusBox}>
            Message: {responseMessage}
          </div>
          {cooldownUntil && (
          <div className={styles.statusBox}>
          Cooldown Active. Try again in {cooldownRemaining} seconds.
          </div>
          )}

        </div>
      </div>

      {capturedImage && (
        <div className={styles.previewBox}>
          <h4>Last Captured Image</h4>
          <img src={capturedImage} alt="Captured" className={styles.image} />
        </div>
      )}
    </div>
    <Footer/>
    </div>
  );
}

export default HomePage;