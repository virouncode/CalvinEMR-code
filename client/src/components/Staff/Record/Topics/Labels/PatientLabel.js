import React, { useRef } from "react";
import { toast } from "react-toastify";
import useClinicContext from "../../../../../hooks/useClinicContext";
import useFetchDatas from "../../../../../hooks/useFetchDatas";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import { copyToClipboard } from "../../../../../utils/copyToClipboard";
import { timestampToDateISOTZ } from "../../../../../utils/formatDates";
import { isObjectEmpty } from "../../../../../utils/isObjectEmpty";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/toPatientName";

const PatientLabel = ({ demographicsInfos, windowRef }) => {
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();
  const labelRef = useRef(null);
  const [assignedMd, setAssignedMd] = useFetchDatas(
    `/staff/${demographicsInfos.assigned_staff_id}`,
    "staff",
    null,
    null,
    true
  );
  const [sites] = useFetchDatas("/sites", "staff");
  const patientSite = sites.find(({ id }) => id === assignedMd.site_id);

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
    fontSize: "1.1rem",
    fontWeight: "bold",
    textDecoration: "underline",
    padding: "0px 10px",
  };
  const LINE_STYLE = {
    fontSize: "0.7rem",
    padding: "0px 10px",
  };
  const SPAN_STYLE = {
    marginRight: "20px",
  };
  const SMALL_LINE_STYLE = {
    fontSize: "0.5rem",
    padding: "0px 10px",
  };
  const BTN_STYLE = {
    marginRight: "5px",
  };

  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };
  const handleCopy = async () => {
    try {
      await copyToClipboard(windowRef.current, labelRef.current);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      toast.error(`Unable to copy label: ${err.message}`, { containerId: "A" });
    }
  };

  return (
    <div style={LABEL_CONTAINER}>
      <div style={LABEL_STYLE} ref={labelRef}>
        <p style={TITLE_STYLE}>
          {toPatientName(demographicsInfos).toUpperCase()}
        </p>
        <p style={LINE_STYLE}>
          <span style={SPAN_STYLE}>SEX: {demographicsInfos.Gender}</span>
          <span style={SPAN_STYLE}>
            DOB: {timestampToDateISOTZ(demographicsInfos.DateOfBirth)}
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
                ({ _phoneNumberType }) => _phoneNumberType === "R"
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
          {!isObjectEmpty(assignedMd) && patientSite && (
            <span style={SPAN_STYLE}>
              {clinic.name}, {patientSite.name}, {patientSite.address},{" "}
              {patientSite.city}, {patientSite.province_state},{" "}
              {patientSite.postal_code || patientSite.zip_code}
            </span>
          )}
        </p>
        <p style={SMALL_LINE_STYLE}>
          <span style={SPAN_STYLE}>Email: {clinic.email}</span>
          <span style={SPAN_STYLE}>Website: {clinic.website}</span>
        </p>
      </div>
      <div>
        <button
          style={BTN_STYLE}
          onClick={handlePrint}
          className="labels-content__print-btn"
        >
          Print
        </button>
        <button onClick={handleCopy} className="labels-content__print-btn">
          Copy to clipboard
        </button>
      </div>
    </div>
  );
};

export default PatientLabel;
