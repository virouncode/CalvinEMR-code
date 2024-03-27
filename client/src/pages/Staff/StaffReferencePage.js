import { Helmet } from "react-helmet";
import Reference from "../../components/Staff/Reference/Reference";
import useTitle from "../../hooks/useTitle";

const StaffReferencePage = () => {
  useTitle("Useful Links");
  return (
    <>
      <Helmet>
        <title>Reference</title>
      </Helmet>
      <section className="reference-section">
        <Reference />
      </section>
    </>
  );
};

export default StaffReferencePage;
