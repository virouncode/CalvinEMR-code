import React from "react";
import useAdminsInfosContext from "../../../../hooks/useAdminsInfosContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { adminIdToName } from "../../../../utils/adminIdToName";
import { timestampToDateISOTZ } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { getLastUpdate, isUpdated } from "../../../../utils/updates";

const SignCellStaff = ({ item }) => {
  const { staffInfos } = useStaffInfosContext();
  const { adminsInfos } = useAdminsInfosContext();
  return (
    <>
      <td>
        <em>
          {isUpdated(item)
            ? getLastUpdate(item).updated_by_user_type === "Staff"
              ? staffIdToTitleAndName(
                  staffInfos,
                  getLastUpdate(item).updated_by_id
                )
              : adminIdToName(adminsInfos, getLastUpdate(item).updated_by_id)
            : adminIdToName(adminsInfos, item.created_by_id)}
        </em>
      </td>
      <td>
        <em>
          {isUpdated(item)
            ? timestampToDateISOTZ(
                getLastUpdate(item).date_updated,
                "America/Toronto"
              )
            : timestampToDateISOTZ(item.date_created, "America/Toronto")}
        </em>
      </td>
    </>
  );
};

export default SignCellStaff;
