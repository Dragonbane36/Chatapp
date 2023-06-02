import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../Firebase";
import { Google, Facebook, Twitter, Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const [err, setErr] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  const handleTwitterSignIn = async () => {
    const provider = new TwitterAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">OnlyFriends</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" />
          <div className="passwordInput">
            <input type={passwordVisible ? "text" : "password"} placeholder="Password" />
            {passwordVisible ? (
              <Visibility onClick={togglePasswordVisibility} />
            ) : (
              <VisibilityOff onClick={togglePasswordVisibility} />
            )}
          </div>
          <button>Login</button>
          {err && <span>Incorrect Username or Password</span>}
        </form>

        <div className="separator">
          <span className="separator-text">or</span>
        </div>

        <div className="social">
          <button onClick={handleGoogleSignIn}><Google />Google</button>
          <button onClick={handleFacebookSignIn}><Facebook />Facebook</button>
          <button onClick={handleTwitterSignIn}><Twitter />Twitter</button>
        </div>

        <p>Don't Have an Account? <Link to="/Registration">Register</Link></p>
        <p>Forgot Password? <Link to="/ForgotPassword">Password Recovery</Link></p>

      </div>
    </div>
  );
};

export default Login;
