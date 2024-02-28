import React from "react";
import { Helmet } from "react-helmet";
import Migration from "../../components/Admin/Migration/Migration";
import useTitle from "../../hooks/useTitle";

const MigrationPage = () => {
  useTitle("EMR Migration");
  return (
    <>
      <Helmet>
        <title>Migration</title>
      </Helmet>
      <section className="migration-section">
        <Migration />
      </section>
    </>
  );
};

export default MigrationPage;
