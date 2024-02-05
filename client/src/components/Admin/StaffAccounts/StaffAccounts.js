import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import FakeWindow from "../../All/UI/Windows/FakeWindow";
import SignupStaffForm from "./SignupStaffForm";
import StaffAccountEdit from "./StaffAccountEdit";
import StaffAccountSearch from "./StaffAccountSearch";
import StaffAccountsTable from "./StaffAccountsTable";

const StaffAccounts = () => {
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState();
  const { clinic } = useAuth();
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    speciality: "",
    licence_nbr: "",
    ohip_billing_nbr: "",
  });
  const [sortedStaffInfos, setSortedStaffInfos] = useState(null);

  useEffect(() => {
    setSortedStaffInfos(clinic.staffInfos);
  }, [clinic.staffInfos]);

  const handleAddNew = () => {
    setAddVisible((v) => !v);
  };

  return (
    sortedStaffInfos && (
      <>
        <StaffAccountSearch search={search} setSearch={setSearch} />
        <div className="staff-result__btn-container">
          <button onClick={handleAddNew} style={{ marginBottom: "20px" }}>
            New staff account
          </button>
        </div>
        <StaffAccountsTable
          search={search}
          sortedStaffInfos={sortedStaffInfos}
          setEditVisible={setEditVisible}
          setSelectedStaffId={setSelectedStaffId}
        />
        {editVisible && (
          <FakeWindow
            title={`EDIT ${staffIdToTitleAndName(
              clinic.staffInfos,
              selectedStaffId
            ).toUpperCase()} Account`}
            width={1000}
            height={500}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 500) / 2}
            color="#94bae8"
            setPopUpVisible={setEditVisible}
          >
            <StaffAccountEdit
              infos={clinic.staffInfos.find(({ id }) => id === selectedStaffId)}
              setEditVisible={setEditVisible}
            />
          </FakeWindow>
        )}
        {addVisible && (
          <FakeWindow
            title="ADD A NEW USER ACCOUNT"
            width={1000}
            height={500}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 500) / 2}
            color="#94bae8"
            setPopUpVisible={setAddVisible}
          >
            <SignupStaffForm setAddVisible={setAddVisible} />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default StaffAccounts;
