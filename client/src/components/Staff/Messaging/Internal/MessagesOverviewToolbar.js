import React from "react";

const MessagesOverviewToolbar = ({ section }) => {
  return (
    <div className="messages-overview__toolbar">
      <div className="messages-overview__from">
        {section === "Sent messages" ? "To" : "From"}
      </div>
      <div className="messages-overview__subject">
        Subject / Message overview
      </div>
      <div className="messages-overview__patient">Related patient</div>
      <div className="messages-overview__date">Date</div>
    </div>
  );
};

export default MessagesOverviewToolbar;
