import React, { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import{storage} from "../Firebase"
import {Portrait} from '@mui/icons-material';
import {uploadBytes, getDownloadURL,ref} from "firebase/storage";
import { updateEmail, updatePassword, updateProfile, deleteUser } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const { currentUser } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(currentUser.displayName || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [password, setPassword] = useState('');
  const [photoURL, setPhotoURL] = useState(currentUser.photoURL || '');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleUpdateDisplayName = async () => {
    try {
      await updateProfile(currentUser, { displayName });
      toast.success('Display name updated successfully!');
    } catch (error) {
      toast.error('Error updating display name');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
        toast.success('Email updated successfully!');
      } else {
        toast.info('Email is the same. No update needed.');
      }
    } catch (error) {
      toast.error('Error updating email');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (password) {
        await updatePassword(currentUser, password);
        toast.success('Password updated successfully!');
      } else {
        toast.info('Password field is empty. No update needed.');
      }
    } catch (error) {
      toast.error('Error updating password');
    }
  };

  const handleUpdatePhoto = async () => {
    try {
      if (selectedPhoto) {
        const storageRef = ref(storage, `profile_photos/${currentUser.uid}`);
        const photoSnapshot = await uploadBytes(storageRef, selectedPhoto);
        const photoURL = await getDownloadURL(photoSnapshot.ref);

        await updateProfile(currentUser, { photoURL });
        toast.success('Photo updated successfully!');
      } else {
        toast.info('No photo selected. No update needed.');
      }
    } catch (error) {
      toast.error('Error updating photo');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (confirmDelete) {
      try {
        await deleteUser(currentUser);
        toast.success('Account deleted successfully!');
        // Redirect or perform any other necessary action after account deletion
      } catch (error) {
        toast.error('Error deleting account');
      }
    }
  };

  const handlePhotoSelection = (event) => {
    const file = event.target.files[0];
    setSelectedPhoto(file);
  };

  return (
    <div className="profileContainer">
      <div className="container">
        <div className="profilePicture">
          <img src={photoURL || currentUser.photoURL} alt="404" />
        </div>
        <div className="profileUser">
          <h2>{currentUser.displayName}</h2>
          <h3>{currentUser.email}</h3>
        </div>
        <form>
          <input
            type="text"
            placeholder="Username"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <button onClick={handleUpdateDisplayName}>Update Display Name</button>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleUpdateEmail}>Update Email</button>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleUpdatePassword}>Update Password</button>

          <input style={{ display: "none" }} type="file" accept="image/*" onChange={handlePhotoSelection} />
          <label htmlFor="file">
            <Portrait/>
            <span>Add an avatar</span>
          </label>
          <button onClick={handleUpdatePhoto}>Update Photo</button>

          <button onClick={handleDeleteAccount}>Delete Account</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
