import { CircularProgress } from "@mui/material";
import React from "react";
import { toLocalDate } from "../../../../../utils/formatDates";

const EformsContent = ({ showDocument, datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <ul>
            {datas
              .sort((a, b) => b.date_created - a.date_created)
              .map((eform) => (
                <li
                  key={eform.id}
                  onClick={() => showDocument(eform.file.url, eform.file.mime)}
                  className="topic-content__link"
                >
                  - {eform.name} ({toLocalDate(eform.date_created)})
                </li>
              ))}
          </ul>
        ) : (
          "No E-forms"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default EformsContent;
