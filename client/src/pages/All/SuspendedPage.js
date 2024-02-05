import React from "react";
import { Helmet } from "react-helmet";
import Suspended from "../../components/All/Suspended/Suspended";

const SuspendedPage = () => {
  return (
    <>
      <Helmet>
        <title>Suspended account</title>
      </Helmet>
      <section className="suspended-section">
        <Suspended />
      </section>
    </>
  );
};

export default SuspendedPage;
