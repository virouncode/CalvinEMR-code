import { CircularProgress } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../../../hooks/useAuth";
import { toLocalDate } from "../../../../../utils/formatDates";

const MessagesExternalContent = ({ datas, isLoading, errMsg }) => {
  const { user } = useAuth();

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
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas &&
        datas.filter(
          (message) =>
            (message.from_id === user.id &&
              message.from_user_type === "staff") ||
            (message.to_id === user.id && message.to_user_type === "staff")
        ).length >= 1 ? (
          <ul className="topic-content__list">
            {datas
              .filter(
                (message) =>
                  (message.from_id === user.id &&
                    message.from_user_type === "staff") ||
                  (message.to_id === user.id &&
                    message.to_user_type === "staff")
              )
              .sort((a, b) => b.date_created - a.date_created)
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
          </ul>
        ) : (
          "No messages with patient"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default MessagesExternalContent;
