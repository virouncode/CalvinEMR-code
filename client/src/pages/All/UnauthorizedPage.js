import React from "react";
import { Helmet } from "react-helmet";
import Unauthorized from "../../components/All/Unauthorized/Unauthorized";

const UnauthorizedPage = () => {
  return (
    <>
      <Helmet>
        <title>Unauthorized</title>
      </Helmet>
      <section className="unauthorized-section">
        <Unauthorized />
      </section>
    </>
  );
};

export default UnauthorizedPage;
