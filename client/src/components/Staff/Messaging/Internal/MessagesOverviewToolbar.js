import React from "react";

const MessagesOverviewToolbar = ({ section }) => {
  return (
    <div className="messages-overview__toolbar">
      {section !== "To-dos" && (
        <div className="messages-overview__from">
          {section === "Sent messages" ? "To" : "From"}
        </div>
      )}
      <div
        className={
          section !== "To-dos"
            ? "messages-overview__subject"
            : "messages-overview__subject messages-overview__subject--todo"
        }
      >
        {`Subject / ${section !== "To-dos" ? "Message" : "To-do"} overview`}
      </div>
      <div className="messages-overview__patient">Related patient</div>
      <div className="messages-overview__date">Date</div>
    </div>
  );
};

export default MessagesOverviewToolbar;
