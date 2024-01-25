import React, { useEffect, useState } from "react";
import FamilyDoctorForm from "./FamilyDoctorForm";
import FamilyDoctorListItem from "./FamilyDoctorListItem";

const FamilyDoctorsList = ({
  handleAddItemClick,
  patientId,
  setErrMsgPost,
  errMsgPost,
  editCounter,
  demographicsInfos,
  datas,
}) => {
  const [doctorsList, setDoctorsList] = useState(null);
  const [addNew, setAddNew] = useState(false);

  useEffect(() => {
    setDoctorsList(datas);
  }, [datas]);

  //HANDLERS
  const handleAddNewClick = () => {
    setAddNew((v) => !v);
  };

  return (
    <>
      <div className="doctors-list__title">
        Doctors database
        <button onClick={handleAddNewClick}>
          Add a new doctor to database
        </button>
      </div>
      <table className="doctors-list__table">
        <thead>
          <tr>
            <th>Last name</th>
            <th>First name</th>
            <th>Speciality</th>
            <th>Licence#</th>
            <th>OHIP#</th>
            <th>Address</th>
            <th>City</th>
            <th>Province/State</th>
            <th>Postal/Zip Code</th>
            <th>Phone</th>
            <th>Fax</th>
            <th>Email</th>
            <th>Updated By</th>
            <th>Updated On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {addNew && (
            <FamilyDoctorForm
              setDoctorsList={setDoctorsList}
              setAddNew={setAddNew}
              patientId={patientId}
              setErrMsgPost={setErrMsgPost}
              errMsgPost={errMsgPost}
            />
          )}
          {doctorsList &&
            doctorsList
              // .filter(({ id }) => _.findIndex(datas, { id: id }) === -1)
              .map((doctor) => (
                <FamilyDoctorListItem
                  key={doctor.id}
                  item={doctor}
                  handleAddItemClick={handleAddItemClick}
                  patientId={patientId}
                  setErrMsgPost={setErrMsgPost}
                  errMsgPost={errMsgPost}
                  editCounter={editCounter}
                  demographicsInfos={demographicsInfos}
                />
              ))}
        </tbody>
      </table>
    </>
  );
};

export default FamilyDoctorsList;
