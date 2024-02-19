import React, { useEffect } from "react";
import { toast } from "react-toastify";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const RemindersContent = ({ topicDatas, loading, errMsg }) => {
  useEffect(() => {
    if (topicDatas) {
      topicDatas.forEach((reminder) => {
        if (reminder.active)
          toast.info(reminder.reminder, { autoClose: 3000, containerId: "A" });
      });
    }
  }, [topicDatas]);

  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length > 0 ? (
          <ul>
            {topicDatas.slice(0, 4).map((item) => (
              <li key={item.id}>- {item.reminder}</li>
            ))}
            <li>...</li>
          </ul>
        ) : (
          "No reminders"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default RemindersContent;
