import { CircularProgress } from "@mui/material";
import React from "react";

const PharmaciesContent = ({ datas, demographicsInfos, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      datas && (
        <div className="topic-content">
          <label style={{ fontWeight: "bold" }}>Preferred Pharmacy</label>
          {datas.find(({ id }) => id === demographicsInfos.PreferredPharmacy)
            ?.Name ? (
            <span>
              {
                datas.find(
                  ({ id }) => id === demographicsInfos.PreferredPharmacy
                )?.Name
              }{" "}
              ,
              {
                datas.find(
                  ({ id }) => id === demographicsInfos.PreferredPharmacy
                )?.Address?.Structured.Line1
              }
              ,{" "}
              {
                datas.find(
                  ({ id }) => id === demographicsInfos.PreferredPharmacy
                )?.Address?.Structured.City
              }
              ,{" "}
              {
                datas.find(
                  ({ id }) => id === demographicsInfos.PreferredPharmacy
                )?.Address?.Structured.CountrySubDivisionCode
              }
              ,{" "}
              {
                datas.find(
                  ({ id }) => id === demographicsInfos.PreferredPharmacy
                )?.PhoneNumber[0].phoneNumber
              }
            </span>
          ) : (
            "No pharmacies"
          )}
        </div>
      )
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default PharmaciesContent;
