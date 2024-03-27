import React from "react";
import { NavLink } from "react-router-dom";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const RelationshipsContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length > 0 ? (
          <ul>
            {topicDatas.slice(0, 4).map((item) => (
              <li key={item.id}>
                - {item.relationship} of{" "}
                <NavLink
                  to={`/staff/patient-record/${item.relation_id}`}
                  className="topic-content__link"
                  target="_blank"
                >
                  {toPatientName(item.relation_infos)}
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
    <CircularProgressMedium />
  );
};

export default RelationshipsContent;
