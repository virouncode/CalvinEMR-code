import React from "react";
import { Helmet } from "react-helmet";
import Missing from "../../components/All/Missing/Missing";

const MissingPage = () => {
  return (
    <>
      <Helmet>
        <title>Page not found</title>
      </Helmet>
      <section className="missing-section">
        <Missing />
      </section>
    </>
  );
};

export default MissingPage;
