import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";

const DiagnosisSearch = ({ handleClickDiagnosis }) => {
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);
  const { auth } = useAuthContext();

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDiagnosis = async () => {
      try {
        const response = await axiosXanoStaff.get(
          `/diagnosis_codes_for_text?diagnosis=${userInput}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setResults(response.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(`Unable to fetch diagnosis codes: ${err.message}`, {
            containerId: "A",
          });
        }
      }
    };
    fetchDiagnosis();
    return () => abortController.abort();
  }, [auth.authToken, userInput]);

  return (
    <>
      <div className="diagnosis-search">
        <label htmlFor="">Enter a diagnosis</label>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>
      {results.length > 0 ? (
        <ul className="diagnosis-results">
          {results.map((result) => (
            <li
              className="diagnosis-results__item"
              key={result.id}
              onClick={(e) => handleClickDiagnosis(e, result.code)}
            >
              <span className="diagnosis-results__code">{result.code}</span>{" "}
              <span className="diagnosis-results__name">
                {result.diagnosis}, {result.category}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default DiagnosisSearch;
