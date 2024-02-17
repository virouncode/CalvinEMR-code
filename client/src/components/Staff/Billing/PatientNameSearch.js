import React, { useEffect, useState } from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import { patientIdToName } from "../../../utils/patientIdToName";

const PatientNameSearch = ({ handleClickPatient }) => {
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);
  const { clinic } = useAuthContext();

  useEffect(() => {
    setResults(
      clinic.demographicsInfos.filter(({ patient_id }) =>
        patientIdToName(clinic.demographicsInfos, patient_id)
          .toLowerCase()
          .includes(userInput.toLowerCase())
      )
    );
  }, [clinic.demographicsInfos, userInput]);

  return (
    <>
      <div className="hcn-search">
        <label htmlFor="">Enter a patient name</label>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>
      {results.length > 0 ? (
        <ul className="hcn-results">
          {results.map((result) => (
            <li
              className="hcn-results__item"
              key={result.id}
              onClick={(e) => handleClickPatient(e, result.patient_id)}
            >
              <span className="hcn-results__code">{result.ChartNumber}</span>{" "}
              <span className="hcn-results__name">
                {patientIdToName(clinic.demographicsInfos, result.patient_id)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default PatientNameSearch;
