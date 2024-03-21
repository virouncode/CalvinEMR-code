import React from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../../api/xanoCRUD/xanoPut";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { nowTZTimestamp } from "../../../../../utils/formatDates";
import SignCellMultipleTypes from "../SignCellMultipleTypes";

const ClinicDoctorItem = ({ item, patientId, site }) => {
  //HOOKS
  const { user } = useUserContext();
  const { socket } = useSocketContext();

  const handleAddToPatient = async (e) => {
    try {
      //Add patient to clinic doctor
      const datasToPut = {
        ...item,
        patients: [...item.patients, patientId],
        updates: [
          ...item.updates,
          {
            date_updated: nowTZTimestamp(),
            updated_by_id: user.id,
            updated_by_user_type: "staff",
          },
        ],
      };
      delete datasToPut.site_infos;
      const response = await xanoPut(`/staff/${item.id}`, "staff", datasToPut);
      socket.emit("message", {
        route: "STAFF INFOS",
        action: "update",
        content: { id: item.id, data: response.data },
      });

      // //Add doctor to patient doctors
      // socket.emit("message", {
      //   route: "PATIENT DOCTORS",
      //   action: "create",
      //   content: {
      //     data: {
      //       ...item,
      //       patients: [...item.patients, patientId],
      //     },
      //   },
      //   patientId,
      // });

      toast.success("Doctor added successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to add doctor:${err.message}`, {
        containerId: "B",
      });
    }
  };

  return (
    item && (
      <tr className="doctors__item">
        <td>
          <div className="doctors__item-btn-container">
            <button
              onClick={handleAddToPatient}
              disabled={item.patients.includes(patientId)}
            >
              Add to patient
            </button>
          </div>
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
        <SignCellMultipleTypes item={item} />
      </tr>
    )
  );
};

export default ClinicDoctorItem;
