import React, { useState } from "react";
import useIntersection from "../../../hooks/useIntersection";
import usePatientsList from "../../../hooks/usePatientsList";
import { toPatientName } from "../../../utils/toPatientName";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";

const PatientChartHealthSearch = ({ handleClickPatient }) => {
  const [search, setSearch] = useState("");
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 15,
    offset: 0,
  });
  const {
    loading,
    err,
    patientsDemographics,
    setPatientsDemographics,
    hasMore,
  } = usePatientsList(search, paging);

  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPaging({ ...paging, page: 1 });
  };

  return (
    <div className="hcn__container" ref={rootRef}>
      <div className="hcn-search">
        <label htmlFor="">Search</label>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Chart#, Health Card#, Name..."
          style={{ width: "300px" }}
        />
      </div>
      {err && <p className="hcn__err">Unable to fetch patients datas</p>}
      {!err && patientsDemographics && patientsDemographics.length > 0 ? (
        <ul className="hcn-results">
          {patientsDemographics.map((item, index) =>
            index === patientsDemographics.length - 1 ? (
              <li
                className="hcn-results__item"
                key={item.id}
                onClick={(e) => handleClickPatient(e, item)}
                ref={lastItemRef}
              >
                <span className="hcn-results__code">{item.ChartNumber}</span>{" "}
                <span className="hcn-results__code">
                  {item.HealthCard?.Number}
                </span>{" "}
                <span className="hcn-results__name">{toPatientName(item)}</span>
              </li>
            ) : (
              <li
                className="hcn-results__item"
                key={item.id}
                onClick={(e) => handleClickPatient(e, item)}
              >
                <span className="hcn-results__code">{item.ChartNumber}</span>{" "}
                <span className="hcn-results__code">
                  {item.HealthCard?.Number}
                </span>{" "}
                <span className="hcn-results__name">{toPatientName(item)}</span>
              </li>
            )
          )}
        </ul>
      ) : (
        !loading && <EmptyParagraph text="No corresponding patients" />
      )}
      {loading && <LoadingParagraph />}
    </div>
  );
};

export default PatientChartHealthSearch;
