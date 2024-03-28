import React from "react";

const TriangleClinicalButton = ({
  handleTriangleClick,
  className,
  color,
  triangleRef = null,
}) => {
  return (
    <i
      className={`fa-sharp fa-solid fa-play fa-xs fa-rotate-180 ${className}`}
      style={{ color: { color } }}
      onClick={handleTriangleClick}
      ref={triangleRef}
    />
  );
};

export default TriangleClinicalButton;
