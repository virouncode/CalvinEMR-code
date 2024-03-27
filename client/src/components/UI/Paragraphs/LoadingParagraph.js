import { CircularProgress } from "@mui/material";
import React from "react";

const LoadingParagraph = () => {
  return (
    <p style={{ textAlign: "center", fontWeight: "bold" }}>
      Loading...
      <CircularProgress size="0.8rem" />
    </p>
  );
};

export default LoadingParagraph;
