import React from "react";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../../../api/fetchRecords";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";

const FamilyDoctorItem = ({ item, patientId }) => {
  const { auth, user, socket } = useAuth();

  const handleRemoveFromPatient = async (e) => {
    try {
      await putPatientRecord(
        "/doctors",
        item.id,
        user.id,
        auth.authToken,
        {
          ...item,
          patients: item.patients.filter((id) => id !== patientId),
        },
        socket,
        "FAMILY DOCTORS/SPECIALISTS"
      );
      toast.success("Removed successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to update doctor:${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    <tr className="doctors__item">
      <td>{item.LastName}</td>
      <td>{item.FirstName}</td>
      <td>{item.speciality}</td>
      <td>{item.licence_nbr}</td>
      <td>{item.ohip_billing_nbr}</td>
      <td>{item.Address.Structured.Line1}</td>
      <td>{item.Address.Structured.City}</td>
      <td>
        {toCodeTableName(
          provinceStateTerritoryCT,
          item.Address.Structured.CountrySubDivisionCode
        )}
      </td>
      <td>
        {item.Address.Structured.PostalZipCode.PostalCode ||
          item.Address.Structured.PostalZipCode.ZipCode}
      </td>
      <td>{item.PhoneNumber[0].phoneNumber}</td>
      <td>{item.FaxNumber.phoneNumber}</td>
      <td>{item.EmailAddress}</td>
      <td>
        <button onClick={handleRemoveFromPatient}>Remove from patient</button>
      </td>
    </tr>
  );
};

export default FamilyDoctorItem;
