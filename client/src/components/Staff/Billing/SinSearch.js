import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { patientIdToName } from "../../../utils/patientIdToName";

const SinSearch = ({ handleClickHin }) => {
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);
  const { clinic } = useAuth();

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
      <div className="sin-search">
        <label htmlFor="">Enter a patient name</label>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>
      {results.length > 0 ? (
        <ul className="sin-results">
          {results.map((result) => (
            <li
              className="sin-results__item"
              key={result.id}
              onClick={(e) => handleClickHin(e, result.SIN)}
            >
              <span className="sin-results__code">{result.SIN}</span>{" "}
              <span className="sin-results__name">
                {patientIdToName(clinic.demographicsInfos, result.patient_id)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default SinSearch;
