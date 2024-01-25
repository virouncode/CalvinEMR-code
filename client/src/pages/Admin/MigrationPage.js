import React from "react";
import { Helmet } from "react-helmet";
import Migration from "../../components/Admin/Migration/Migration";

const MigrationPage = () => {
  return (
    <>
      <Helmet>
        <title>Migration</title>
      </Helmet>
      <section className="migration-section">
        <h2 className="migration-section__title">EMR Migration</h2>
        <Migration />
      </section>
    </>
  );
};

export default MigrationPage;
