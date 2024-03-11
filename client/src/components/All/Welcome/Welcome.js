import React, { useEffect, useState } from "react";
import useAdminsInfosContext from "../../../hooks/useAdminsInfosContext";
import useClinicContext from "../../../hooks/useClinicContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { toWelcomeName } from "../../../utils/toWelcomeName";

const Welcome = ({ title }) => {
  //=================== STATES =======================//
  const [helloMessage, setHelloMessage] = useState("");
  const { user } = useUserContext();
  const { clinic } = useClinicContext();
  const { staffInfos } = useStaffInfosContext();
  const { adminsInfos } = useAdminsInfosContext();

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
        <h2 className="welcome-section__clinic">{clinic.name}</h2>{" "}
        {/* To customize for each clinic */}
        <h2 className="welcome-section__title">{title}</h2>
        <p className="welcome-section__message">
          {helloMessage} {toWelcomeName(user, staffInfos, adminsInfos)}
        </p>
      </section>
    )
  );
};

export default Welcome;
