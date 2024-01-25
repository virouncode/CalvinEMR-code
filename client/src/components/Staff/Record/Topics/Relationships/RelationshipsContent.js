import { CircularProgress } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";
import { patientIdToName } from "../../../../../utils/patientIdToName";

const RelationshipsContent = ({ datas, isLoading, errMsg }) => {
  const { clinic } = useAuth();
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas.map((item) => (
              <li key={item.id}>
                - {item.relationship} of{" "}
                <NavLink
                  to={`/patient-record/${item.relation_id}`}
                  className="topic-content__link"
                  target="_blank"
                >
                  {patientIdToName(clinic.demographicsInfos, item.relation_id)}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          "No relationships"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default RelationshipsContent;
