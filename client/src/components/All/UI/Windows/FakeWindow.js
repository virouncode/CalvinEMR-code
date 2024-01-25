import React, { useEffect, useRef, useState } from "react";

const FakeWindow = ({
  children,
  title,
  x,
  y,
  width,
  height,
  color,
  setPopUpVisible,
  closeCross = true,
}) => {
  const isDragging = useRef(false);
  const isResizing = useRef(false);
  const windowRef = useRef(null);
  const [windowPosition, setWindowPosition] = useState({ x, y });
  const [windowSize, setWindowSize] = useState({ width, height });

  useEffect(() => {
    //Faire passer l'element devant
    const elements = document.querySelectorAll(".window");
    let maxZIndex = 0;
    elements.forEach((el) => {
      const zIndex = parseInt(
        window.getComputedStyle(el).getPropertyValue("z-index")
      );
      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });
    windowRef.current.style.zIndex = (maxZIndex + 1).toString();
  }, []);

  // Functions to handle dragging
  const handleMouseDown = (e) => {
    //Faire passer l'element devant
    const elements = document.querySelectorAll(".window");
    let maxZIndex = 0;
    elements.forEach((el) => {
      const zIndex = parseInt(
        window.getComputedStyle(el).getPropertyValue("z-index")
      );
      if (!isNaN(zIndex) && zIndex > maxZIndex) {
        maxZIndex = zIndex;
      }
    });
    windowRef.current.style.zIndex = (maxZIndex + 1).toString();

    isDragging.current = true;
    // Calculate the initial mouse position relative to the window
    const offsetX = e.clientX - windowPosition.x;
    const offsetY = e.clientY - windowPosition.y;

    const handleMouseMove = (e) => {
      if (isDragging.current) {
        document.body.style.userSelect = "none";
        setWindowPosition({
          x: e.clientX - offsetX,
          y:
            e.clientY - offsetY <= 0
              ? 0
              : e.clientY - offsetY >= window.innerHeight - 40
              ? window.innerHeight - 40
              : e.clientY - offsetY,
        });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Functions to handle resizing
  const handleResizeMouseDown = () => {
    isResizing.current = true;
    const handleResizeMouseMove = (e) => {
      if (isResizing.current) {
        // Update window size based on mouse movement
        setWindowSize({
          width: e.clientX - windowPosition.x,
          height: e.clientY - windowPosition.y,
        });
      }
    };

    const handleResizeMouseUp = () => {
      isResizing.current = false;
      window.removeEventListener("mousemove", handleResizeMouseMove);
      window.removeEventListener("mouseup", handleResizeMouseUp);
    };

    window.addEventListener("mousemove", handleResizeMouseMove);
    window.addEventListener("mouseup", handleResizeMouseUp);
  };

  return (
    <div
      ref={windowRef}
      className="window"
      style={{
        position: "fixed",
        left: windowPosition.x,
        top: windowPosition.y,
        width: windowSize.width,
        height: windowSize.height,
      }}
    >
      <div
        className="window-title"
        onMouseDown={handleMouseDown}
        style={{ background: color, width: windowSize.width }}
      >
        <p>{title}</p>
        {closeCross && (
          <p
            onClick={() => {
              setPopUpVisible(false);
            }}
            className="window-title-close"
          >
            X
          </p>
        )}
      </div>
      <div
        className="resize-handle"
        onMouseDown={handleResizeMouseDown}
        style={{ background: color }}
      ></div>
      <div className="window-content">{children}</div>
    </div>
  );
};

export default FakeWindow;
