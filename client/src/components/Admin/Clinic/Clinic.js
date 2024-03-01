import React, { useState } from "react";
import { axiosXanoAdmin } from "../../../api/xanoAdmin";
import useAuthContext from "../../../hooks/useAuthContext";
import useFetchDatas from "../../../hooks/useFetchDatas";
import useSitesSocket from "../../../hooks/useSitesSocket";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import SiteEdit from "./SiteEdit";
import SiteForm from "./SiteForm";
import SitesTable from "./SitesTable";

const Clinic = () => {
  const { auth } = useAuthContext();
  const [sites, setSites, loading, errMsg] = useFetchDatas(
    "/sites",
    axiosXanoAdmin,
    auth.authToken
  );
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState();

  useSitesSocket(sites, setSites);

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
