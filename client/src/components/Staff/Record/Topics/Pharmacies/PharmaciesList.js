import React, { useEffect, useState } from "react";
import PharmacyForm from "./PharmacyForm";
import PharmacyItem from "./PharmacyItem";

const PharmaciesList = ({
  handleAddItemClick,
  datas,
  patientId,
  setErrMsgPost,
  errMsgPost,
  editCounter,
  demographicsInfos,
}) => {
  //HOOKS
  const [pharmaciesList, setPharmaciesList] = useState(null);
  const [addNew, setAddNew] = useState(false);

  useEffect(() => {
    setPharmaciesList(datas);
  }, [datas]);

  //HANDLERS
  const handleAddNewClick = () => {
    setAddNew((v) => !v);
  };

  return (
    <>
      <div className="pharmacies-list__title">
        Pharmacies database
        <button onClick={handleAddNewClick}>
          Add a new Pharmacy to database
        </button>
      </div>
      <table className="pharmacies-list__table">
        <thead>
          <tr>
            <th>Name</th>
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
            <PharmacyForm
              setPharmaciesList={setPharmaciesList}
              setAddNew={setAddNew}
              patientId={patientId}
              setErrMsgPost={setErrMsgPost}
              errMsgPost={errMsgPost}
            />
          )}
          {pharmaciesList &&
            pharmaciesList
              // .filter(({ id }) => _.findIndex(datas, { id: id }) === -1)
              .map((pharmacy) => (
                <PharmacyItem
                  key={pharmacy.id}
                  item={pharmacy}
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

export default PharmaciesList;
