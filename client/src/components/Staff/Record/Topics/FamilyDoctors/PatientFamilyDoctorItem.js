import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../../api/xanoCRUD/xanoPut";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { nowTZTimestamp } from "../../../../../utils/formatDates";

const PatientFamilyDoctorItem = ({ item, patientId, lastItemRef = null }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [progress, setProgress] = useState(false);

  const handleRemoveFromPatient = async (e) => {
    try {
      setProgress(true);
      const datasToPut = {
        ...item,
        patients: item.patients.filter((id) => id !== patientId),
        updates: [
          ...item.updates,
          {
            date_updated: nowTZTimestamp(),
            updated_by_id: user.id,
            updated_by_user_type: "staff",
          },
        ],
      };
      const response = await xanoPut(
        `/doctors/${item.id}`,
        "staff",
        datasToPut
      );
      socket.emit("message", {
        route: "FAMILY DOCTORS/SPECIALISTS",
        action: "update",
        content: {
          id: item.id,
          data: response.data,
        },
      });
      socket.emit("message", {
        route: "PATIENT DOCTORS",
        action: "delete",
        content: {
          id: item.id,
        },
        patientId,
      });
      toast.success("Removed successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to update doctor:${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
    }
  };

  return (
    <tr className="doctors__item" ref={lastItemRef}>
      <td>
        <button onClick={handleRemoveFromPatient} disabled={progress}>
          Remove from patient
        </button>
      </td>
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
    </tr>
  );
};

export default PatientFamilyDoctorItem;
