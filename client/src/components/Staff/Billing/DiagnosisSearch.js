import React, { useState } from "react";
import useFetchDiagnosisList from "../../../hooks/useFetchDiagnosisList";
import useIntersection from "../../../hooks/useIntersection";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";

const DiagnosisSearch = ({ handleClickDiagnosis }) => {
  const [search, setSearch] = useState("");
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 15,
    offset: 0,
  });
  const { loading, err, diagnosis, setDiagnosis, hasMore } =
    useFetchDiagnosisList(search, paging);
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPaging({ ...paging, page: 1 });
  };

  return (
    <div className="diagnosis__container" ref={rootRef}>
      <div className="diagnosis-search">
        <label htmlFor="">Search</label>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Name, Category..."
        />
      </div>
      {err && <p className="diagnosis__err">Unable to fetch diagnosis datas</p>}
      {!err && diagnosis && diagnosis.length > 0 ? (
        <ul className="diagnosis-results">
          {diagnosis.map((item, index) =>
            index === diagnosis.length - 1 ? (
              <li
                className="diagnosis-results__item"
                key={item.id}
                onClick={(e) => handleClickDiagnosis(e, item.code)}
                ref={lastItemRef}
              >
                <span className="diagnosis-results__code">{item.code}</span>{" "}
                <span className="diagnosis-results__name">
                  {item.diagnosis}, {item.category}
                </span>
              </li>
            ) : (
              <li
                className="diagnosis-results__item"
                key={item.id}
                onClick={(e) => handleClickDiagnosis(e, item.code)}
              >
                <span className="diagnosis-results__code">{item.code}</span>{" "}
                <span className="diagnosis-results__name">
                  {item.diagnosis}, {item.category}
                </span>
              </li>
            )
          )}
        </ul>
      ) : (
        !loading && <EmptyParagraph text="No corresponding diagnosis" />
      )}
      {loading && <LoadingParagraph />}
    </div>
  );
};

export default DiagnosisSearch;
