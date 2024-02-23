import React from "react";
import { Helmet } from "react-helmet";
import ReportsInbox from "../../components/Staff/ReportsInbox/ReportsInbox";
import ReportsInboxSecretary from "../../components/Staff/ReportsInbox/ReportsInboxSecretary";
import useUserContext from "../../hooks/useUserContext";

const ReportsInboxPage = () => {
  const { user } = useUserContext();
  return (
    <>
      <Helmet>
        <title>Inbox</title>
      </Helmet>
      <section className="reportsinbox-section">
        <h2 className="reportsinbox-section__title">Inbox</h2>
        {user.title === "Secretary" ? (
          <ReportsInboxSecretary />
        ) : (
          <ReportsInbox />
        )}
      </section>
    </>
  );
};

export default ReportsInboxPage;
