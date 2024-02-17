import React from "react";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import GuestPatientItem from "./GuestPatientItem";
import GuestStaffItem from "./GuestStaffItem";

const GuestsList = ({
  patientsDemographics,
  tempFormDatas,
  handleRemoveGuest,
}) => {
  const { staffInfos } = useStaffInfosContext();

  const patientsGuestsInfos =
    patientsDemographics.length > 0
      ? tempFormDatas.patients_guests_ids.map(({ patient_infos }) =>
          patientsDemographics.find(
            ({ patient_id }) => patient_id === patient_infos.patient_id
          )
        )
      : [];

  const staffGuestsInfos = tempFormDatas.staff_guests_ids.map((staffGuestId) =>
    staffInfos.find(({ id }) => id === staffGuestId)
  );
  return (
    tempFormDatas && (
      <p className="guests-list">
        {patientsGuestsInfos.map((patient) => (
          <GuestPatientItem
            key={patient.patient_id}
            guest={patient}
            handleRemoveGuest={handleRemoveGuest}
          />
        ))}
        {staffGuestsInfos.map((staff) => (
          <GuestStaffItem
            key={staff.id}
            guest={staff}
            handleRemoveGuest={handleRemoveGuest}
          />
        ))}
      </p>
    )
  );
};

export default GuestsList;
