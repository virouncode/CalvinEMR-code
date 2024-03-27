import React from "react";
import useIntersection from "../../../hooks/useIntersection";
import { toPatientName } from "../../../utils/names/toPatientName";
import LoadingLi from "../../UI/Lists/LoadingLi";
import PatientsListItem from "./PatientsListItem";

const PatientsList = ({
  isPatientChecked,
  handleCheckPatient,
  patientsDemographics,
  loading,
  hasMore,
  setPaging,
}) => {
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  return (
    <ul className="patients-list" ref={rootRef}>
      {patientsDemographics && patientsDemographics.length > 0
        ? patientsDemographics.map((info, index) =>
            index === patientsDemographics.length - 1 ? (
              <PatientsListItem
                info={info}
                key={info.id}
                handleCheckPatient={handleCheckPatient}
                isPatientChecked={isPatientChecked}
                patientName={toPatientName(info)}
                lastItemRef={lastItemRef}
              />
            ) : (
              <PatientsListItem
                info={info}
                key={info.id}
                handleCheckPatient={handleCheckPatient}
                isPatientChecked={isPatientChecked}
                patientName={toPatientName(info)}
              />
            )
          )
        : !loading && <li>No Patients</li>}
      {loading && <LoadingLi />}
    </ul>
  );
};

export default PatientsList;
