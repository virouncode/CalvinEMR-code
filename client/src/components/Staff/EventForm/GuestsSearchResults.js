import React from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useIntersection from "../../../hooks/useIntersection";
import LoadingLi from "../../UI/Lists/LoadingLi";
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
  staff_guests_ids,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  return (
    <ul className="results" ref={rootRef}>
      <div className="results__patients">
        <div className="results__title">Patients</div>
        {patientsDemographics.map((guest, index) =>
          index === patientsDemographics.length - 1 ? (
            <GuestPatientResultItem
              key={guest.id}
              guest={guest}
              handleAddGuest={handleAddGuest}
              lastItemRef={lastItemRef}
            />
          ) : (
            <GuestPatientResultItem
              key={guest.id}
              guest={guest}
              handleAddGuest={handleAddGuest}
            />
          )
        )}
        {loading && <LoadingLi />}
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
                staff.id !== hostId &&
                !staff_guests_ids
                  .map(({ staff_infos }) => staff_infos.id)
                  .includes(staff.id)
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
