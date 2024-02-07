import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoAdmin } from "../../../api/xanoAdmin";
import useAuth from "../../../hooks/useAuth";
import { onMessageSites } from "../../../utils/socketHandlers/onMessageSites";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import SiteEdit from "./SiteEdit";
import SiteForm from "./SiteForm";
import SitesTable from "./SitesTable";

const Clinic = () => {
  const { auth, socket } = useAuth();
  const [sites, setSites] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState();

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) => onMessageSites(message, sites, setSites);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [sites, socket]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchSites = async () => {
      try {
        setIsLoading(true);
        const response = await axiosXanoAdmin.get("/sites", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          signal: abortController.signal,
        });
        setIsLoading(false);
        if (abortController.signal.aborted) return;
        setSites(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        setIsLoading(false);
        toast.error(`Error: unable to get clinic sites: ${err.message}`, {
          containerId: "A",
        });
      }
    };
    fetchSites();
    return () => abortController.abort();
  }, [auth.authToken]);

  const handleAddNew = (e) => {
    setAddVisible(true);
  };
  const handleEditClick = (e, siteId) => {
    e.preventDefault();
    setSelectedSiteId(siteId);
    setEditVisible(true);
  };

  return (
    <>
      <div className="clinic__btn-container">
        <button onClick={handleAddNew} style={{ marginBottom: "20px" }}>
          New site
        </button>
      </div>
      <div className="clinic__subtitle">All Sites</div>
      {!isLoading ? (
        sites && <SitesTable sites={sites} handleEditClick={handleEditClick} />
      ) : (
        <CircularProgress size="1rem" style={{ margin: "5px" }} />
      )}

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
          height={550}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#94bae8"
          setPopUpVisible={setEditVisible}
        >
          <SiteEdit
            infos={sites.find(({ id }) => id === selectedSiteId)}
            setEditVisible={setEditVisible}
            handleEditClick={handleEditClick}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default Clinic;
