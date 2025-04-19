import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import styles from "../styles/GuestPage.module.css";
import RightVisual from "../components/RightVisual";
import toast from 'react-hot-toast';
import Footer from "../components/Footer";


const RegisterUserForm = () => {
    const [userId, setUserId] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if(file){
            const validTypes = ["image/jpeg", "image/png", "image/jpg"];
            if(!validTypes.includes(file.type)){
                toast.error("Invalid file type. Please upload an image only (jpg, jpeg, png)");
                setSelectedImage(null);
                e.target.value = null;
                return;
            }
            setSelectedImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !selectedImage) {
            toast.error("Please provide both email and image");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("image", selectedImage);

        try {
            const response = await axios.post("http://localhost:8000/register/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success(response.data.message || "Registration Successful!");
            setUserId("");
            setSelectedImage(null);
            navigate("/login");
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.detail;
            if(status===409){
                toast.error("Email already registered. Please log in");
                console.log(status)
            }else{
                toast.error(message || "An error occured, Please try again");
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
        <div className={styles.container}>
            <div className={styles.leftPane}>
            <Header/>
            <h2 className={styles.subHeading}>Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <br></br>
                <label htmlFor="photoUpload" className={styles.uploadLabel}>
                    📷 Upload Your Photo
                </label>
                <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className={styles.hiddenInput}
                    required
                />
                {selectedImage && (
                    <p className={styles.fileName}>Selected: {selectedImage.name}</p>
                )}
                {!selectedImage && (
                    <p className={styles.fileName}>No image selected: Image is required</p>
                )}
                <div className={styles.buttons}>
                <button
                    type="submit"
                    disabled={loading || !userId || !selectedImage} 
                >
                    {loading ? "Registering..." : "Register"}
                </button>
                <button onClick={()=> navigate("/login")} >Go To Login Page</button>
                </div>

            </form>

            {message && <p>{message}</p>}
            </div>



            <div className={styles.rightPane}>
                <RightVisual/>
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default RegisterUserForm;
