import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import {
  AuthErrorCodes,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import "./ForgetPassword.scss";
import quiz from "../../images/quiz-logo.png";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Tune } from "@mui/icons-material";
import { ClipLoader } from "react-spinners";
const ForgetPassword = () => {
  const [resetEmail, setResetEmail] = useState("");

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, resetEmail);

      toast.success("Password reset email sent");
      setResetEmail(""); // Clear the email input field
      navigate("/login");
    } catch (error) {
      console.log("Error in sending password reset email:", error);
      toast.error("Error in sending password reset email:", error);
    }
  };

  return (
    <div className="container">
      <div className="left-side">
        <div className="content">
          <h1>Forget Password</h1>
        </div>
        <div className="image">
          <img src={quiz} alt="" style={{ height: "380px", width: "400px" }} />
        </div>
      </div>
      <div className="right-side">
        <div className="inner-content">
          <div className="already"></div>
          <div className="inner-content-2">
            <h3 style={{marginBottom:"50px"}}>Forget Password</h3>
          
          </div>
          <div className="form">
            <form action="">
              {/* <div className="form_line"></div> */}
            </form>
            <label htmlFor="">Enter Email for Password Reset</label>
            <input
              type="email"
              required
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button className="btn" onClick={handleForgotPassword}>
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
