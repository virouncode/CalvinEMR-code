import React, { useCallback, useRef } from "react";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import { toLocalDate } from "../../../utils/formatDates";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import GuestPatientResultItem from "./GuestPatientResultItem";
import GuestStaffResultItem from "./GuestStaffResultItem";

const GuestsSearchResults = ({
  search,
  handleAddGuest,
  patientsDemographics,
  hostId,
  hasMore,
  setPaging,
  loading,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const lastPatientRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      const options = {
        root: rootRef.current,
        rootMargin: "0px",
        threshold: 1,
      };
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("intersecting");
          setPaging((prevPagination) => {
            return { ...prevPagination, page: prevPagination.page + 1 };
          });
        }
      }, options);
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, setPaging]
  );

  const rootRef = useRef(null);
  const observer = useRef(null);

  return (
    <ul className="results" ref={rootRef}>
      <div className="results__patients">
        <div className="results__title">Patients</div>
        {patientsDemographics
          .filter(
            (patient) =>
              patient.PhoneNumber.find(({ phoneNumber }) =>
                phoneNumber.includes(search.phone)
              ) && toLocalDate(patient.DateOfBirth).includes(search.birth)
            // &&
            // !patientsGuestsInfos
            //   .map(({ patient_id }) => patient_id)
            //   .includes(patient.patient_id)
          )
          .map((guest, index) =>
            index === patientsDemographics.length - 1 ? (
              <GuestPatientResultItem
                key={guest.id}
                guest={guest}
                handleAddGuest={handleAddGuest}
                lastPatientRef={lastPatientRef}
              />
            ) : (
              <GuestPatientResultItem
                key={guest.id}
                guest={guest}
                handleAddGuest={handleAddGuest}
              />
            )
          )}
        {loading && <CircularProgressMedium />}
      </div>
      <div className="results__staff">
        <div className="results__title">Staff</div>
        {search.chart === "" &&
          search.health === "" &&
          search.birth === "" &&
          staffInfos
            .filter(
              (staff) =>
                staff.full_name
                  .toLowerCase()
                  .includes(search.name.toLowerCase()) &&
                staff.email
                  .toLowerCase()
                  .includes(search.email.toLowerCase()) &&
                (staff.cell_phone.includes(search.phone) ||
                  staff.backup_phone.includes(search.phone)) &&
                staff.id !== hostId
              //   &&
              // !staffGuestsInfos.map(({ id }) => id).includes(staff.id)
            )
            .map((guest) => (
              <GuestStaffResultItem
                key={guest.id}
                guest={guest}
                handleAddGuest={handleAddGuest}
              />
            ))}
      </div>
    </ul>
  );
};

export default GuestsSearchResults;
