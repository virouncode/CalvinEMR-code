import React from "react";
import SignCellStaff from "../../Staff/Record/Topics/SignCellStaff";

const StaffAccountItem = ({
  staff,
  setEditVisible,
  id,
  setSelectedStaffId,
}) => {
  const handleEdit = () => {
    setSelectedStaffId(id);
    setEditVisible((v) => !v);
  };

  return (
    <tr style={{ color: staff.account_status === "Suspended" && "red" }}>
      <td>
        <div className="staff-result__item-btn-container">
          <button onClick={handleEdit}>Edit</button>
        </div>
      </td>
      <td>{staff.last_name}</td>
      <td>{staff.first_name}</td>
      <td>{staff.middle_name}</td>
      <td>{staff.site_infos.name}</td>
      <td>{staff.gender}</td>
      <td>{staff.email}</td>
      <td>{staff.cell_phone}</td>
      <td>{staff.backup_phone}</td>
      <td>{staff.title}</td>
      <td>{staff.speciality}</td>
      <td>{staff.subspeciality}</td>
      <td>{staff.licence_nbr}</td>
      <td>{staff.ohip_billing_nbr}</td>
      <td>{staff.account_status}</td>
      <SignCellStaff item={staff} />
    </tr>
  );
};

export default StaffAccountItem;
