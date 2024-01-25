import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuth from "../../../hooks/useAuth";

const ReferringOHIPSearch = ({ handleClickRefOHIP }) => {
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDoctors = async () => {
      try {
        const response = await axiosXanoStaff.get(
          `/doctors_for_text?name=${userInput}`,
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
          toast.error(`Unable to fetch referring MDs: ${err.message}`, {
            containerId: "A",
          });
        }
      }
    };
    fetchDoctors();
    return () => abortController.abort();
  }, [auth.authToken, userInput]);

  return (
    <>
      <div className="refohip-search">
        <label htmlFor="">Enter a doctor name</label>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
      </div>
      {results.length > 0 ? (
        <ul className="refohip-results">
          {results.map((result) => (
            <li
              className="refohip-results__item"
              key={result.id}
              onClick={(e) => handleClickRefOHIP(e, result.ohip_billing_nbr)}
            >
              <span className="refohip-results__code">
                {result.ohip_billing_nbr}
              </span>{" "}
              <span className="refohip-results__name">
                Dr. {result.FirstName} {result.LastName} ({result.speciality},{" "}
                {result.Address.Structured.City})
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

export default ReferringOHIPSearch;
