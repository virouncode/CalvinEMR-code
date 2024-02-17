import React from "react";
import { NavLink } from "react-router-dom";
import useAuthContext from "../../../../../hooks/useAuthContext";
import { toLocalDate } from "../../../../../utils/formatDates";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const MessagesContent = ({ datas, isLoading, errMsg }) => {
  const { user } = useAuthContext();

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
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas &&
        datas.filter(
          (message) =>
            message.from_id === user.id ||
            message.to_staff_ids.includes(user.id)
        ).length >= 1 ? (
          <ul>
            {datas
              .filter(
                (message) =>
                  message.from_id === user.id ||
                  message.to_staff_ids.includes(user.id)
              )
              .sort((a, b) => b.date_created - a.date_created)
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
