import { CircularProgress } from "@mui/material";
import React from "react";
import logo from "../../../../../assets/img/logoLoginTest.png";
import { genderCT, toCodeTableName } from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { toLocalDate } from "../../../../../utils/formatDates";
import { getAge } from "../../../../../utils/getAge";
import { patientIdToName } from "../../../../../utils/patientIdToName";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import AddedMedsList from "./AddedMedsList";

const PrescriptionPage = ({
  printRef,
  sites,
  siteSelectedId,
  patientId,
  demographicsInfos,
  addedMeds,
  setAddedMeds,
  uniqueId,
}) => {
  const { clinic, user } = useAuth();
  const handleClickPrescription = () => {
    alert(
      "Due to medication traceability requirements, editing the prescription as free text is not permitted. Kindly utilize the forms located on the right side."
    );
  };
  return (
    <div
      ref={printRef}
      className="prescription__page"
      onClick={handleClickPrescription}
    >
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
            <CircularProgress />
          )}
        </div>
        <div className="prescription__subheader">
          <div className="prescription__patient-infos">
            <p>
              Patient: {patientIdToName(clinic.demographicsInfos, patientId)},{" "}
              {toCodeTableName(genderCT, demographicsInfos.Gender)}
              <br />
              Born {toLocalDate(demographicsInfos.DateOfBirth)},{" "}
              {getAge(demographicsInfos.DateOfBirth)} years-old
            </p>
          </div>
          <p className="prescription__date">
            Date emitted: {toLocalDate(new Date())}
          </p>
        </div>
        <div className="prescription__body">
          <p className="prescription__body-title">Prescription</p>
          <div className="prescription__body-content">
            {addedMeds.length > 0 ? (
              <AddedMedsList
                addedMeds={addedMeds}
                setAddedMeds={setAddedMeds}
              />
            ) : (
              ""
            )}
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

export default PrescriptionPage;