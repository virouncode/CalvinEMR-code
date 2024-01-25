import { CircularProgress } from "@mui/material";
import React from "react";
import StaffResultItem from "./StaffResultItem";

const StaffSearchResults = ({
  search,
  sortedStaffInfos,
  handleSort,
  setEditVisible,
  setSelectedStaffId,
  setAddVisible,
}) => {
  const handleAddNew = () => {
    setAddVisible((v) => !v);
  };

  return sortedStaffInfos ? (
    <div className="staff-result">
      <button onClick={handleAddNew} style={{ marginBottom: "20px" }}>
        Add a new account
      </button>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("last_name")}>Last Name</th>
            <th onClick={() => handleSort("first_name")}>First Name</th>
            <th onClick={() => handleSort("middle_name")}>Middle Name</th>
            <th onClick={() => handleSort("email")}>Email</th>
            <th onClick={() => handleSort("cell_phone")}>Cell phone</th>
            <th onClick={() => handleSort("backup_phone")}>Backup phone</th>
            <th onClick={() => handleSort("title")}>Occupation</th>
            <th onClick={() => handleSort("speciality")}>Speciality</th>
            <th onClick={() => handleSort("licence_nbr")}>Licence#</th>
            <th onClick={() => handleSort("ohip_billig_nbr")}>OHIP#</th>
            <th style={{ textDecoration: "none" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedStaffInfos
            .filter(
              (staff) =>
                staff.full_name
                  .toLowerCase()
                  .includes(search.name.toLowerCase()) &&
                staff.email
                  .toLowerCase()
                  .includes(search.email.toLowerCase()) &&
                (staff.cell_phone
                  .toLowerCase()
                  .includes(search.phone.toLowerCase()) ||
                  staff.backup_phone
                    .toLowerCase()
                    .includes(search.phone.toLowerCase())) &&
                staff.title
                  .toLowerCase()
                  .includes(search.title.toLowerCase()) &&
                staff.speciality
                  .toLowerCase()
                  .includes(search.speciality.toLowerCase()) &&
                staff.licence_nbr.includes(search.licence_nbr) &&
                staff.ohip_billing_nbr
                  .toString()
                  .includes(search.ohip_billing_nbr)
            )

            .map((staff) => (
              <StaffResultItem
                staff={staff}
                key={staff.id}
                setEditVisible={setEditVisible}
                setSelectedStaffId={setSelectedStaffId}
                id={staff.id}
              />
            ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default StaffSearchResults;
