import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../datas/codesTables";
import useAuthContext from "../../../hooks/useAuthContext";
import { adminIdToName } from "../../../utils/adminIdToName";
import { toLocalDate } from "../../../utils/formatDates";
import { showDocument } from "../../../utils/showDocument";
import {
  getLastUpdate,
  isUpdated,
} from "../../../utils/socketHandlers/updates";

const SiteItem = ({ site, handleEditClick }) => {
  const { clinic } = useAuthContext();

  const handleClickLogo = (e) => {
    showDocument(site.logo?.url, site.logo?.mime);
  };

  return (
    <>
      <tr>
        <td>{site.name || ""}</td>
        <td>{site.address || ""}</td>
        <td>{site.postal_code || ""}</td>
        <td>
          {toCodeTableName(provinceStateTerritoryCT, site.province_state) || ""}
        </td>
        <td>{site.city || ""}</td>
        <td>{site.phone || ""}</td>
        <td>{site.fax || ""}</td>
        <td
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
          onClick={handleClickLogo}
        >
          {site.logo?.name || ""}
        </td>
        <td>
          {site.rooms
            .filter(({ id }) => id !== "z")
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(({ title }) => title)
            .join(", ")}
        </td>
        <td>
          {isUpdated(site)
            ? adminIdToName(
                clinic.adminsInfos,
                getLastUpdate(site).updated_by_id
              )
            : adminIdToName(clinic.adminsInfos, site.created_by_id)}
        </td>
        <td>
          {isUpdated(site)
            ? toLocalDate(getLastUpdate(site).date_updated)
            : toLocalDate(site.date_created)}
        </td>
        <td>
          <div className="site-item__btn-container">
            <button onClick={(e) => handleEditClick(e, site.id)}>Edit</button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default SiteItem;
