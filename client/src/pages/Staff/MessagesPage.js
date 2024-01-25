import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import MessagesExternal from "../../components/Staff/Messaging/External/MessagesExternal";
import Messages from "../../components/Staff/Messaging/Internal/Messages";
import MessagingToggle from "../../components/Staff/Messaging/MessagingToggle";

const MessagesPage = () => {
  const { msgType } = useParams();
  const [msgsType, setMsgsType] = useState(msgType || "Internal");
  const isTypeChecked = (type) => {
    return type === msgsType ? true : false;
  };
  const handleMsgsTypeChanged = (e) => {
    const name = e.target.name;
    setMsgsType(name);
  };
  return (
    <>
      <Helmet>
        <title>Messages</title>
      </Helmet>
      <section className="messages-section">
        <h2 className="messages-section__title">Messages</h2>
        <MessagingToggle
          isTypeChecked={isTypeChecked}
          handleMsgsTypeChanged={handleMsgsTypeChanged}
        />
        {msgsType === "Internal" ? <Messages /> : <MessagesExternal />}
      </section>
    </>
  );
};

export default MessagesPage;
