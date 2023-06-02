import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Registration = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const firstname = e.target[0].value;
    const lastname = e.target[1].value;
    const displayName = e.target[2].value;
    const email = e.target[3].value;
    const password = e.target[4].value;
    const confirmPassword = e.target[5].value;
    const file = e.target[6].files[0];

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `/image/${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            // Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            // Create user on Firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              firstname,
              lastname,
              displayName,
              email,
              photoURL: downloadURL,
            });

            // Create empty user chats on Firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});

            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">OnlyFriends</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="First name" />
          <input required type="text" placeholder="Last name" />
          <input required type="text" placeholder="Display name" />
          <input
            required
            type="email"
            placeholder="Email"
            onChange={() => setEmailError("")}
          />
          {emailError && <span className="error">{emailError}</span>}
          <input
            required
            type="password"
            placeholder="Password"
            onChange={() => setPasswordError("")}
          />
          {passwordError && <span className="error">{passwordError}</span>}
          <input
            required
            type="password"
            placeholder="Confirm Password"
            onChange={() => setPasswordError("")}
          />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          
          <div className="Terms">
            <input
              type="checkbox"
              id="terms"
              required
            />
            <label htmlFor="terms">
              I agree to the terms of license and agreement.
            </label>
          </div>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image, please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          Already have an account? <Link to="/Login">Login</Link>
        </p>
        <p>Forgot Password? <Link to="/ForgotPassword">Password Recovery</Link></p>
      </div>
    </div>
  );
};

export default Registration;




