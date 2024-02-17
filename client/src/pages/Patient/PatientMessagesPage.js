import React, { useState } from "react";
import { Helmet } from "react-helmet";
import FakeWindow from "../../components/All/UI/Windows/FakeWindow";
import PatientAIAgreement from "../../components/Patient/Agreement/PatientAIAgreement";
import MessagesPatient from "../../components/Patient/MessagingPatient/MessagesPatient";
import useAuthContext from "../../hooks/useAuthContext";

const PatientMessagesPage = () => {
  const { user } = useAuthContext();
  const [popUpVisible, setPopUpVisible] = useState(
    !user.demographics.ai_consent_read
  );
  return (
    <>
      <Helmet>
        <title>Messages</title>
      </Helmet>
      <section className="patient-messages-section">
        <h2 className="patient-messages-section__title">Messages</h2>
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
