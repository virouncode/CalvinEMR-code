import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../datas/codesTables";
import useAuth from "../../../hooks/useAuth";
import { adminIdToName } from "../../../utils/adminIdToName";
import { toLocalDate } from "../../../utils/formatDates";
import {
  getLastUpdate,
  isUpdated,
} from "../../../utils/socketHandlers/updates";

const SiteItem = ({ site, handleEditClick }) => {
  const { clinic } = useAuth();

  const handleClickLogo = (e) => {
    showDocument(site.logo?.url, site.logo?.mime);
  };

  const showDocument = async (docUrl, docMime) => {
    let docWindow;
    if (!docMime.includes("officedocument")) {
      docWindow = window.open(
        docUrl,
        "_blank",
        "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
      );
    } else {
      docWindow = window.open(
        `https://docs.google.com/gview?url=${docUrl}`,
        "_blank",
        "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
      );
    }

    if (docWindow === null) {
      alert("Please disable your browser pop-up blocker and sign in again");
      window.location.assign("/login");
      return;
    }
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
