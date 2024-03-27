import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import useSitesSocket from "../../../hooks/socket/useSitesSocket";
import useFetchDatas from "../../../hooks/useFetchDatas";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { clinicSchema } from "../../../validation/clinic/clinicValidation";
import FakeWindow from "../../UI/Windows/FakeWindow";
import SiteEdit from "./SiteEdit";
import SiteForm from "./SiteForm";
import SitesTable from "./SitesTable";

const ClinicInfos = () => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [sites, setSites, loading, errMsg] = useFetchDatas("/sites", "admin");
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editClinicVisible, setEditClinicVisible] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState();
  const { clinic } = useClinicContext();
  const [formDatas, setFormDatas] = useState(clinic);
  const [errMsgPost, setErrMsgPost] = useState("");

  useSitesSocket(sites, setSites);

  const handleAddNew = (e) => {
    setAddVisible(true);
  };
  const handleEditClick = (e, siteId) => {
    e.preventDefault();
    setSelectedSiteId(siteId);
    setEditVisible(true);
  };

  const handleEditClinic = () => {
    setEditClinicVisible(true);
  };

  const handleCancelClinic = () => {
    setEditClinicVisible(false);
  };
  const handleSaveClinic = async () => {
    try {
      await clinicSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    try {
      setErrMsgPost("");
      let websiteFormatted = formDatas.website;
      if (
        !formDatas.website.includes("http") ||
        !formDatas.website.includes("https")
      ) {
        websiteFormatted = ["https://", formDatas.website].join("");
      }
      const datasToPut = {
        ...formDatas,
        website: websiteFormatted,
        updates: [
          ...formDatas.updates,
          { updated_by_id: user.id, date_updated: nowTZTimestamp() },
        ],
      };
      const response = await xanoPut(
        `/clinic/${clinic.id}`,
        "admin",
        datasToPut
      );
      socket.emit("message", {
        route: "CLINIC",
        action: "update",
        content: {
          id: clinic.id,
          data: response.data,
        },
      });
      toast.success(`Clinic infos changed successfully`, { containerId: "A" });
      setEditClinicVisible(false);
    } catch (err) {
      toast.error(`Unable to change clinic infos: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };

  return (
    <>
      <div className="clinic__global-infos">
        <span className="clinic__global-infos-title">Global infos</span>
        <label htmlFor="">Name: </label>
        {editClinicVisible ? (
          <input
            type="text"
            value={formDatas.name}
            onChange={handleChange}
            name="name"
          />
        ) : (
          <p>{clinic.name}</p>
        )}
        <label htmlFor="">Email: </label>
        {editClinicVisible ? (
          <input
            type="email"
            value={formDatas.email}
            onChange={handleChange}
            name="email"
          />
        ) : (
          <p>{clinic.email}</p>
        )}
        <label htmlFor="">Website: </label>
        {editClinicVisible ? (
          <input
            type="text"
            value={formDatas.website}
            onChange={handleChange}
            name="website"
          />
        ) : (
          <p className="clinic__global-infos-link">
            <a href={clinic.website} target="_blank" rel="noreferrer">
              {clinic.website}
            </a>
          </p>
        )}
        <div className="clinic__global-infos-btn-container">
          {editClinicVisible ? (
            <>
              <button onClick={handleSaveClinic}>Save</button>
              <button onClick={handleCancelClinic}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={handleEditClinic}>Edit</button>
            </>
          )}
        </div>
      </div>
      {errMsgPost && <p className="clinic__global-infos-err">{errMsgPost}</p>}
      <div className="clinic__subtitle">
        <span>Sites</span>
        <button onClick={handleAddNew}>New site</button>
      </div>
      <SitesTable
        sites={sites}
        loading={loading}
        errMsg={errMsg}
        handleEditClick={handleEditClick}
      />
      {addVisible && (
        <FakeWindow
          title="ADD A NEW SITE"
          width={1000}
          height={550}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#94bae8"
          setPopUpVisible={setAddVisible}
        >
          <SiteForm setAddVisible={setAddVisible} />
        </FakeWindow>
      )}
      {editVisible && (
        <FakeWindow
          title={`EDIT ${sites
            .find(({ id }) => id === selectedSiteId)
            .name.toUpperCase()} Site`}
          width={1000}
          height={600}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setEditVisible}
        >
          <SiteEdit
            infos={sites.find(({ id }) => id === selectedSiteId)}
            setEditVisible={setEditVisible}
            handleEditClick={handleEditClick}
            editVisible={editVisible}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default ClinicInfos;
