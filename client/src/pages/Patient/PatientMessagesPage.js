import React, { useState } from "react";
import { Helmet } from "react-helmet";
import FakeWindow from "../../components/All/UI/Windows/FakeWindow";
import PatientAIAgreement from "../../components/Patient/Agreement/PatientAIAgreement";
import MessagesPatient from "../../components/Patient/MessagingPatient/MessagesPatient";
import usePatientUserDemographicsSocket from "../../hooks/usePatientUserDemographicsSocket";
import useTitle from "../../hooks/useTitle";
import useUserContext from "../../hooks/useUserContext";

const PatientMessagesPage = () => {
  const { user } = useUserContext();
  const [popUpVisible, setPopUpVisible] = useState(
    !user.demographics.ai_consent_read
  );
  usePatientUserDemographicsSocket(user.id);
  useTitle("Messages");

  return (
    <>
      <Helmet>
        <title>Messages</title>
      </Helmet>
      <section className="patient-messages-section">
        <MessagesPatient />
        {popUpVisible && (
          <FakeWindow
            title="AI AGREEMENT"
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color="red"
            setPopUpVisible={setPopUpVisible}
          >
            <PatientAIAgreement
              demographicsInfos={user.demographics}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
      </section>
    </>
  );
};

export default PatientMessagesPage;
