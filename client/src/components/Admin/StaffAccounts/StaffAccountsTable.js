import { CircularProgress } from "@mui/material";
import React from "react";
import StaffAccountItem from "./StaffAccountItem";

const StaffAccountsTable = ({
  search,
  sortedStaffInfos,
  setEditVisible,
  setSelectedStaffId,
}) => {
  return sortedStaffInfos ? (
    <div className="staff-result">
      <table>
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Cell phone</th>
            <th>Backup phone</th>
            <th>Occupation</th>
            <th>Speciality</th>
            <th>Licence#</th>
            <th>OHIP#</th>
            <th>Account status</th>
            <th>Updated by</th>
            <th>Updated on</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedStaffInfos
            .filter(
              (staff) =>
                staff.full_name
                  ?.toLowerCase()
                  .includes(search.name.toLowerCase()) &&
                staff.email
                  ?.toLowerCase()
                  .includes(search.email.toLowerCase()) &&
                (staff.cell_phone
                  ?.toLowerCase()
                  .includes(search.phone.toLowerCase()) ||
                  staff.backup_phone
                    ?.toLowerCase()
                    .includes(search.phone.toLowerCase())) &&
                staff.title
                  ?.toLowerCase()
                  .includes(search.title.toLowerCase()) &&
                staff.speciality
                  ?.toLowerCase()
                  .includes(search.speciality.toLowerCase()) &&
                staff.licence_nbr?.includes(search.licence_nbr) &&
                staff.ohip_billing_nbr
                  ?.toString()
                  .includes(search.ohip_billing_nbr)
            )

            .map((staff) => (
              <StaffAccountItem
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

export default StaffAccountsTable;
