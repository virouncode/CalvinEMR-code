import React, { useState } from "react";
import useIntersection from "../../../hooks/useIntersection";
import usePatientsList from "../../../hooks/usePatientsList";
import { toPatientName } from "../../../utils/names/toPatientName";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

const PatientChartHealthSearch = ({ handleClickPatient }) => {
  const [search, setSearch] = useState("");
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 15,
    offset: 0,
  });
  const { loading, err, patientsDemographics, hasMore } = usePatientsList(
    search,
    paging
  );

  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPaging({ ...paging, page: 1 });
  };

  return (
    <div className="hcn__container">
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
        <ul className="hcn-results" ref={rootRef}>
          <li className="hcn-results__item hcn-results__item--headers">
            <span className="hcn-results__code">Chart#</span>
            <span className="hcn-results__code">Health Card#</span>
            <span className="hcn-results__name" style={{ fontWeight: "bold" }}>
              Name
            </span>
          </li>
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
