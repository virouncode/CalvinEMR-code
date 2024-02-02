import { CircularProgress } from "@mui/material";
import { toLocalDate } from "../../../../../utils/formatDates";

const ReportsContent = ({ showDocument, datas, isLoading, errMsg }) => {
  return !isLoading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {datas && datas.length >= 1 ? (
          <>
            <p style={{ fontWeight: "bold" }}>Received</p>
            <ul>
              {datas
                .filter(({ File }) => File)
                .filter(({ RecipientName }) => !RecipientName?.FirstName)
                .filter(({ acknowledged }) => !acknowledged)
                .sort((a, b) => b.date_created - a.date_created)
                .map((report) => (
                  <li
                    key={report.id}
                    onClick={() =>
                      showDocument(report.File.url, report.File.mime)
                    }
                    style={{
                      textDecoration: "underline",
                      color: "#327AE6",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    - {report.name} ({toLocalDate(report.date_created)})
                  </li>
                ))}
              {datas
                .filter(({ File }) => File)
                .filter(({ acknowledged }) => acknowledged)
                .sort((a, b) => b.date_created - a.date_created)
                .map((report) => (
                  <li
                    key={report.id}
                    onClick={() =>
                      showDocument(report.File.url, report.File.mime)
                    }
                    style={{
                      textDecoration: "underline",
                      color: "black",
                      cursor: "pointer",
                      fontWeight: "normal",
                    }}
                  >
                    - {report.name} ({toLocalDate(report.date_created)})
                  </li>
                ))}
            </ul>
            <p style={{ fontWeight: "bold", marginTop: "10px" }}>Sent</p>
            <ul>
              {datas
                .filter(({ RecipientName }) => RecipientName?.FirstName)
                .sort((a, b) => b.date_created - a.date_created)
                .map((report) => (
                  <li
                    key={report.id}
                    onClick={() =>
                      showDocument(report.File.url, report.File.mime)
                    }
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    - {report.name} ({toLocalDate(report.date_created)})
                  </li>
                ))}
            </ul>
          </>
        ) : (
          "No reports"
        )}
      </div>
    )
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default ReportsContent;
