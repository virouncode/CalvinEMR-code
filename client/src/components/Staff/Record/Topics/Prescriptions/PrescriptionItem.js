import React from "react";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import { timestampToDateISOTZ } from "../../../../../utils/dates/formatDates";
import { showDocument } from "../../../../../utils/files/showDocument";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";

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
