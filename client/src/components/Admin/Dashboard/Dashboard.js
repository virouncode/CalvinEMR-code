import React from "react";
import useFetchDashboard from "../../../hooks/useFetchDashboard";
import DashboardCardBillings from "./DashboardCardBillings";
import DashboardCardMeds from "./DashboardCardMeds";
import DashboardCardPatients from "./DashboardCardPatients";
import DashboardCardStaff from "./DashboardCardStaff";
import DashboardCardVisits from "./DashboardCardVisits";

const Dashboard = () => {
  // const [rangeStartDobVisits, setRangeStartDobVisits] = useState(
  //   Date.parse(new Date(20, 0, 1))
  // );
  const {
    visits,
    rangeStartVisits,
    setRangeStartVisits,
    rangeEndVisits,
    setRangeEndVisits,
    loadingVisits,
    errVisits,
    billings,
    rangeStartBillings,
    setRangeStartBillings,
    rangeEndBillings,
    setRangeEndBillings,
    loadingBillings,
    errBillings,
    sites,
    loadingSites,
    errSites,
    patientsPerGender,
    loadingPatientsPerGender,
    errPatientsPerGender,
    patientsPerAge,
    loadingPatientsPerAge,
    errPatientsPerAge,
    medications,
    rangeStartMeds,
    setRangeStartMeds,
    rangeEndMeds,
    setRangeEndMeds,
    loadingMeds,
    errMeds,
  } = useFetchDashboard();

  return (
    <div className="dashboard">
      <div className="dashboard-row">
        <DashboardCardVisits
          visits={visits}
          rangeStartVisits={rangeStartVisits}
          setRangeStartVisits={setRangeStartVisits}
          rangeEndVisits={rangeEndVisits}
          setRangeEndVisits={setRangeEndVisits}
          loadingVisits={loadingVisits}
          errVisits={errVisits}
          sites={sites}
        />
      </div>
      <div className="dashboard-row">
        <DashboardCardStaff
          sites={sites}
          loadingSites={loadingSites}
          errSites={errSites}
        />
      </div>
      <div className="dashboard-row">
        <DashboardCardPatients
          sites={sites}
          patientsPerGender={patientsPerGender}
          loadingPatientsPerGender={loadingPatientsPerGender}
          errPatientsPerGender={errPatientsPerGender}
          patientsPerAge={patientsPerAge}
          loadingPatientsPerAge={loadingPatientsPerAge}
          errPatientsPerAge={errPatientsPerAge}
        />
      </div>
      <div className="dashboard-row">
        <DashboardCardBillings
          billings={billings}
          rangeStartBillings={rangeStartBillings}
          setRangeStartBillings={setRangeStartBillings}
          rangeEndBillings={rangeEndBillings}
          setRangeEndBillings={setRangeEndBillings}
          loadingBillings={loadingBillings}
          errBillings={errBillings}
          sites={sites}
        />
      </div>
      <div className="dashboard-row">
        <DashboardCardMeds
          title="Medications"
          medications={medications}
          rangeStartMeds={rangeStartMeds}
          setRangeStartMeds={setRangeStartMeds}
          rangeEndMeds={rangeEndMeds}
          setRangeEndMeds={setRangeEndMeds}
          loadingMeds={loadingMeds}
          errBillings={errMeds}
          sites={sites}
        />
      </div>
    </div>
  );
};

export default Dashboard;
