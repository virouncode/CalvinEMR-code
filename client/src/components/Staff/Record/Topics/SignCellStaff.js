import React from "react";
import useAdminsInfosContext from "../../../../hooks/useAdminsInfosContext";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { adminIdToName } from "../../../../utils/adminIdToName";
import { toLocalDate } from "../../../../utils/formatDates";
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
            : adminIdToName(adminsInfos, item.created_by_id, true)}
        </em>
      </td>
      <td>
        <em>
          {isUpdated(item)
            ? toLocalDate(getLastUpdate(item).date_updated)
            : toLocalDate(item.date_created)}
        </em>
      </td>
    </>
  );
};

export default SignCellStaff;
