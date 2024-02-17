import React, { useEffect, useState } from "react";
import useUserContext from "../../../hooks/useUserContext";

const Welcome = () => {
  //=================== STATES =======================//
  const [helloMessage, setHelloMessage] = useState("");
  const { user } = useUserContext();

  useEffect(() => {
    const displayHello = () => {
      const dateObj = new Date();
      const hour = dateObj.getHours();
      if (hour >= 5 && hour <= 12) {
        setHelloMessage("Good Morning");
      } else if (hour >= 13 && hour <= 17) {
        setHelloMessage("Good Afternoon");
      } else if (hour >= 18 && hour <= 21) {
        setHelloMessage("Good Evening");
      } else {
        setHelloMessage("Good Night");
      }
      setTimeout(() => {
        displayHello();
      }, "1800000"); //all half hour
    };
    displayHello();
  }, [setHelloMessage]);

  return (
    user.id && (
      <section className="welcome-section">
        <h2>New Life Fertility Center</h2> {/* To customize for each clinic */}
        <div>
          {helloMessage}
          {", "}
          {user.full_name}
        </div>
      </section>
    )
  );
};

export default Welcome;
