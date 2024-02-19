import React from "react";
import { NavLink } from "react-router-dom";
import useUserContext from "../../../../../hooks/useUserContext";
import { toLocalDate } from "../../../../../utils/formatDates";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const MessagesContent = ({ topicDatas, loading, errMsg }) => {
  const { user } = useUserContext();

  const getSection = (message) => {
    if (message.deleted_by_staff_ids.includes(user.id)) {
      return "Deleted messages";
    } else if (message.from_id === user.id) {
      //et le cas forward ???
      return "Sent messages";
    } else {
      return "Inbox";
    }
  };
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas &&
        topicDatas.filter(
          (message) =>
            message.from_id === user.id ||
            message.to_staff_ids.includes(user.id)
        ).length > 0 ? (
          <ul>
            {topicDatas
              .filter(
                (message) =>
                  message.from_id === user.id ||
                  message.to_staff_ids.includes(user.id)
              )
              .slice(0, 4)
              .map((message) => (
                <li className="topic-content__item" key={message.id}>
                  <div className="topic-content__overview">
                    <NavLink
                      className="topic-content__link"
                      to={`/messages/${message.id}/${getSection(
                        message
                      )}/Internal`}
                      target="_blank"
                    >
                      {message.subject} - {message.body}
                    </NavLink>
                  </div>
                  <div className="topic-content__date">
                    <NavLink
                      className="topic-content__link"
                      to={`/messages/${message.id}/${getSection(
                        message
                      )}/Internal`}
                      target="_blank"
                    >
                      {toLocalDate(message.date_created)}
                    </NavLink>
                  </div>
                </li>
              ))}
            <li>...</li>
          </ul>
        ) : (
          "No messages about patient"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default MessagesContent;
