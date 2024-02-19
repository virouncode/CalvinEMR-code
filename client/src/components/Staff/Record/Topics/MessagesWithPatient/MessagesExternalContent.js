import React from "react";
import { NavLink } from "react-router-dom";
import useAuthContext from "../../../../../hooks/useAuthContext";
import { toLocalDate } from "../../../../../utils/formatDates";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const MessagesExternalContent = ({ topicDatas, loading, errMsg }) => {
  const { user } = useAuthContext();

  const getSection = (message) => {
    if (message.deleted_by_staff_id === user.id) {
      return "Deleted messages";
    } else if (
      message.from_user_type === "staff" &&
      message.from_id === user.id
    ) {
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
            (message.from_id === user.id &&
              message.from_user_type === "staff") ||
            (message.to_id === user.id && message.to_user_type === "staff")
        ).length > 0 ? (
          <ul className="topic-content__list">
            {topicDatas
              .filter(
                (message) =>
                  (message.from_id === user.id &&
                    message.from_user_type === "staff") ||
                  (message.to_id === user.id &&
                    message.to_user_type === "staff")
              )
              .slice(0, 4)
              .map((message) => (
                <li className="topic-content__item" key={message.id}>
                  <div className="topic-content__overview">
                    <NavLink
                      className="topic-content__link"
                      to={`/messages/${message.id}/${getSection(
                        message
                      )}/External`}
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
                      )}/External`}
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
          "No messages with patient"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default MessagesExternalContent;
