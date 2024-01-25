import React, { useState } from "react";
import { Helmet } from "react-helmet";
import CalvinAIChat from "../../components/Staff/CalvinAIChat/CalvinAIChat";
import StaffAIChatAgreement from "../../components/Staff/CalvinAIChat/StaffAIChatAgreement";
import useAuth from "../../hooks/useAuth";

const CalvinAIPage = () => {
  const { user } = useAuth();
  const [start, setStart] = useState(user.ai_consent);
  return (
    <>
      <Helmet>
        <title>CalvinAI Chat</title>
      </Helmet>
      <section className="calvinai-section">
        <h2 className="calvinai-section__title">Calvin AI Chat</h2>
        {start ? (
          <CalvinAIChat />
        ) : (
          <StaffAIChatAgreement setStart={setStart} />
        )}
      </section>
    </>
  );
};

export default CalvinAIPage;
