import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <CircularProgress size={60} />
    </div>
  );
};

export default LoadingScreen;