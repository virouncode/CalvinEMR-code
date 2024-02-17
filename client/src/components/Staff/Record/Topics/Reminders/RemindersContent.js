import React, { useEffect } from "react";
import { toast } from "react-toastify";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const RemindersContent = ({ datas, isLoading, errMsg }) => {
  useEffect(() => {
    if (datas) {
      datas.forEach((reminder) => {
        if (reminder.active)
          toast.info(reminder.reminder, { autoClose: 3000, containerId: "A" });
      });
    }
  }, [datas]);

  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas.filter((reminder) => reminder.active).length
              ? datas
                  .filter((reminder) => reminder.active)
                  .sort((a, b) => b.date_created - a.date_created)
                  .map((reminder) => (
                    <li key={reminder.id}>- {reminder.reminder}</li>
                  ))
              : "No active reminder"}
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
