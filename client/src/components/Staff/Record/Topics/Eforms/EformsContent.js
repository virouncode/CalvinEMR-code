import React from "react";
import { toLocalDate } from "../../../../../utils/formatDates";
import { showDocument } from "../../../../../utils/showDocument";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const EformsContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length > 0 ? (
          <ul>
            {topicDatas.slice(0, 4).map((item) => (
              <li
                key={item.id}
                onClick={() => showDocument(item.file.url, item.file.mime)}
                className="topic-content__link"
              >
                - {item.name} ({toLocalDate(item.date_created)})
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No E-forms"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default EformsContent;
