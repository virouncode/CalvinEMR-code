import React from "react";
import { Helmet } from "react-helmet";
import ReportsInbox from "../../components/Staff/ReportsInbox/ReportsInbox";
import ReportsInboxSecretary from "../../components/Staff/ReportsInbox/ReportsInboxSecretary";
import useUserContext from "../../hooks/context/useUserContext";
import useTitle from "../../hooks/useTitle";

const StaffReportsInboxPage = () => {
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

export default StaffReportsInboxPage;
