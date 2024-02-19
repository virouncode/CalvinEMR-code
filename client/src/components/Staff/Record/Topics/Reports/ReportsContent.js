import { toLocalDate } from "../../../../../utils/formatDates";
import { showDocument } from "../../../../../utils/showDocument";
import { showReportTextContent } from "../../../../../utils/showReportTextContent";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const ReportsContent = ({
  reportsReceived,
  loadingReportsReceived,
  errMsgReportsReceived,
  reportsSent,
  loadingReportsSent,
  errMsgReportsSent,
}) => {
  return !loadingReportsSent && !loadingReportsReceived ? (
    <>
      {errMsgReportsReceived && (
        <p className="topic-content__err">{errMsgReportsReceived}</p>
      )}
      {errMsgReportsSent && (
        <p className="topic-content__err">{errMsgReportsSent}</p>
      )}
      {!errMsgReportsReceived && !errMsgReportsSent && (
        <div className="topic-content">
          {(reportsReceived && reportsReceived.length > 0) ||
          (reportsSent && reportsSent.length > 0) ? (
            <>
              <p style={{ fontWeight: "bold" }}>Received</p>
              <ul>
                {reportsReceived
                  .filter(({ acknowledged }) => !acknowledged)
                  .slice(0, 4)
                  .map((item) => (
                    <li
                      key={item.id}
                      onClick={() =>
                        item.File
                          ? showDocument(item.File?.url, item.File?.mime)
                          : showReportTextContent(item)
                      }
                      style={{
                        textDecoration: "underline",
                        color: "#327AE6",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      - {item.name} ({toLocalDate(item.date_created)})
                    </li>
                  ))}
                {reportsReceived

                  .filter(({ acknowledged }) => acknowledged)
                  .slice(0, 4)
                  .map((item) => (
                    <li
                      key={item.id}
                      onClick={() =>
                        item.File
                          ? showDocument(item.File?.url, item.File?.mime)
                          : showReportTextContent(item)
                      }
                      style={{
                        textDecoration: "underline",
                        color: "black",
                        cursor: "pointer",
                        fontWeight: "normal",
                      }}
                    >
                      - {item.name} ({toLocalDate(item.date_created)})
                    </li>
                  ))}
                <li>...</li>
              </ul>
              <p style={{ fontWeight: "bold", marginTop: "10px" }}>Sent</p>
              <ul>
                {reportsSent
                  .filter(({ File }) => File)
                  .slice(0, 4)
                  .map((item) => (
                    <li
                      key={item.id}
                      onClick={() =>
                        item.File
                          ? showDocument(item.File?.url, item.File?.mime)
                          : showReportTextContent(item)
                      }
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      - {item.name} ({toLocalDate(item.date_created)})
                    </li>
                  ))}
                <li>...</li>
              </ul>
            </>
          ) : (
            "No reports"
          )}
        </div>
      )}
    </>
  ) : (
    <CircularProgressMedium />
  );
};

export default ReportsContent;
