import React from "react";
import { showDocument } from "../../../../../utils/showDocument";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const PrescriptionsContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length >= 1 ? (
          <ul>
            {topicDatas.slice(0, 4).map((item) => (
              <li
                key={item.id}
                onClick={() =>
                  showDocument(
                    item.attachment.file.url,
                    item.attachment.file.mime
                  )
                }
                style={{
                  textDecoration: "underline",
                  color: "#327AE6",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                - {item.attachment.alias}
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No prescriptions"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default PrescriptionsContent;
