import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../omdDatas/codesTables";
import { showDocument } from "../../../utils/files/showDocument";
import SignCell from "../../Staff/Record/Topics/SignCell";

const SiteItem = ({ site, handleEditClick }) => {
  const handleClickLogo = (e) => {
    showDocument(site.logo?.url, site.logo?.mime);
  };

  return (
    <>
      <tr>
        <td>
          <div className="site-item__btn-container">
            <button onClick={(e) => handleEditClick(e, site.id)}>Edit</button>
          </div>
        </td>
        <td>{site.name || ""}</td>
        <td>{site.address || ""}</td>
        <td>{site.city || ""}</td>
        <td>
          {toCodeTableName(provinceStateTerritoryCT, site.province_state) || ""}
        </td>
        <td>{site.postal_code || site.zip_code || ""}</td>
        <td>{site.phone || ""}</td>
        <td>{site.fax || ""}</td>
        <td>{site.email || ""}</td>
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
        <SignCell item={site} />
      </tr>
    </>
  );
};

export default SiteItem;
