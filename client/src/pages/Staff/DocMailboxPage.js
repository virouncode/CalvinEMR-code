import React from "react";
import { Helmet } from "react-helmet";
import DocMailbox from "../../components/Staff/DocMailbox/DocMailbox";
import DocMailboxSecretary from "../../components/Staff/DocMailbox/DocMailboxSecretary";
import useAuth from "../../hooks/useAuth";

const DocMailboxPage = () => {
  const { user } = useAuth();
  return (
    <>
      <Helmet>
        <title>Inbox</title>
      </Helmet>
      <section className="docmailbox-section">
        <h2 className="docmailbox-section__title">Inbox</h2>
        {user.title === "Secretary" ? <DocMailboxSecretary /> : <DocMailbox />}
      </section>
    </>
  );
};

export default DocMailboxPage;
