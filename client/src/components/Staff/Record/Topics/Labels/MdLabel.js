import React, { useEffect, useState } from "react";
import useClinicContext from "../../../../../hooks/useClinicContext";
import useFetchDatas from "../../../../../hooks/useFetchDatas";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { isObjectEmpty } from "../../../../../utils/isObjectEmpty";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import SelectSite from "../../../EventForm/SelectSite";

const MdLabel = ({ demographicsInfos }) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();
  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };
  const [site, setSite] = useState({});
  const [sites] = useFetchDatas("/sites", user.access_level.toLowerCase());

  useEffect(() => {
    if (sites.length === 0) return;
    setSite(sites.find(({ id }) => id === user.site_id));
  }, [sites, user.site_id]);

  const LABEL_CONTAINER = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flexDirection: "column",
  };
  const LABEL_STYLE = {
    fontFamily: "Arial, sans-serif",
    width: "11.86cm",
    height: "3.71cm",
    border: "solid 1px black",
    padding: "10px",
    marginTop: "20px",
    marginBottom: "20px",
  };
  const TITLE_STYLE = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    textDecoration: "underline",
    padding: "0px 10px",
  };
  const LINE_STYLE = {
    fontSize: "0.9rem",
    padding: "0px 10px",
  };
  const SPAN_STYLE = {
    marginRight: "20px",
  };
  const SELECT_STYLE = {
    fontFamily: "Arial, sans-serif",
    fontSize: "0.8rem",
  };
  const handleSiteChange = (e) => {
    const value = parseInt(e.target.value);
    setSite(sites.find(({ id }) => id === value));
  };

  return (
    <div style={LABEL_CONTAINER}>
      <div className="labels-content__select" style={SELECT_STYLE}>
        <SelectSite
          handleSiteChange={handleSiteChange}
          sites={sites}
          value={site.id}
        />
      </div>
      {!isObjectEmpty(site) && (
        <div style={LABEL_STYLE}>
          <p style={TITLE_STYLE}>
            {staffIdToTitleAndName(staffInfos, user.id, false)}
          </p>
          <p style={LINE_STYLE}>CLINIC: {clinic.name}</p>
          <p style={LINE_STYLE}>
            <span style={SPAN_STYLE}>SITE: {site.name}</span>
          </p>
          <p style={LINE_STYLE}>
            <span style={SPAN_STYLE}>
              ADDRESS: {site.address}, {site.city}, {site.province_state},{" "}
              {site.postal_code || site.zipCode}
            </span>
          </p>
          <p style={LINE_STYLE}>
            <span style={SPAN_STYLE}>PHONE: {site.phone}</span>
            <span style={SPAN_STYLE}>FAX: {site.fax}</span>
          </p>
          <p style={LINE_STYLE}>
            <span style={SPAN_STYLE}>EMAIL: {site.email}</span>
          </p>
          <p style={LINE_STYLE}>
            <span style={SPAN_STYLE}>CPSO: {user.licence_nbr}</span>
            <span style={SPAN_STYLE}>OHIP: {user.ohip_billig_nbr}</span>
          </p>
        </div>
      )}
      <div>
        <button onClick={handlePrint} className="labels-content__print-btn">
          Print
        </button>
      </div>
    </div>
  );
};

export default MdLabel;
