import React from "react";
import { adminIdToName } from "../../../../utils/adminIdToName";
import { toLocalDate } from "../../../../utils/formatDates";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";

const SignCellStaff = ({ item, staffInfos, adminsInfos }) => {
  return (
    <>
      <td>
        <em>
          {isUpdated(item)
            ? getLastUpdate(item).updated_by_user_type === "Staff"
              ? staffIdToTitleAndName(
                  staffInfos,
                  getLastUpdate(item).updated_by_id,
                  true
                )
              : adminIdToName(
                  adminsInfos,
                  getLastUpdate(item).updated_by_id,
                  true
                )
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
