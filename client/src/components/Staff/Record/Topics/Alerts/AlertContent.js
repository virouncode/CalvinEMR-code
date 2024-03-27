import React from "react";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const AlertsContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length > 0 ? (
          <ul>
            {topicDatas.slice(0, 4).map((item) => (
              <li key={item.id}>
                - {item.AlertDescription}
                {item.Notes ? `: ${item.Notes}` : null}
              </li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No alerts"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default AlertsContent;
