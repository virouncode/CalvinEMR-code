import React from "react";
import { toLocalDate } from "../../../../utils/formatDates";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";

const SignCell = ({ item, staffInfos }) => {
  return (
    <>
      <td>
        <em>
          {isUpdated(item)
            ? staffIdToTitleAndName(
                staffInfos,
                getLastUpdate(item).updated_by_id,
                true
              )
            : staffIdToTitleAndName(staffInfos, item.created_by_id, true)}
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

export default SignCell;
