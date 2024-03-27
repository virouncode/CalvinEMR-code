import React, { useState } from "react";
import { Helmet } from "react-helmet";
import CalvinAIChat from "../../components/Staff/CalvinAIChat/CalvinAIChat";
import StaffAIChatAgreement from "../../components/Staff/CalvinAIChat/StaffAIChatAgreement";
import useUserContext from "../../hooks/context/useUserContext";
import useTitle from "../../hooks/useTitle";

const StaffCalvinAIPage = () => {
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

export default StaffCalvinAIPage;
