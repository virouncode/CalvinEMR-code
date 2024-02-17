import React from "react";
import { axiosXanoStaff } from "../../../../../api/xanoStaff";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useFetchDatas from "../../../../../hooks/useFetchDatas";
import useTopicSocket from "../../../../../hooks/useTopicSocket";
import { isObjectEmpty } from "../../../../../utils/isObjectEmpty";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const PharmaciesContent = ({ patientId, loadingPatient, errPatient }) => {
  const { auth } = useAuthContext();
  const [
    preferredPharmacy,
    setPreferredPharmacy,
    loadingPharmacy,
    errPharmacy,
  ] = useFetchDatas(
    `/preferred_pharmacy_of_patient`,
    axiosXanoStaff,
    auth.authToken,
    "patient_id",
    patientId,
    true
  );

  useTopicSocket(
    "PREFERRED PHARMACY",
    preferredPharmacy,
    setPreferredPharmacy,
    patientId
  );

  return !loadingPharmacy && !loadingPatient ? (
    errPharmacy || errPatient ? (
      <>
        {errPharmacy && <p className="topic-content__err">{errPharmacy}</p>}
        {errPatient && <p className="topic-content__err">{errPatient}</p>}
      </>
    ) : (
      <div className="topic-content">
        <label style={{ fontWeight: "bold" }}>Preferred Pharmacy: </label>
        {!isObjectEmpty(preferredPharmacy) ? (
          <span>
            {preferredPharmacy.Name},{" "}
            {preferredPharmacy.Address?.Structured?.Line1},{" "}
            {preferredPharmacy.Address?.Structured?.City},{" "}
            {preferredPharmacy.Address?.Structured?.CountrySubDivisionCode},{" "}
            {preferredPharmacy.PhoneNumber?.[0]?.phoneNumber}
          </span>
        ) : (
          "No preferred pharmacy"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default PharmaciesContent;
