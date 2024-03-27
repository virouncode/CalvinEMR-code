import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";
import { nowTZTimestamp } from "../../../../../utils/dates/formatDates";

const PatientClinicDoctorItem = ({ item, patientId, site }) => {
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
      const response = await xanoPut(`/staff/${item.id}`, "staff", datasToPut);
      socket.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: {
          id: item.id,
          data: response.data,
        },
      });
      // socket.emit("message", {
      //   route: "PATIENT DOCTORS",
      //   action: "delete",
      //   content: {
      //     id: item.id,
      //   },
      //   patientId,
      // });
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
    site && (
      <tr className="doctors__item">
        <td>
          <button onClick={handleRemoveFromPatient} disabled={progress}>
            Remove from patient
          </button>
        </td>
        <td>{item.last_name}</td>
        <td>{item.first_name}</td>
        <td>{item.speciality}</td>
        <td>{item.licence_nbr}</td>
        <td>{item.ohip_billing_nbr}</td>
        <td>{site.address}</td>
        <td>{site.city}</td>
        <td>
          {toCodeTableName(provinceStateTerritoryCT, site.province_state)}
        </td>
        <td className="td--postal">{site.postal_code || site.zip_code}</td>
        <td>{site.phone}</td>
        <td>{site.fax}</td>
        <td>{site.email}</td>
      </tr>
    )
  );
};

export default PatientClinicDoctorItem;
