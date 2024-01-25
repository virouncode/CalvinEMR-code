import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { staffIdToTitleAndName } from "../../utils/staffIdToTitleAndName";
import FakeWindow from "../All/UI/Windows/FakeWindow";
import SignupStaffForm from "./SignupStaffForm";
import StaffAccountForm from "./StaffAccountForm";
import StaffSearchForm from "./StaffSearchForm";
import StaffSearchResults from "./StaffSearchResults";

const StaffAccounts = () => {
  const direction = useRef(false);
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

  const handleSort = (columnName) => {
    const sortedStaffInfosUpdated = [...sortedStaffInfos];
    direction.current = !direction.current;

    direction.current
      ? sortedStaffInfosUpdated.sort((a, b) =>
          a[columnName]?.toString().localeCompare(b[columnName]?.toString())
        )
      : sortedStaffInfosUpdated.sort((a, b) =>
          b[columnName]?.toString().localeCompare(a[columnName]?.toString())
        );

    setSortedStaffInfos(sortedStaffInfosUpdated);
  };

  return (
    sortedStaffInfos && (
      <>
        <StaffSearchForm search={search} setSearch={setSearch} />
        <StaffSearchResults
          search={search}
          sortedStaffInfos={sortedStaffInfos}
          handleSort={handleSort}
          setEditVisible={setEditVisible}
          setSelectedStaffId={setSelectedStaffId}
          setAddVisible={setAddVisible}
        />
        {editVisible && (
          <FakeWindow
            title={`EDIT ${staffIdToTitleAndName(
              clinic.staffInfos,
              selectedStaffId
            )} infos`}
            width={1000}
            height={500}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 500) / 2}
            color="#94bae8"
            setPopUpVisible={setEditVisible}
            closeCross={false}
          >
            <StaffAccountForm
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
            closeCross={false}
          >
            <SignupStaffForm setAddVisible={setAddVisible} />
          </FakeWindow>
        )}
      </>
    )
  );
};

export default StaffAccounts;
