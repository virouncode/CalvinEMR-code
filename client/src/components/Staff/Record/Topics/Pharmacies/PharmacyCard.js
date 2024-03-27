import React from "react";
import {
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../omdDatas/codesTables";

const PharmacyCard = ({ pharmacy, demographicsInfos }) => {
  return (
    <div className="pharmacies__card">
      <div className="pharmacies__card-row">
        <label>Name: </label>
        <p>{pharmacy.Name}</p>
      </div>
      <div className="pharmacies__card-row">
        <label>Address: </label>
        <p>{pharmacy?.Address?.Structured?.Line1}</p>
      </div>
      <div className="pharmacies__card-row">
        <label>City: </label>
        <p>{pharmacy.Address?.Structured?.City}</p>
      </div>
      <div className="pharmacies__card-row">
        <label>Province/State: </label>
        <p>
          {toCodeTableName(
            provinceStateTerritoryCT,
            pharmacy.Address?.Structured?.CountrySubDivisionCode
          )}
        </p>
      </div>
      <div className="pharmacies__card-row">
        <label>Postal/Zip Code: </label>
        <p>
          {pharmacy.Address?.Structured?.PostalZipCode?.PostalCode ||
            pharmacy.Address?.Structured?.PostalZipCode?.ZipCode}
        </p>
      </div>
      <div className="pharmacies__card-row">
        <label>Phone: </label>
        <p>{pharmacy.PhoneNumber?.[0]?.phoneNumber}</p>
      </div>
      <div className="pharmacies__card-row">
        <label>Fax: </label>
        <p>{pharmacy.FaxNumber?.phoneNumber}</p>
      </div>
      <div className="pharmacies__card-row">
        <label>Email: </label>
        <p>{pharmacy.EmailAddress}</p>
      </div>
    </div>
  );
};

export default PharmacyCard;
