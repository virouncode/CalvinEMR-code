import React, { useState } from "react";
import { Helmet } from "react-helmet";
import CalvinAIChat from "../../components/Staff/CalvinAIChat/CalvinAIChat";
import StaffAIChatAgreement from "../../components/Staff/CalvinAIChat/StaffAIChatAgreement";
import useTitle from "../../hooks/useTitle";
import useUserContext from "../../hooks/useUserContext";

const CalvinAIPage = () => {
  const { user } = useUserContext();
  const [start, setStart] = useState(user.ai_consent);
  useTitle("Calvin AI Chat");

  return (
    <>
      <Helmet>
        <title>CalvinAI Chat</title>
      </Helmet>
      <section className="calvinai-section">
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
