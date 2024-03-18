import { Tooltip } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../datas/codesTables";
import { getAgeTZ, timestampToDateISOTZ } from "../../../../utils/formatDates";

const PatientResultItem = ({ patient, lastPatientRef }) => {
  return (
    <tr ref={lastPatientRef}>
      <td>
        <Tooltip title="Go to EMR" placement="top-start" arrow>
          <NavLink
            to={`/staff/patient-record/${patient.patient_id}`}
            className="record-link"
            // target="_blank"
          >
            {patient.Names.LegalName.LastName.Part || ""}
          </NavLink>
        </Tooltip>
      </td>
      <td>{patient.Names.LegalName.FirstName.Part || ""}</td>
      <td>{patient.Names.LegalName.OtherName?.[0]?.Part || ""}</td>
      <td>{timestampToDateISOTZ(patient.DateOfBirth)}</td>
      <td>{getAgeTZ(patient.DateOfBirth)}</td>
      <td>{patient.ChartNumber}</td>
      <td>{patient.Email}</td>
      <td>
        {
          patient.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "C"
          )?.phoneNumber
        }
      </td>
      <td>
        {
          patient.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "R"
          )?.phoneNumber
        }
      </td>
      <td>
        {
          patient.PhoneNumber.find(
            ({ _phoneNumberType }) => _phoneNumberType === "W"
          )?.phoneNumber
        }
      </td>
      <td>{patient.HealthCard?.Number || ""}</td>
      <td>
        {
          patient.Address.find(({ _addressType }) => _addressType === "R")
            ?.Structured.Line1
        }
      </td>
      <td>
        {patient.Address.find(({ _addressType }) => _addressType === "R")
          .Structured.PostalZipCode.PostalCode ||
          patient.Address.find(({ _addressType }) => _addressType === "R")
            .Structured.PostalZipCode.PostalZipCode}
      </td>
      <td>
        {toCodeTableName(
          provinceStateTerritoryCT,
          patient.Address.find(({ _addressType }) => _addressType === "R")
            .Structured.CountrySubDivisionCode
        )}
      </td>
      <td>
        {
          patient.Address.find(({ _addressType }) => _addressType === "R")
            .Structured.City
        }
      </td>
    </tr>
  );
};

export default PatientResultItem;
