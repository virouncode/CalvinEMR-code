import React from "react";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import GuestsList from "./GuestsList";
import GuestsSearch from "./GuestsSearch";

const EditGuests = ({
  tempFormDatas,
  setTempFormDatas,
  currentEvent,
  editable,
  hostId,
  search,
  setSearch,
  paging,
  setPaging,
  loading,
  err,
  hasMore,
  patientsDemographics,
}) => {
  //=========================== HOOKS =========================//
  const { staffInfos } = useStaffInfosContext();

  const handleSearch = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setSearch({ ...search, [name]: value });
    setPaging({ ...paging, page: 1 });
  };

  // //========================== EVENTS HANDLERS =======================//

  const handleAddGuest = (guest, e) => {
    const guestId = parseInt(e.target.parentElement.getAttribute("data-key"));
    const guestType = e.target.parentElement.getAttribute("data-type");
    let staffGuestsIdsUpdated = [...tempFormDatas.staff_guests_ids];
    let patientsGuestsIdsUpdated = [...tempFormDatas.patients_guests_ids];

    if (guestType === "staff") {
      staffGuestsIdsUpdated = [
        ...staffGuestsIdsUpdated,
        {
          staff_infos: {
            id: guestId,
            full_name: staffInfos.find(({ id }) => id === guestId).full_name,
            title: staffInfos.find(({ id }) => id === guestId).title,
          },
        },
      ];
      setTempFormDatas({
        ...tempFormDatas,
        staff_guests_ids: staffGuestsIdsUpdated,
      });
      currentEvent.current.setExtendedProp(
        "staffGuestsIds",
        staffGuestsIdsUpdated
      );
    } else {
      setPaging({ ...paging, page: 1 });
      patientsGuestsIdsUpdated = [
        ...patientsGuestsIdsUpdated,
        {
          patient_infos: {
            patient_id: guestId,
            Names: patientsDemographics.find(
              ({ patient_id }) => patient_id === guestId
            ).Names,
          },
        },
      ];
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
        ({ staff_infos }) => staff_infos.id !== parentKey
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
      setPaging({ ...paging, page: 1 });
      patientsGuestsIdsUpdated = patientsGuestsIdsUpdated.filter(
        ({ patient_infos }) => patient_infos.patient_id !== parentKey
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
          tempFormDatas={tempFormDatas}
          handleRemoveGuest={handleRemoveGuest}
        />
      </div>
      {editable && (
        <div className="event-form__item event-form__item--guestsearch">
          <GuestsSearch
            hostId={hostId}
            search={search}
            handleSearch={handleSearch}
            patientsDemographics={patientsDemographics}
            handleAddGuest={handleAddGuest}
            hasMore={hasMore}
            setPaging={setPaging}
            loading={loading}
            staff_guests_ids={tempFormDatas.staff_guests_ids}
          />
        </div>
      )}
    </>
  );
};

export default EditGuests;
