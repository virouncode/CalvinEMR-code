import React from "react";
import useStaffInfosContext from "../../../../hooks/useStaffInfosContext";
import { timestampToDateISOTZ } from "../../../../utils/formatDates";
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
                getLastUpdate(item).updated_by_id
              )
            : staffIdToTitleAndName(staffInfos, item.created_by_id)}
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

export default SignCell;
