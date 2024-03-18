import React, { useEffect, useState } from "react";
import useAdminsInfosContext from "../../../hooks/useAdminsInfosContext";
import useClinicContext from "../../../hooks/useClinicContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { nowHumanTZ, nowTZ } from "../../../utils/formatDates";
import { toWelcomeName } from "../../../utils/toWelcomeName";

const Welcome = ({ title }) => {
  //=================== STATES =======================//
  const [helloMessage, setHelloMessage] = useState("");
  const [clock, setClock] = useState("");
  const { user } = useUserContext();
  const { clinic } = useClinicContext();
  const { staffInfos } = useStaffInfosContext();
  const { adminsInfos } = useAdminsInfosContext();

  useEffect(() => {
    const displayHello = () => {
      const now = nowTZ();
      const hour = now.hour;
      let message = "";
      if (hour >= 5 && hour < 12) {
        message = "Good Morning";
      } else if (hour >= 12 && hour < 17) {
        message = "Good Afternoon";
      } else if (hour >= 17 && hour < 21) {
        message = "Good Evening";
      } else {
        message = "Good Night";
      }
      setHelloMessage(message);
    };

    const displayClock = () => {
      setClock(nowHumanTZ());
    };

    // Appel initial pour afficher le message
    displayHello();
    displayClock();

    // Mise à jour toutes les demi-heures
    const intervalHello = setInterval(displayHello, 1800000);
    //Mis à jour toutes les secondes
    const intervalClock = setInterval(displayClock, 1000);

    // Nettoyage de l'intervalle lors du démontage du composant
    return () => {
      clearInterval(intervalHello);
      clearInterval(intervalClock);
    };
  }, []);

  return (
    user.id && (
      <section className="welcome-section">
        <h2 className="welcome-section__clinic">
          {clinic.name}, {clock}
        </h2>{" "}
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
