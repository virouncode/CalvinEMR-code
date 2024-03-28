import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useClinicContext from "../../../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import useFetchDatas from "../../../../../hooks/useFetchDatas";
import { copyToClipboard } from "../../../../../utils/js/copyToClipboard";
import { isObjectEmpty } from "../../../../../utils/js/isObjectEmpty";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import SiteSelect from "../../../EventForm/SiteSelect";

const MdLabel = ({ demographicsInfos, windowRef }) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const { clinic } = useClinicContext();
  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };
  const [site, setSite] = useState({});
  const [sites] = useFetchDatas("/sites", user.access_level.toLowerCase());
  const [mdId, setMdId] = useState(user.id);
  const [md, setMd] = useState(user);
  const labelRef = useRef(null);

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
    fontSize: "1rem",
    fontWeight: "bold",
    textDecoration: "underline",
    padding: "0px 10px",
  };
  const LINE_STYLE = {
    fontSize: "0.7rem",
    padding: "0px 10px",
  };
  const SPAN_STYLE = {
    marginRight: "20px",
  };
  const SELECT_STYLE = {
    fontFamily: "Arial, sans-serif",
    fontSize: "0.8rem",
  };
  const BTN_STYLE = {
    marginRight: "5px",
  };

  const handleSiteChange = (e) => {
    const value = parseInt(e.target.value);
    setSite(sites.find(({ id }) => id === value));
  };
  const handleChangeMd = (e) => {
    const value = parseInt(e.target.value);
    setMdId(value);
    setMd(staffInfos.find(({ id }) => id === value));
  };
  const handleCopy = async () => {
    try {
      await copyToClipboard(windowRef.current, labelRef.current);
      toast.success("Copied !", { containerId: "A" });
    } catch (err) {
      toast.error(`Unable to copy label: ${err.message}`, { containerId: "A" });
    }
  };

  return (
    <div style={LABEL_CONTAINER}>
      <div className="labels-content__select" style={SELECT_STYLE}>
        <label
          style={{
            fontWeight: "bold",
            fontSize: "0.8rem",
            marginRight: "10px",
          }}
        >
          Practitioner{" "}
        </label>
        <select
          style={{
            marginRight: "10px",
          }}
          value={mdId}
          onChange={handleChangeMd}
        >
          {staffInfos
            .filter(({ title }) => title === "Doctor")
            .map((staff) => (
              <option value={staff.id} key={staff.id}>
                {staffIdToTitleAndName(staffInfos, staff.id)}
              </option>
            ))}
        </select>
        <SiteSelect
          handleSiteChange={handleSiteChange}
          sites={sites}
          value={site.id}
        />
      </div>
      {!isObjectEmpty(site) && sites.length > 0 && (
        <div style={LABEL_STYLE} ref={labelRef}>
          <p style={TITLE_STYLE}>
            {staffIdToTitleAndName(staffInfos, md.id, false).toUpperCase()}
          </p>
          <p style={LINE_STYLE}>
            <span style={SPAN_STYLE}>CPSO: {md.licence_nbr}</span>
            <span style={SPAN_STYLE}>OHIP: {md.ohip_billing_nbr}</span>
          </p>
          <p style={LINE_STYLE}>CLINIC: {clinic.name}</p>
          <p style={LINE_STYLE}>
            <span style={SPAN_STYLE}>SITE: {site.name}</span>
          </p>
          <p style={LINE_STYLE}>
            <span>
              ADDRESS: {site.address}, {site.city}, {site.province_state},{" "}
              {site.postal_code || site.zipCode}
            </span>
          </p>
          <p style={LINE_STYLE}>
            <span style={SPAN_STYLE}>PHONE: {site.phone}</span>
            <span style={SPAN_STYLE}>FAX: {site.fax}</span>
          </p>
          <p style={LINE_STYLE}>
            <span>EMAIL: {site.email || clinic.email}</span>
          </p>
          <p style={LINE_STYLE}>
            <span>WEBSITE: {clinic.website}</span>
          </p>
        </div>
      )}
      <div>
        <button
          style={BTN_STYLE}
          onClick={handlePrint}
          className="labels-content__print-btn"
        >
          Print
        </button>
        <button
          style={BTN_STYLE}
          onClick={handleCopy}
          className="labels-content__print-btn"
        >
          Copy to clipboard
        </button>
      </div>
    </div>
  );
};

export default MdLabel;
