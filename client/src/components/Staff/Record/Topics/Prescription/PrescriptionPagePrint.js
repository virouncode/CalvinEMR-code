import { CircularProgress } from "@mui/material";
import React from "react";
import logo from "../../../../../assets/img/logoLoginTest.png";
import { genderCT, toCodeTableName } from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { toLocalDate } from "../../../../../utils/formatDates";
import { getAge } from "../../../../../utils/getAge";
import { patientIdToName } from "../../../../../utils/patientIdToName";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";

const PrescriptionPagePrint = ({
  printRef,
  sites,
  siteSelectedId,
  patientId,
  demographicsInfos,
  uniqueId,
  finalInstructions,
}) => {
  const { clinic, user } = useAuth();

  return (
    <div ref={printRef} className="prescription__page">
      <div className="prescription__container">
        <div className="prescription__header">
          {sites ? (
            <>
              <div className="prescription__doctor-infos">
                <p>
                  {staffIdToTitleAndName(clinic.staffInfos, user.id)} (LIC.{" "}
                  {user.licence_nbr})
                </p>
                <p>{sites.find(({ id }) => id === siteSelectedId)?.name}</p>
                <p>
                  {sites.find(({ id }) => id === siteSelectedId)?.address}{" "}
                  {sites.find(({ id }) => id === siteSelectedId)?.postal_code}{" "}
                  {
                    sites.find(({ id }) => id === siteSelectedId)
                      ?.province_state
                  }{" "}
                  {sites.find(({ id }) => id === siteSelectedId)?.city}
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
            <CircularProgress size="1rem" style={{ margin: "5px" }} />
          )}
        </div>
        <div className="prescription__subheader">
          <div className="prescription__patient-infos">
            <p>
              Patient: {patientIdToName(clinic.demographicsInfos, patientId)},{" "}
              {toCodeTableName(genderCT, demographicsInfos.Gender)}
              <br />
              Born {toLocalDate(demographicsInfos.DateOfBirth)},{" "}
              {getAge(demographicsInfos.DateOfBirth)} years-old,{" "}
              {demographicsInfos.HealthCard?.Number
                ? `\nHealth Card Number: ${demographicsInfos.HealthCard?.Number}`
                : ""}
            </p>
          </div>
          <p className="prescription__date">
            Date emitted: {toLocalDate(new Date())}
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
