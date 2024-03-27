import React, { useEffect, useState } from "react";
import useTopicSocket from "../../../../../hooks/socket/useTopicSocket";
import { isObjectEmpty } from "../../../../../utils/js/isObjectEmpty";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const PharmaciesContent = ({
  patientId,
  demographicsInfos,
  loadingPatient,
  errPatient,
}) => {
  const [preferredPharmacy, setPreferredPharmacy] = useState({});

  useEffect(() => {
    setPreferredPharmacy(demographicsInfos.preferred_pharmacy);
  }, [demographicsInfos.preferred_pharmacy]);

  useTopicSocket(
    "PREFERRED PHARMACY",
    preferredPharmacy,
    setPreferredPharmacy,
    patientId
  );

  return !loadingPatient && !isObjectEmpty(demographicsInfos) ? (
    errPatient ? (
      <p className="topic-content__err">{errPatient}</p>
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
