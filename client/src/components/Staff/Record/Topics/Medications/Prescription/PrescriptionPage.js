import React from "react";
import logo from "../../../../../../assets/img/logoLoginTest.png";
import { genderCT, toCodeTableName } from "../../../../../../datas/codesTables";
import useStaffInfosContext from "../../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../../hooks/useUserContext";
import { toLocalDate } from "../../../../../../utils/formatDates";
import { getAge } from "../../../../../../utils/getAge";
import { staffIdToTitleAndName } from "../../../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../../../utils/toPatientName";
import CircularProgressMedium from "../../../../../All/UI/Progress/CircularProgressMedium";
import AddedMedsList from "./AddedMedsList";

const PrescriptionPage = ({
  sites,
  siteSelectedId,
  patientId,
  demographicsInfos,
  addedMeds,
  setAddedMeds,
  uniqueId,
  setBody,
  body,
  setFinalInstructions,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const handleChangeBody = (e) => {
    const value = e.target.value;
    setBody(value);
    setFinalInstructions(
      addedMeds
        .map(({ PrescriptionInstructions }) => PrescriptionInstructions)
        .join("\n\n") +
        "\n\n" +
        value
    );
  };
  return (
    <div className="prescription__page">
      <div className="prescription__container">
        <div className="prescription__header">
          {sites ? (
            <>
              <div className="prescription__doctor-infos">
                <p>
                  {staffIdToTitleAndName(staffInfos, user.id)} (LIC.{" "}
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
            <CircularProgressMedium />
          )}
        </div>
        <div className="prescription__subheader">
          <div className="prescription__patient-infos">
            <p>
              Patient: {toPatientName(demographicsInfos)},{" "}
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
            {addedMeds.length > 0 ? (
              <AddedMedsList
                addedMeds={addedMeds}
                setAddedMeds={setAddedMeds}
                body={body}
                setFinalInstructions={setFinalInstructions}
              />
            ) : (
              ""
            )}
            <textarea
              className="prescription__body-content-textarea"
              name="body"
              value={body}
              onChange={handleChangeBody}
              placeholder="For the sake of medication traceability, we recommend that you include medications using either your templates list or the medication form located on the right side. While you can fill in the prescription as free text, please be aware that doing so will not add the medications to the patient's EMR."
            />
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
