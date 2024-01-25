import React, { useEffect } from "react";
import GuestsList from "./GuestsList";
import GuestsSearch from "./GuestsSearch";

const EditGuests = ({
  staffInfos,
  demographicsInfos,
  tempFormDatas,
  setTempFormDatas,
  currentEvent,
  editable,
  hostId,
  staffGuestsInfos,
  setStaffGuestsInfos,
  patientsGuestsInfos,
  setPatientsGuestsInfos,
}) => {
  //=========================== HOOKS =========================//

  useEffect(() => {
    setStaffGuestsInfos(
      staffInfos.filter(({ id }) => tempFormDatas.staff_guests_ids.includes(id))
    );
    setPatientsGuestsInfos(
      demographicsInfos.filter(({ patient_id }) =>
        tempFormDatas.patients_guests_ids.includes(patient_id)
      )
    );
  }, [
    demographicsInfos,
    setPatientsGuestsInfos,
    setStaffGuestsInfos,
    staffInfos,
    tempFormDatas.patients_guests_ids,
    tempFormDatas.staff_guests_ids,
  ]);

  // //========================== EVENTS HANDLERS =======================//

  const handleAddGuest = (guest, e) => {
    const guestId = parseInt(e.target.parentElement.getAttribute("data-key"));
    const guestType = e.target.parentElement.getAttribute("data-type");
    let staffGuestsIdsUpdated = [...tempFormDatas.staff_guests_ids];
    let patientsGuestsIdsUpdated = [...tempFormDatas.patients_guests_ids];

    if (guestType === "staff") {
      staffGuestsIdsUpdated = [...staffGuestsIdsUpdated, guestId];
      setTempFormDatas({
        ...tempFormDatas,
        staff_guests_ids: staffGuestsIdsUpdated,
      });
      currentEvent.current.setExtendedProp(
        "staffGuestsIds",
        staffGuestsIdsUpdated
      );
    } else {
      patientsGuestsIdsUpdated = [...patientsGuestsIdsUpdated, guestId];
      setTempFormDatas({
        ...tempFormDatas,
        patients_guests_ids: patientsGuestsIdsUpdated,
      });
      currentEvent.current.setExtendedProp(
        "patientsGuestsIds",
        patientsGuestsIdsUpdated
      );
    }
  };

  const handleRemoveGuest = (e) => {
    const parentKey = parseInt(e.target.parentElement.getAttribute("data-key")); //from GuestStaffItem
    const parentType = e.target.parentElement.getAttribute("data-type");

    let staffGuestsIdsUpdated = [...tempFormDatas.staff_guests_ids];
    let patientsGuestsIdsUpdated = [...tempFormDatas.patients_guests_ids];
    //FAIRE DES FILTER AU LIEU DE INDEX TO REMOVE CAR L'ORDRE N'EST PAS LE MEME
    if (parentType === "staff") {
      //i want to remove a staff guest
      staffGuestsIdsUpdated = staffGuestsIdsUpdated.filter(
        (id) => id !== parentKey
      );
      setTempFormDatas({
        ...tempFormDatas,
        staff_guests_ids: staffGuestsIdsUpdated,
      });
      currentEvent.current.setExtendedProp(
        "staffGuestsIds",
        staffGuestsIdsUpdated
      );
    } else {
      patientsGuestsIdsUpdated = patientsGuestsIdsUpdated.filter(
        (id) => id !== parentKey
      );
      setTempFormDatas({
        ...tempFormDatas,
        patients_guests_ids: patientsGuestsIdsUpdated,
      });
      currentEvent.current.setExtendedProp(
        "patientsGuestsIds",
        patientsGuestsIdsUpdated
      );
    }
  };

  return (
    <>
      <div className="event-form__item event-form__item--guestlist">
        <label>Patients/Guests: </label>
        <GuestsList
          patientsGuestsInfos={patientsGuestsInfos}
          staffGuestsInfos={staffGuestsInfos}
          handleRemoveGuest={handleRemoveGuest}
        />
      </div>
      {editable && (
        <div className="event-form__item event-form__item--guestsearch">
          <GuestsSearch
            handleAddGuest={handleAddGuest}
            demographicsInfos={demographicsInfos}
            staffInfos={staffInfos}
            patientsGuestsInfos={patientsGuestsInfos}
            staffGuestsInfos={staffGuestsInfos}
            hostId={hostId}
          />
        </div>
      )}
    </>
  );
};

export default EditGuests;
