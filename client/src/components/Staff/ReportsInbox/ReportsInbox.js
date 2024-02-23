import React, { useState } from "react";
import useFetchStaffReports from "../../../hooks/useFetchStaffReports";
import useIntersection from "../../../hooks/useIntersection";
import useReportsInboxSocket from "../../../hooks/useReportsInboxSocket";
import useUserContext from "../../../hooks/useUserContext";
import EmptyRow from "../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../All/UI/Tables/LoadingRow";
import ReportsInboxAssignedPracticianForward from "./ReportsInboxAssignedPracticianForward";
import ReportsInboxItem from "./ReportsInboxItem";

const ReportsInbox = () => {
  //HOOKS
  const { user } = useUserContext();
  const [forwardVisible, setForwardVisible] = useState(false);
  const [reportToForwardId, setReportToForwardId] = useState("0");

  const [paging, setPaging] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const { reports, setReports, loading, errMsg, hasMore } =
    useFetchStaffReports(paging, user.id);

  useReportsInboxSocket(reports, setReports, user.id);

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  return (
    <>
      <h3 className="reportsinbox__subtitle">Reports to acknowledge inbox</h3>
      {errMsg && <div className="reportsInbox__err">{errMsg}</div>}
      {!errMsg && (
        <div className="reportsinbox__table-container" ref={rootRef}>
          <table className="reportsinbox__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Format</th>
                <th>File extension and version</th>
                <th>File</th>
                <th>Class</th>
                <th>SubClass</th>
                <th>Related patient</th>
                <th>Date of document</th>
                <th>Date received</th>
                <th>Author</th>
                <th>Notes</th>
                <th>Updated by</th>
                <th>Updated on</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports && reports.length > 0
                ? reports.map((item, index) =>
                    index === reports.length - 1 ? (
                      <ReportsInboxItem
                        item={item}
                        key={item.id}
                        setForwardVisible={setForwardVisible}
                        forwardVisible={forwardVisible}
                        setReportToForwardId={setReportToForwardId}
                        lastItemRef={lastItemRef}
                      />
                    ) : (
                      <ReportsInboxItem
                        item={item}
                        key={item.id}
                        setForwardVisible={setForwardVisible}
                        setReportToForwardId={setReportToForwardId}
                        forwardVisible={forwardVisible}
                      />
                    )
                  )
                : !loading && <EmptyRow colSpan="14" text="No inbox reports" />}
              {loading && <LoadingRow colSpan="14" />}
            </tbody>
          </table>
        </div>
      )}
      {forwardVisible && (
        <ReportsInboxAssignedPracticianForward
          reportToForward={reports.find(
            ({ id }) => id === parseInt(reportToForwardId)
          )}
          setForwardVisible={setForwardVisible}
        />
      )}
    </>
  );
};

export default ReportsInbox;
