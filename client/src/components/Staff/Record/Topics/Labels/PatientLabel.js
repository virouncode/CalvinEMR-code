import React from "react";
import useFetchDatas from "../../../../../hooks/useFetchDatas";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import { toLocalDate } from "../../../../../utils/formatDates";
import { isObjectEmpty } from "../../../../../utils/isObjectEmpty";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/toPatientName";

const PatientLabel = ({ demographicsInfos }) => {
  const { staffInfos } = useStaffInfosContext();
  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };
  const [assignedMd, setAssignedMd] = useFetchDatas(
    `/staff/${demographicsInfos.assigned_staff_id}`,
    "staff",
    null,
    null,
    true
  );
  const LABEL_CONTAINER = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flexDirection: "column",
  };
  const LABEL_STYLE = {
    fontFamily: "Arial, sans-serif",
    width: "11.86cm",
    height: "3.71cm",
    border: "solid 1px black",
    padding: "10px",
    marginBottom: "20px",
  };
  const TITLE_STYLE = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    textDecoration: "underline",
    padding: "0px 10px",
  };
  const LINE_STYLE = {
    fontSize: "0.9rem",
    padding: "0px 10px",
  };
  const SPAN_STYLE = {
    marginRight: "20px",
  };
  const SMALL_LINE_STYLE = {
    fontSize: "0.6rem",
    padding: "0px 10px",
  };

  return (
    <div style={LABEL_CONTAINER}>
      <div style={LABEL_STYLE}>
        <p style={TITLE_STYLE}>
          {toPatientName(demographicsInfos).toUpperCase()}
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>SEX: {demographicsInfos.Gender}</span>
          <span style={SPAN_STYLE}>
            DOB: {toLocalDate(demographicsInfos.DateOfBirth)}
          </span>
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>
            HIN: {demographicsInfos.HealthCard?.Number}{" "}
            {demographicsInfos.HealthCard?.Version}
          </span>
          <span style={SPAN_STYLE}>
            CHART#: {demographicsInfos.ChartNumber}
          </span>
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>
            ADDRESS:{" "}
            {
              demographicsInfos.Address?.find(
                ({ _addressType }) => _addressType === "R"
              )?.Structured?.Line1
            }
            ,{" "}
            {
              demographicsInfos.Address?.find(
                ({ _addressType }) => _addressType === "R"
              )?.Structured?.City
            }
            ,{" "}
            {
              demographicsInfos.Address?.find(
                ({ _addressType }) => _addressType === "R"
              )?.Structured?.CountrySubDivisionCode
            }
            ,{" "}
            {demographicsInfos.Address?.find(
              ({ _addressType }) => _addressType === "R"
            )?.Structured?.PostalZipCode?.PostalCode ||
              demographicsInfos.Address?.find(
                ({ _addressType }) => _addressType === "R"
              )?.Structured?.PostalZipCode?.ZipCode ||
              ""}
          </span>
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>
            PHONE:{" "}
            {demographicsInfos.PhoneNumber?.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber ||
              demographicsInfos.PhoneNumber?.find(
                ({ _phoneNumberType }) => _phoneNumberType === "H"
              )?.phoneNumber ||
              ""}
          </span>
          <span style={SPAN_STYLE}>EMAIL: {demographicsInfos.Email}</span>
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>
            {staffIdToTitleAndName(
              staffInfos,
              demographicsInfos.assigned_staff_id,
              false
            )}
          </span>
        </p>
        <p style={SMALL_LINE_STYLE}>
          {!isObjectEmpty(assignedMd) && (
            <span style={SPAN_STYLE}>
              {assignedMd.site_infos.name}, {assignedMd.site_infos.address},{" "}
              {assignedMd.site_infos.city},{" "}
              {assignedMd.site_infos.province_state},{" "}
              {assignedMd.site_infos.postal_code ||
                assignedMd.site_infos.zip_code}
            </span>
          )}
        </p>
      </div>
      <div>
        <button onClick={handlePrint} className="labels-content__print-btn">
          Print
        </button>
      </div>
    </div>
  );
};

export default PatientLabel;
