import React from "react";
import { Helmet } from "react-helmet";
import ReportsInbox from "../../components/Staff/ReportsInbox/ReportsInbox";
import ReportsInboxSecretary from "../../components/Staff/ReportsInbox/ReportsInboxSecretary";
import useTitle from "../../hooks/useTitle";
import useUserContext from "../../hooks/useUserContext";

const ReportsInboxPage = () => {
  const { user } = useUserContext();
  useTitle("Inbox");
  return (
    <>
      <Helmet>
        <title>Inbox</title>
      </Helmet>
      <section className="reportsinbox-section">
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
