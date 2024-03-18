import React from "react";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import { timestampToDateISOTZ } from "../../../../../utils/formatDates";
import { showDocument } from "../../../../../utils/showDocument";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";

const PrescriptionItem = ({ item, lastItemRef = null }) => {
  const { staffInfos } = useStaffInfosContext();
  return (
    <tr className="prescriptions__item" ref={lastItemRef}>
      <td
        className="prescriptions__link"
        onClick={() =>
          showDocument(item.attachment.file.url, item.attachment.file.mime)
        }
      >
        {item.attachment.alias}
      </td>
      <td>
        <em>
          {staffIdToTitleAndName(staffInfos, item.attachment.created_by_id)}
        </em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(item.attachment.date_created)}</em>
      </td>
    </tr>
  );
};

export default PrescriptionItem;
