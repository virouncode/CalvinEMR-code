import React from "react";
import { NavLink } from "react-router-dom";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../datas/codesTables";
import { toLocalDate } from "../../../../utils/formatDates";
import { getAge } from "../../../../utils/getAge";

const PatientResultItem = ({ patient }) => {
  return (
    <tr>
      <td>
        <NavLink
          to={`/patient-record/${patient.patient_id}`}
          className="record-link"
          target="_blank"
        >
          {patient.Names.LegalName.LastName.Part}
        </NavLink>
      </td>
      <td>{patient.Names.LegalName.FirstName.Part}</td>
      <td>{patient.Names.LegalName.OtherName[0].Part}</td>
      <td>{toLocalDate(patient.DateOfBirth)}</td>
      <td>{getAge(toLocalDate(patient.DateOfBirth))}</td>
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
      <td>{patient.SIN}</td>
      <td>
        {
          patient.Address.find(({ _addressType }) => _addressType === "R")
            .Structured.Line1
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
