import React from "react";
import { Helmet } from "react-helmet";
import DocMailbox from "../../components/Staff/DocMailbox/DocMailbox";
import DocMailboxSecretary from "../../components/Staff/DocMailbox/DocMailboxSecretary";
import useAuthContext from "../../hooks/useAuthContext";

const DocMailboxPage = () => {
  const { user } = useAuthContext();
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
