import React from "react";
import { provinceStateTerritoryCT } from "../../../../../datas/codesTables";

const PharmacyCard = ({ datas, demographicsInfos }) => {
  return (
    <div className="pharmacies__card">
      <div className="pharmacies__card-row">
        <label>Name: </label>
        <p>
          {
            datas.find(({ id }) => id === demographicsInfos.PreferredPharmacy)
              ?.Name
          }
        </p>
      </div>
      <div className="pharmacies__card-row">
        <label>Address: </label>
        <p>
          {
            datas.find(({ id }) => id === demographicsInfos.PreferredPharmacy)
              ?.Address.Structured.Line1
          }
        </p>
      </div>
      <div className="pharmacies__card-row">
        <label>City: </label>
        <p>
          {
            datas.find(({ id }) => id === demographicsInfos.PreferredPharmacy)
              ?.Address.Structured.City
          }
        </p>
      </div>
      <div className="pharmacies__card-row">
        <label>Province/State: </label>
        <p>
          {
            provinceStateTerritoryCT.find(
              ({ code }) =>
                code ===
                datas.find(
                  ({ id }) => id === demographicsInfos.PreferredPharmacy
                )?.Address.Structured.CountrySubDivisionCode
            ).name
          }
        </p>
      </div>
      <div className="pharmacies__card-row">
        <label>Postal/Zip Code: </label>
        <p>
          {datas.find(({ id }) => id === demographicsInfos.PreferredPharmacy)
            ?.Address.Structured.PostalZipCode.PostalCode ||
            datas.find(({ id }) => id === demographicsInfos.PreferredPharmacy)
              ?.Address.Structured.PostalZipCode.ZipCode}
        </p>
      </div>
      <div className="pharmacies__card-row">
        <label>Phone: </label>
        <p>
          {
            datas.find(({ id }) => id === demographicsInfos.PreferredPharmacy)
              ?.PhoneNumber[0].phoneNumber
          }
        </p>
      </div>
      <div className="pharmacies__card-row">
        <label>Fax: </label>
        <p>
          {
            datas.find(({ id }) => id === demographicsInfos.PreferredPharmacy)
              ?.FaxNumber.phoneNumber
          }
        </p>
      </div>
      <div className="pharmacies__card-row">
        <label>Email: </label>
        <p>
          {
            datas.find(({ id }) => id === demographicsInfos.PreferredPharmacy)
              ?.EmailAddress
          }
        </p>
      </div>
    </div>
  );
};

export default PharmacyCard;
