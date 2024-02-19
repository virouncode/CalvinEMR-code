import { toLocalDate } from "../../../../../utils/formatDates";
import { showDocument } from "../../../../../utils/showDocument";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const ReportsContent = ({ topicDatas, loading, errMsg }) => {
  return !loading ? (
    errMsg ? (
      <p className="topic-content__err">{errMsg}</p>
    ) : (
      <div className="topic-content">
        {topicDatas && topicDatas.length > 0 ? (
          <>
            <p style={{ fontWeight: "bold" }}>Received</p>
            <ul>
              {topicDatas
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
              {topicDatas
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
              {topicDatas
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
    <CircularProgressMedium />
  );
};

export default ReportsContent;
