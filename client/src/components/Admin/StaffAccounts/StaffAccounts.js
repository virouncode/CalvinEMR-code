import React, { useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useFetchDatas from "../../../hooks/useFetchDatas";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import FakeWindow from "../../UI/Windows/FakeWindow";
import SignupStaffForm from "./SignupStaffForm";
import StaffAccountEdit from "./StaffAccountEdit";
import StaffAccountSearch from "./StaffAccountSearch";
import StaffAccountsTable from "./StaffAccountsTable";

const StaffAccounts = () => {
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState();
  const [search, setSearch] = useState({
    email: "",
    name: "",
    title: "",
    speciality: "",
    subspeciality: "",
    phone: "",
    licence_nbr: "",
    ohip_billing_nbr: "",
    site_id: -1,
  });
  const [sites] = useFetchDatas("/sites", "admin");

  const handleAddNew = () => {
    setAddVisible((v) => !v);
  };

  return (
    staffInfos && (
      <>
        <StaffAccountSearch
          search={search}
          setSearch={setSearch}
          sites={sites}
        />
        <div className="staff-result__btn-container">
          <button onClick={handleAddNew} style={{ marginBottom: "20px" }}>
            New staff account
          </button>
        </div>
        <StaffAccountsTable
          search={search}
          staffInfos={staffInfos}
          setEditVisible={setEditVisible}
          setSelectedStaffId={setSelectedStaffId}
        />
        {editVisible && (
          <FakeWindow
            title={`EDIT ${staffIdToTitleAndName(
              staffInfos,
              selectedStaffId,
              false
            ).toUpperCase()} Account`}
            width={1000}
            height={550}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 550) / 2}
            color="#94bae8"
            setPopUpVisible={setEditVisible}
          >
            <StaffAccountEdit
              infos={staffInfos.find(({ id }) => id === selectedStaffId)}
              setEditVisible={setEditVisible}
              editVisible={editVisible}
              sites={sites}
            />
          </FakeWindow>
        )}
        {addVisible && (
          <FakeWindow
            title="ADD A NEW USER ACCOUNT"
            width={1000}
            height={550}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 550) / 2}
            color="#94bae8"
            setPopUpVisible={setAddVisible}
          >
            <SignupStaffForm setAddVisible={setAddVisible} sites={sites} />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default StaffAccounts;
