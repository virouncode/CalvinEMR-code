import React from "react";
import useIntersection from "../../../hooks/useIntersection";
import { toPatientName } from "../../../utils/toPatientName";
import EmptyLi from "../../All/UI/Lists/EmptyLi";
import LoadingLi from "../../All/UI/Lists/LoadingLi";
import PatientsListItem from "../../Staff/Messaging/PatientsListItem";

const MigrationPatientsList = ({
  isPatientIdChecked,
  isAllPatientsIdsChecked,
  handleCheckPatientId,
  handleCheckAllPatientsIds,
  isLoading,
  patientsDemographics,
  err,
  loading,
  hasMore,
  setPaging,
}) => {
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);
  return (
    <>
      {err && (
        <p className="migration-export__patients-list__err">
          Unable to fetch patients datas
        </p>
      )}
      {!err && (
        <ul className="migration-export__patients-list" ref={rootRef}>
          <li className="patients__list-item">
            <input
              type="checkbox"
              onChange={handleCheckAllPatientsIds}
              checked={isAllPatientsIdsChecked()}
              disabled={isLoading}
              style={{ marginRight: "5px" }}
            />
            <label>All</label>
          </li>
          {patientsDemographics && patientsDemographics.length > 0
            ? patientsDemographics.map((item, index) =>
                index === patientsDemographics.length - 1 ? (
                  <PatientsListItem
                    info={item}
                    key={item.id}
                    handleCheckPatient={handleCheckPatientId}
                    isPatientChecked={isPatientIdChecked}
                    patientName={toPatientName(item)}
                    isLoading={isLoading}
                    lastItemRef={lastItemRef}
                  />
                ) : (
                  <PatientsListItem
                    info={item}
                    key={item.id}
                    handleCheckPatient={handleCheckPatientId}
                    isPatientChecked={isPatientIdChecked}
                    patientName={toPatientName(item)}
                    isLoading={isLoading}
                  />
                )
              )
            : !loading && <EmptyLi text="No corresponding patients" />}
          {loading && <LoadingLi />}
        </ul>
      )}
    </>
  );
};

export default MigrationPatientsList;
