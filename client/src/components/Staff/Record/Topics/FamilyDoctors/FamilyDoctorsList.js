import React, { useState } from "react";
import useIntersection from "../../../../../hooks/useIntersection";
import EmptyRow from "../../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../../All/UI/Tables/LoadingRow";
import FamilyDoctorForm from "./FamilyDoctorForm";
import FamilyDoctorListItem from "./FamilyDoctorListItem";

const FamilyDoctorsList = ({
  patientId,
  editCounter,
  doctors,
  loadingDoctors,
  errMsgDoctors,
  hasMoreDoctors,
  setPagingDoctors,
}) => {
  const [addVisible, setAddVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //INTERSECTION OBSERVER
  const { rootRef: rootRefDoctors, lastItemRef: lastItemRefDoctors } =
    useIntersection(loadingDoctors, hasMoreDoctors, setPagingDoctors);

  //HANDLERS
  const handleAdd = () => {
    setErrMsgPost("");
    editCounter.current += 1;
    setAddVisible((v) => !v);
  };

  return (
    <>
      <div className="doctors-list__title">
        External Doctors database
        <button onClick={handleAdd}>
          Add a new doctor to external doctors database
        </button>
      </div>
      {errMsgPost && <div className="doctors-list__err">{errMsgPost}</div>}
      {errMsgDoctors && (
        <div className="doctors-list__err">{errMsgDoctors}</div>
      )}
      {!errMsgDoctors && (
        <div className="doctors-list__table-container" ref={rootRefDoctors}>
          <table className="doctors-list__table">
            <thead>
              <tr>
                <th>Action</th>
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
              </tr>
            </thead>
            <tbody>
              {addVisible && (
                <FamilyDoctorForm
                  editCounter={editCounter}
                  setAddVisible={setAddVisible}
                  patientId={patientId}
                  setErrMsgPost={setErrMsgPost}
                  errMsgPost={errMsgPost}
                />
              )}
              {doctors && doctors.length > 0
                ? doctors.map((item, index) =>
                    index === doctors.length - 1 ? (
                      <FamilyDoctorListItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        patientId={patientId}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                        lastItemRef={lastItemRefDoctors}
                      />
                    ) : (
                      <FamilyDoctorListItem
                        item={item}
                        key={item.id}
                        editCounter={editCounter}
                        patientId={patientId}
                        setErrMsgPost={setErrMsgPost}
                        errMsgPost={errMsgPost}
                      />
                    )
                  )
                : !loadingDoctors &&
                  !addVisible && (
                    <EmptyRow colSpan="15" text="Doctors database empty" />
                  )}
              {loadingDoctors && <LoadingRow colSpan="15" />}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default FamilyDoctorsList;
