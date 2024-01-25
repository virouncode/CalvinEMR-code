import React, { useEffect } from "react";
import logo from "../../../assets/img/logoRectTest.png";

const ConfirmDialog = ({ title, content, onConfirm, onCancel, isPopUp }) => {
  const positionY = isPopUp
    ? window.innerHeight / 2 - 70
    : window.innerHeight / 2 + window.scrollY;

  useEffect(() => {
    const handleKeyboardShortcut = (e) => {
      if (e.keyCode === 13) {
        onConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => window.removeEventListener("keydown", handleKeyboardShortcut);
  }, [onConfirm]);
  return (
    <>
      <div
        style={{ height: `${document.body.clientHeight}px` }}
        className="confirm-container"
      >
        <div style={{ top: `${positionY}px` }} className="confirm-dialog">
          <div className="confirm-dialog-header">
            <div className="confirm-dialog-header-logo">
              <img src={logo} alt="calvin-EMR-logo" />
            </div>
            <h2 style={{ fontSize: "1rem" }}>{title ?? "Confirmation"}</h2>
          </div>
          <p style={{ fontSize: "0.85rem", padding: "10px", margin: "0" }}>
            {content ?? "Do you really want to do this action ?"}
          </p>
          <p className="confirm-dialog-btn-container">
            <button type="button" onClick={onConfirm}>
              Yes
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
