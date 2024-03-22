import React, { useState } from "react";
import useFetchPatientsSearch from "../../../../hooks/useFetchPatientsSearch";
import useIntersection from "../../../../hooks/useIntersection";
import { isObjectEmpty } from "../../../../utils/isObjectEmpty";
import { toPatientName } from "../../../../utils/toPatientName";
import EmptyLi from "./EmptyLi";
import LoadingLi from "./LoadingLi";

const PatientsSelect = ({ formDatas, setFormDatas, patientId = 0 }) => {
  //PATIENTS DATAS
  const [search, setSearch] = useState(
    isObjectEmpty(formDatas.relation_infos)
      ? ""
      : toPatientName(formDatas.relation_infos)
  );
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const { patients, loading, errMsg, hasMore } = useFetchPatientsSearch(
    paging,
    search
  );
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);
  const patientsList = patients.filter(
    ({ patient_id }) => patient_id !== patientId
  );
  const [resultsVisible, setResultsVisible] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    console.log(value);
    console.log(resultsVisible);
    setResultsVisible(true);
    setSearch(value);
    setPaging({ ...paging, page: 1 });
  };

  const handleSelect = (e, relationInfos) => {
    setFormDatas({
      ...formDatas,
      relation_infos: relationInfos,
    });
    setSearch(toPatientName(relationInfos));
    setResultsVisible(false);
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        className="patients-select__search"
        placeholder="Search by name, health card..."
        autoComplete="off"
      />
      {resultsVisible && (
        <ul ref={rootRef} className="patients-select__results">
          {errMsg && <li>{errMsg}</li>}
          {!errMsg &&
            (patientsList && patientsList.length > 0
              ? patientsList.map((item, index) =>
                  index === patientsList.length - 1 ? (
                    <li
                      className="patients-select__results-item"
                      key={item.patient_id}
                      ref={lastItemRef}
                      onClick={(e) => handleSelect(e, item)}
                    >
                      {toPatientName(item)}
                    </li>
                  ) : (
                    <li
                      key={item.patient_id}
                      className="patients-select__results-item"
                      onClick={(e) => handleSelect(e, item)}
                    >
                      {toPatientName(item)}
                    </li>
                  )
                )
              : !loading && <EmptyLi text="No corresponding patient" />)}
          {loading && <LoadingLi />}
        </ul>
      )}
    </div>
  );

  // return (
  //   <select
  //     name={name}
  //     onChange={handleChange}
  //     value={value}
  //     ref={rootRef}
  //     id={id}
  //   >
  //     <option value="" disabled>
  //       Choose a patient
  //     </option>
  //     {patientsList.map((item, index) =>
  //       index === patientsList.length - 1 ? (
  //         <option
  //           value={item.patient_id}
  //           key={item.patient_id}
  //           ref={lastItemRef}
  //           data-gender={item.Gender}
  //         >
  //           {toPatientName(item)}
  //         </option>
  //       ) : (
  //         <option
  //           value={item.patient_id}
  //           key={item.patient_id}
  //           data-gender={item.Gender}
  //         >
  //           {toPatientName(item)}
  //         </option>
  //       )
  //     )}
  //   </select>
  // );
};

export default PatientsSelect;
