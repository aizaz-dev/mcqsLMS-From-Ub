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

import "./Signup.scss";
import quiz from "../../images/quiz-logo.png";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Tune } from "@mui/icons-material";
import { ClipLoader } from "react-spinners";
const Signup = () => {
  const options = ["Student", "Teacher"];
  const [role, setRole] = useState("Student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const Submithandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role,
        loginCount: 1,
        id: user.uid,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      if (role === "Student") {
        await setDoc(doc(db, "student", user.uid), {
          name,
          email,
          role,
          loginCount: 1,
          id: user.uid,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      if (role === "Teacher") {
        await setDoc(doc(db, "teacher", user.uid), {
          name,
          email,
          role,
          loginCount: 1,
          id: user.uid,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      toast.success("Welcome user created successfully");
      // Store data in local storage
      const userData = {
        name,
        email,
        role,
        loginCount: 1,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate(`/`);
      window.location.reload(true);
      setLoading(false);
    } catch (error) {
      console.log("Error in creating user:", error);
      toast.error("Error in creating user:", error);
    }
  };
  const handleGoogleSignUp = async () => {
    try {
      // Create an instance of the Google provider
      const provider = new GoogleAuthProvider();

      // Sign up with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);
      // Perform additional operations or save user data as needed
      // ...
      const userData = {
        name: user.displayName,
        email: user.email,
        role,
        loginCount: 1,
        id: user.uid,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", user.uid), userData);
      // Redirect or perform any necessary actions after successful sign-up
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/");
    } catch (error) {
      console.log("Error in signing up with Google:", error);
      toast.error("Error in signing up with Google:", error);
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, resetEmail);

      toast.success("Password reset email sent");
      setResetEmail(""); // Clear the email input field
    } catch (error) {
      console.log("Error in sending password reset email:", error);
      toast.error("Error in sending password reset email:", error);
    }
  };

  return (
    <div className="container">
      <div className="left-side">
        <div className="content">
          <h1>Sign Up</h1>
        </div>
        <div className="image">
          <img src={quiz} alt="" style={{ height: "380px", width: "400px" }} />
        </div>
      </div>
      <div className="right-side">
        <div className="inner-content">
          <div className="already">
            <p>Already have an account?</p>
            <Link to={"/login"}>
              {" "}
              <button>Login</button>
            </Link>
          </div>
          <div className="inner-content-2">
            <h3>Welcome to QuizKarooo</h3>
            <p>Register your account</p>
          </div>
          <div className="form">
            <form action="" onSubmit={Submithandler}>
              <label htmlFor="">Enter name</label>
              <input
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="">Choose Your Role ?</label>
              <select
                defaultValue={"Student"}
                onChange={(e) => setRole(e.target.value)}
                className="signup_select"
              >
                <option value={"Student"}>Student</option>
                <option value={"Teacher"}>Teacher</option>
              </select>
              <label htmlFor="">Enter Email</label>
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="">Enter Password</label>
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn">
                {loading ? <ClipLoader color="#36d7b7" size={15} /> : "Sign Up"}{" "}
              </button>
              <div className="form_line"></div>
              <button className="btn_google" onClick={handleGoogleSignUp}>
                <FcGoogle size={28} /> Sign Up with Google
              </button>
              <button
                className="btn_forget"
                onClick={() => navigate("/forgetpassword")}
              >
                Forget Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
