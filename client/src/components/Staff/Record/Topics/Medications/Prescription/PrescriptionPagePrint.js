import React from "react";
import logo from "../../../../../../assets/img/logoLoginTest.png";
import useClinicContext from "../../../../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  genderCT,
  toCodeTableName,
} from "../../../../../../omdDatas/codesTables";
import {
  getAgeTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../../utils/names/toPatientName";
import CircularProgressMedium from "../../../../../UI/Progress/CircularProgressMedium";

const PrescriptionPagePrint = ({
  printRef,
  sites,
  siteSelectedId,
  demographicsInfos,
  uniqueId,
  finalInstructions,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();

  return (
    <div ref={printRef} className="prescription__page">
      <div className="prescription__container">
        <div className="prescription__header">
          {sites ? (
            <>
              <div className="prescription__doctor-infos">
                <p>
                  {staffIdToTitleAndName(staffInfos, user.id, false, false)}{" "}
                  (LIC. {user.licence_nbr})
                </p>
                <p>
                  {clinic.name},{" "}
                  {sites.find(({ id }) => id === siteSelectedId)?.name}
                </p>
                <p>
                  {sites.find(({ id }) => id === siteSelectedId)?.address}{" "}
                  {sites.find(({ id }) => id === siteSelectedId)?.city}{" "}
                  {
                    sites.find(({ id }) => id === siteSelectedId)
                      ?.province_state
                  }{" "}
                  {sites.find(({ id }) => id === siteSelectedId)?.postal_code}{" "}
                </p>
                <p>
                  Phone: {sites.find(({ id }) => id === siteSelectedId)?.phone}
                </p>
                <p>Fax: {sites.find(({ id }) => id === siteSelectedId)?.fax}</p>
              </div>
              <div className="prescription__logo">
                <img
                  src={
                    sites.find(({ id }) => id === siteSelectedId)?.logo?.url ||
                    logo
                  }
                  alt="prescription-logo"
                />
              </div>
            </>
          ) : (
            <CircularProgressMedium />
          )}
        </div>
        <div className="prescription__subheader">
          <div className="prescription__patient-infos">
            <p>
              Patient: {toPatientName(demographicsInfos)}
              <br />
              {toCodeTableName(genderCT, demographicsInfos.Gender)}, Born{" "}
              {timestampToDateISOTZ(demographicsInfos.DateOfBirth)},{" "}
              {getAgeTZ(demographicsInfos.DateOfBirth)} years-old,{" "}
              {demographicsInfos.HealthCard?.Number
                ? `\nHealth Card Number: ${demographicsInfos.HealthCard?.Number}`
                : ""}
            </p>
          </div>
          <p className="prescription__date">
            Date emitted: {timestampToDateISOTZ(nowTZTimestamp())}
          </p>
        </div>
        <div className="prescription__body">
          <p className="prescription__body-title">Prescription</p>
          <div className="prescription__body-content">
            <div className="prescription__body-content-final">
              {finalInstructions}
            </div>
          </div>
        </div>
        <div className="prescription__footer">
          {uniqueId && <p className="prescription__id">ID:{uniqueId}</p>}
        </div>
        <div className="prescription__sign">
          <div className="prescription__sign-image">
            <img
              src={user.sign?.url}
              alt="doctor-sign"
              crossOrigin="Anonymous"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPagePrint;
