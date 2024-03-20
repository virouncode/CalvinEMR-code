import React from "react";
import { NavLink } from "react-router-dom";
import useUserContext from "../../../../../hooks/useUserContext";
import { timestampToDateISOTZ } from "../../../../../utils/formatDates";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const TodosContent = ({ topicDatas, loading, errMsg }) => {
  const { user } = useUserContext();
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas &&
        topicDatas.filter((message) => message.staff_id === user.id).length >
          0 ? (
          <ul>
            {topicDatas
              .filter((message) => message.staff_id === user.id)
              .slice(0, 4)
              .map((message) => (
                <li className="topic-content__item" key={message.id}>
                  <div className="topic-content__overview">
                    <NavLink
                      className="topic-content__link"
                      to={`/staff/messages/${message.id}/To-dos/Internal`}
                    >
                      {message.subject} - {message.body}
                    </NavLink>
                  </div>
                  <div className="topic-content__date">
                    <NavLink
                      className="topic-content__link"
                      to={`/staff/messages/${message.id}/To-dos/Internal`}
                    >
                      {timestampToDateISOTZ(message.date_created)}
                    </NavLink>
                  </div>
                </li>
              ))}
            <li>...</li>
          </ul>
        ) : (
          "No to-dos about patient"
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default TodosContent;
