import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useClinicContext from "../../../../../hooks/useClinicContext";
import useFetchDatas from "../../../../../hooks/useFetchDatas";
import useUserContext from "../../../../../hooks/useUserContext";
import { copyToClipboard } from "../../../../../utils/copyToClipboard";
import { isObjectEmpty } from "../../../../../utils/isObjectEmpty";
import SelectSite from "../../../EventForm/SelectSite";

const ClinicSiteLabel = ({ demographicsInfos, windowRef }) => {
  const { user } = useUserContext();
  const { clinic } = useClinicContext();
  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };
  const [assignedMd] = useFetchDatas(
    `/staff/${demographicsInfos.assigned_staff_id}`,
    "staff",
    null,
    null,
    true
  );
  const [site, setSite] = useState({ id: 0 });
  const [sites] = useFetchDatas("/sites", user.access_level.toLowerCase());
  const labelRef = useRef(null);

  useEffect(() => {
    if (sites.length === 0) return;
    setSite(sites.find(({ id }) => id === assignedMd.site_id));
  }, [assignedMd.site_id, sites]);

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
    fontSize: "1.1rem",
    fontWeight: "bold",
    textDecoration: "underline",
    padding: "0px 10px",
  };
  const LINE_STYLE = {
    fontSize: "0.8rem",
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
        <SelectSite
          handleSiteChange={handleSiteChange}
          sites={sites}
          value={site?.id}
        />
      </div>

      {!isObjectEmpty(site) &&
        !isObjectEmpty(assignedMd) &&
        sites.length > 0 && (
          <div style={LABEL_STYLE} ref={labelRef}>
            <p style={TITLE_STYLE}>{clinic.name.toUpperCase()}</p>
            <p style={LINE_STYLE}>
              <span>SITE: {site.name}</span>
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
        <button onClick={handleCopy} className="labels-content__print-btn">
          Copy to clipboard
        </button>
      </div>
    </div>
  );
};

export default ClinicSiteLabel;
