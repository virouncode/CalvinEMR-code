import { CircularProgress } from "@mui/material";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { searchByBrandName } from "../../../../../api/medsService";
import MedsResult from "./MedsResult";

const MedsSearch = ({ handleMedClick }) => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const abortController = useRef(null);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleSearch = async (e) => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    abortController.current = new AbortController();
    try {
      setLoading(true);
      const drugResults = await searchByBrandName(
        search.toUpperCase(),
        abortController.current
      );
      if (abortController.signal.aborted) return;
      setResults(drugResults);
      abortController.current = null;
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(`Error: unable to fetch meds database: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <div className="medications-search">
      <div className="medications-search-bar">
        <div>
          <label>Search Medication</label>
          <input
            type="text"
            name="med"
            onChange={handleChange}
            value={search.med}
            autoComplete="off"
          />
          {!loading ? (
            <i
              onClick={handleSearch}
              style={{ marginLeft: "10px", cursor: "pointer" }}
              className="fa-solid fa-magnifying-glass"
            ></i>
          ) : (
            <CircularProgress size="1rem" style={{ marginLeft: "10px" }} />
          )}
        </div>
      </div>
      <div>
        {!loading ? (
          <MedsResult results={results} handleMedClick={handleMedClick} />
        ) : (
          <p>Please wait...fetching the meds database can be long</p>
        )}
      </div>
    </div>
  );
};

export default MedsSearch;
