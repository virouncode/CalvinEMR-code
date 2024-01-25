import React from "react";

const StaffResultItem = ({ staff, setEditVisible, id, setSelectedStaffId }) => {
  const handleEdit = () => {
    setSelectedStaffId(id);
    setEditVisible((v) => !v);
  };

  return (
    <tr>
      <td>{staff.last_name}</td>
      <td>{staff.first_name}</td>
      <td>{staff.middle_name}</td>
      <td>{staff.email}</td>
      <td>{staff.cell_phone}</td>
      <td>{staff.backup_phone}</td>
      <td>{staff.title}</td>
      <td>{staff.speciality}</td>
      <td>{staff.licence_nbr}</td>
      <td>{staff.ohip_billing_nbr || ""}</td>
      <td>
        <div className="staff-result__item-btn-container">
          <button onClick={handleEdit}>Edit</button>
        </div>
      </td>
    </tr>
  );
};

export default StaffResultItem;
