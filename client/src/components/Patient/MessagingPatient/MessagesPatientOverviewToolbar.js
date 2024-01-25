import React from "react";

const MessagesPatientOverviewToolbar = ({ section }) => {
  return (
    <div className="messages-overview__toolbar">
      <div className="messages-overview__from">
        {section === "Sent messages" ? "To" : "From"}
      </div>
      <div className="messages-overview__subject">
        Subject / Message overview
      </div>
      <div className="messages-overview__date messages-overview__date--external">
        Date
      </div>
    </div>
  );
};

export default MessagesPatientOverviewToolbar;
