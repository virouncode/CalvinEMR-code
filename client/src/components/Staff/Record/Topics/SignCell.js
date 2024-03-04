import React from "react";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { toLocalDate } from "../../../../utils/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { getLastUpdate, isUpdated } from "../../../../utils/updates";

const SignCell = ({ item }) => {
  const { staffInfos } = useStaffInfosContext();
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
