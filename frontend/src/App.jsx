import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginForm from "./pages/LoginForm";
import HomePage from "./pages/HomePage";
import RegisterUserForm from "./pages/RegisterUserForm";
import GuestPage from "./pages/GuestPage";
import AboutPage from "./pages/AboutPage";

const App = () => {
  // Use state to manage userId and registeredImage
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [registeredImage, setRegisteredImage] = useState(null);

  // Use effect to manage state on reload
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setUserId(savedUserId);
    }
  }, []);

  return (
    <BrowserRouter>
    <Toaster toastOptions={{
    style: {
      fontSize: '15px',
      textAlign: 'center',
    },
  }} />
      <Routes>
        <Route path="/" element={<GuestPage/>} />
        <Route path="/login" element={<LoginForm setUserId={setUserId} setRegisteredImage={setRegisteredImage} />} />
        <Route path="/register" element={<RegisterUserForm />} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/home" element={userId ? (<HomePage userId={userId} registeredImage={registeredImage} />) : (
            <Navigate to="/login" replace />)}/>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
