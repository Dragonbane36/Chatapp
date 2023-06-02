import { useState } from 'react';
import { Link } from "react-router-dom";
import { auth } from '../Firebase'; // Import the 'auth' object from your Firebase configuration
import { sendPasswordResetEmail } from 'firebase/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const actionCodeSettings = {
        url: 'http://localhost:3000/reset-password', // The URL where the user will be redirected after resetting the password
        handleCodeInApp: true, // Allow handling the reset code in the app instead of the URL
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings); // Pass 'auth' as the first argument
      setSuccessMessage('Password reset email sent successfully');
      setEmail('');
    } catch (error) {
      console.log(error)
      setErrorMessage('Failed to send password reset email');
    }
  };

  return (
    <div className='formContainer'>
      <div className="formWrapper">
        <span className="logo">OnlyFriends</span>
        <span className="title">Forgot Password</span>
        {successMessage && <div className="success">{successMessage}</div>}
        {errorMessage && <div className="error">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <button type="submit">Reset Password</button>
        </form>

        <p>Don't Have an Account? <Link to="/Registration">Register</Link></p>
        <p>Already have an account? <Link to="/Login">Login</Link></p>
      </div>
    </div>
  );
}

export default ForgotPassword;
