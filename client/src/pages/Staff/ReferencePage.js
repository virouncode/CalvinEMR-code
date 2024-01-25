import { Helmet } from "react-helmet";
import Reference from "../../components/Staff/Reference/Reference";

const ReferencePage = () => {
  return (
    <>
      <Helmet>
        <title>Reference</title>
      </Helmet>
      <section className="reference-section">
        <h2 className="reference-section__title">Useful Links</h2>
        <Reference />
      </section>
    </>
  );
};

export default ReferencePage;
