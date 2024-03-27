import React, { useState } from "react";
import usePatientDemoSocket from "../../../../hooks/socket/usePatientDemoSocket";
import useFetchPatientRecord from "../../../../hooks/useFetchPatientRecord";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import ClinicalNotes from "../ClinicalNotes/ClinicalNotes";
import PatientMenuLeft from "./PatientMenuLeft";
import PatientMenuRight from "./PatientMenuRight";

const PatientRecord = ({
  demographicsInfos,
  setDemographicsInfos,
  loadingPatient,
  errPatient,
  patientId,
}) => {
  //HOOKS
  const {
    loadingRecord,
    pastHealth,
    setPastHealth,
    loadingPastHealth,
    setLoadingPastHealth,
    errPastHealth,
    setErrPastHealth,
    hasMorePastHealth,
    setHasMorePastHealth,
    pagingPastHealth,
    setPagingPastHealth,

    famHistory,
    setFamHistory,
    loadingFamHistory,
    setLoadingFamHistory,
    errFamHistory,
    setErrFamHistory,
    hasMoreFamHistory,
    setHasMoreFamHistory,
    pagingFamHistory,
    setPagingFamHistory,

    relationships,
    setRelationships,
    loadingRelationships,
    setLoadingRelationships,
    errRelationships,
    setErrRelationships,
    hasMoreRelationships,
    setHasMoreRelationships,
    pagingRelationships,
    setPagingRelationships,

    alerts,
    setAlerts,
    loadingAlerts,
    setLoadingAlerts,
    errAlerts,
    setErrAlerts,
    hasMoreAlerts,
    setHasMoreAlerts,
    pagingAlerts,
    setPagingAlerts,

    risks,
    setRisks,
    loadingRisks,
    setLoadingRisks,
    errRisks,
    setErrRisks,
    hasMoreRisks,
    setHasMoreRisks,
    pagingRisks,
    setPagingRisks,

    medications,
    setMedications,
    loadingMedications,
    setLoadingMedications,
    errMedications,
    setErrMedications,
    hasMoreMedications,
    setHasMoreMedications,
    pagingMedications,
    setPagingMedications,

    prescriptions,
    setPrescriptions,
    loadingPrescriptions,
    setLoadingPrescriptions,
    errPrescriptions,
    setErrPrescriptions,
    hasMorePrescriptions,
    setHasMorePrescriptions,
    pagingPrescriptions,
    setPagingPrescriptions,

    doctors,
    setDoctors,
    loadingDoctors,
    setLoadingDoctors,
    errDoctors,
    setErrDoctors,
    hasMoreDoctors,
    setHasMoreDoctors,
    pagingDoctors,
    setPagingDoctors,

    patientDoctors,
    setPatientDoctors,
    loadingPatientDoctors,
    setLoadingPatientDoctors,
    errPatientDoctors,
    setErrPatientDoctors,
    hasMorePatientDoctors,
    setHasMorePatientDoctors,
    pagingPatientDoctors,
    setPagingPatientDoctors,

    pharmacies,
    setPharmacies,
    loadingPharmacies,
    setLoadingPharmacies,
    errPharmacies,
    setErrPharmacies,
    hasMorePharmacies,
    setHasMorePharmacies,
    pagingPharmacies,
    setPagingPharmacies,

    eforms,
    setEforms,
    loadingEforms,
    setLoadingEforms,
    errEforms,
    setErrEforms,
    hasMoreEforms,
    setHasMoreEforms,
    pagingEforms,
    setPagingEforms,

    reminders,
    setReminders,
    loadingReminders,
    setLoadingReminders,
    errReminders,
    setErrReminders,
    hasMoreReminders,
    setHasMoreReminders,
    pagingReminders,
    setPagingReminders,

    personalHistory,
    setPersonalHistory,
    loadingPersonalHistory,
    setLoadingPersonalHistory,
    errPersonalHistory,
    setErrPersonalHistory,
    hasMorePersonalHistory,
    setHasMorePersonalHistory,
    pagingPersonalHistory,
    setPagingPersonalHistory,

    careElements,
    setCareElements,
    loadingCareElements,
    setLoadingCareElements,
    errCareElements,
    setErrCareElements,
    hasMoreCareElements,
    setHasMoreCareElements,
    pagingCareElements,
    setPagingCareElements,

    problemList,
    setProblemList,
    loadingProblemList,
    setLoadingProblemList,
    errProblemList,
    setErrProblemList,
    hasMoreProblemList,
    setHasMoreProblemList,
    pagingProblemList,
    setPagingProblemList,

    pregnancies,
    setPregnancies,
    loadingPregnancies,
    setLoadingPregnancies,
    errPregnancies,
    setErrPregnancies,
    hasMorePregnancies,
    setHasMorePregnancies,
    pagingPregnancies,
    setPagingPregnancies,

    allergies,
    setAllergies,
    loadingAllergies,
    setLoadingAllergies,
    errAllergies,
    setErrAllergies,
    hasMoreAllergies,
    setHasMoreAllergies,
    pagingAllergies,
    setPagingAllergies,

    labResults,
    setLabResults,
    loadingLabResults,
    setLoadingLabResults,
    errLabResults,
    setErrLabResults,
    hasMoreLabResults,
    setHasMoreLabResults,
    pagingLabResults,
    setPagingLabResults,

    reportsReceived,
    setReportsReceived,
    loadingReportsReceived,
    setLoadingReportsReceived,
    errReportsReceived,
    setErrReportsReceived,
    hasMoreReportsReceived,
    setHasMoreReportsReceived,
    pagingReportsReceived,
    setPagingReportsReceived,

    reportsSent,
    setReportsSent,
    loadingReportsSent,
    setLoadingReportsSent,
    errReportsSent,
    setErrReportsSent,
    hasMoreReportsSent,
    setHasMoreReportsSent,
    pagingReportsSent,
    setPagingReportsSent,

    immunizations,
    setImmunizations,
    loadingImmunizations,
    setLoadingImmunizations,
    errImmunizations,
    setErrImmunizations,
    hasMoreImmunizations,
    setHasMoreImmunizations,
    pagingImmunizations,
    setPagingImmunizations,

    appointments,
    setAppointments,
    loadingAppointments,
    setLoadingAppointments,
    errAppointments,
    setErrAppointments,
    hasMoreAppointments,
    setHasMoreAppointments,
    pagingAppointments,
    setPagingAppointments,

    messagesAbout,
    loadingMessagesAbout,
    errMessagesAbout,

    messagesWith,
    loadingMessagesWith,
    errMessagesWith,

    todosAbout,
    loadingTodosAbout,
    errTodosAbout,
  } = useFetchPatientRecord(patientId);

  const [allContentsVisible, setAllContentsVisible] = useState(false);
  const [leftContentsVisible, setLeftContentsVisible] = useState(false);
  const [rightContentsVisible, setRightContentsVisible] = useState(false);
  const [notesVisible, setNotesVisible] = useState(true);
  const [notesContentsVisible, setNotesContentsVisible] = useState(true);

  usePatientDemoSocket(demographicsInfos, setDemographicsInfos);

  const handleClickAllFold = (e) => {
    if (allContentsVisible) {
      setAllContentsVisible(false);
      setLeftContentsVisible(false);
      setRightContentsVisible(false);
      setNotesContentsVisible(false);
      setNotesVisible(false);
    } else {
      setAllContentsVisible(true);
      setLeftContentsVisible(true);
      setRightContentsVisible(true);
      setNotesContentsVisible(true);
      setNotesVisible(true);
    }
  };
  const handleClickLeftFold = (e) => {
    setLeftContentsVisible((v) => !v);
  };
  const handleClickRightFold = (e) => {
    setRightContentsVisible((v) => !v);
  };

  return demographicsInfos ? (
    <>
      <div className="patient-record__btn-container">
        <button
          type="button"
          className="patient-record__fold"
          onClick={handleClickLeftFold}
        >
          {leftContentsVisible ? "Fold" : "Unfold"}
        </button>
        <button
          type="button"
          className="patient-record__fold"
          onClick={handleClickAllFold}
        >
          {allContentsVisible ? "Fold All" : "Unfold All"}
        </button>
        <button
          type="button"
          className="patient-record__fold"
          onClick={handleClickRightFold}
        >
          {rightContentsVisible ? "Fold" : "Unfold"}
        </button>
      </div>
      <div className="patient-record__content">
        <PatientMenuLeft
          demographicsInfos={demographicsInfos}
          setDemographicsInfos={setDemographicsInfos}
          patientId={patientId}
          contentsVisible={leftContentsVisible}
          loadingPatient={loadingPatient}
          errPatient={errPatient}
          pastHealth={pastHealth}
          setPastHealth={setPastHealth}
          loadingPastHealth={loadingPastHealth}
          setLoadingPastHealth={setLoadingPastHealth}
          errPastHealth={errPastHealth}
          setErrPastHealth={setErrPastHealth}
          hasMorePastHealth={hasMorePastHealth}
          setHasMorePastHealth={setHasMorePastHealth}
          pagingPastHealth={pagingPastHealth}
          setPagingPastHealth={setPagingPastHealth}
          famHistory={famHistory}
          setFamHistory={setFamHistory}
          loadingFamHistory={loadingFamHistory}
          setLoadingFamHistory={setLoadingFamHistory}
          errFamHistory={errFamHistory}
          setErrFamHistory={setErrFamHistory}
          hasMoreFamHistory={hasMoreFamHistory}
          setHasMoreFamHistory={setHasMoreFamHistory}
          pagingFamHistory={pagingFamHistory}
          setPagingFamHistory={setPagingFamHistory}
          relationships={relationships}
          setRelationships={setRelationships}
          loadingRelationships={loadingRelationships}
          setLoadingRelationships={setLoadingRelationships}
          errRelationships={errRelationships}
          setErrRelationships={setErrRelationships}
          hasMoreRelationships={hasMoreRelationships}
          setHasMoreRelationships={setHasMoreRelationships}
          pagingRelationships={pagingRelationships}
          setPagingRelationships={setPagingRelationships}
          alerts={alerts}
          setAlerts={setAlerts}
          loadingAlerts={loadingAlerts}
          setLoadingAlerts={setLoadingAlerts}
          errAlerts={errAlerts}
          setErrAlerts={setErrAlerts}
          hasMoreAlerts={hasMoreAlerts}
          setHasMoreAlerts={setHasMoreAlerts}
          pagingAlerts={pagingAlerts}
          setPagingAlerts={setPagingAlerts}
          risks={risks}
          setRisks={setRisks}
          loadingRisks={loadingRisks}
          setLoadingRisks={setLoadingRisks}
          errRisks={errRisks}
          setErrRisks={setErrRisks}
          hasMoreRisks={hasMoreRisks}
          setHasMoreRisks={setHasMoreRisks}
          pagingRisks={pagingRisks}
          setPagingRisks={setPagingRisks}
          medications={medications}
          setMedications={setMedications}
          loadingMedications={loadingMedications}
          setLoadingMedications={setLoadingMedications}
          errMedications={errMedications}
          setErrMedications={setErrMedications}
          hasMoreMedications={hasMoreMedications}
          setHasMoreMedications={setHasMoreMedications}
          pagingMedications={pagingMedications}
          setPagingMedications={setPagingMedications}
          prescriptions={prescriptions}
          setPrescriptions={setPrescriptions}
          loadingPrescriptions={loadingPrescriptions}
          setLoadingPrescriptions={setLoadingPrescriptions}
          errPrescriptions={errPrescriptions}
          setErrPrescriptions={setErrPrescriptions}
          hasMorePrescriptions={hasMorePrescriptions}
          setHasMorePrescriptions={setHasMorePrescriptions}
          pagingPrescriptions={pagingPrescriptions}
          setPagingPrescriptions={setPagingPrescriptions}
          doctors={doctors}
          setDoctors={setDoctors}
          loadingDoctors={loadingDoctors}
          setLoadingDoctors={setLoadingDoctors}
          errDoctors={errDoctors}
          setErrDoctors={setErrDoctors}
          hasMoreDoctors={hasMoreDoctors}
          setHasMoreDoctors={setHasMoreDoctors}
          pagingDoctors={pagingDoctors}
          setPagingDoctors={setPagingDoctors}
          patientDoctors={patientDoctors}
          setPatientDoctors={setPatientDoctors}
          loadingPatientDoctors={loadingPatientDoctors}
          setLoadingPatientDoctors={setLoadingPatientDoctors}
          errPatientDoctors={errPatientDoctors}
          setErrPatientDoctors={setErrPatientDoctors}
          hasMorePatientDoctors={hasMorePatientDoctors}
          setHasMorePatientDoctors={setHasMorePatientDoctors}
          pagingPatientDoctors={pagingPatientDoctors}
          setPagingPatientDoctors={setPagingPatientDoctors}
          pharmacies={pharmacies}
          setPharmacies={setPharmacies}
          loadingPharmacies={loadingPharmacies}
          setLoadingPharmacies={setLoadingPharmacies}
          errPharmacies={errPharmacies}
          setErrPharmacies={setErrPharmacies}
          hasMorePharmacies={hasMorePharmacies}
          setHasMorePharmacies={setHasMorePharmacies}
          pagingPharmacies={pagingPharmacies}
          setPagingPharmacies={setPagingPharmacies}
          eforms={eforms}
          setEforms={setEforms}
          loadingEforms={loadingEforms}
          setLoadingEforms={setLoadingEforms}
          errEforms={errEforms}
          setErrEforms={setErrEforms}
          hasMoreEforms={hasMoreEforms}
          setHasMoreEforms={setHasMoreEforms}
          pagingEforms={pagingEforms}
          setPagingEforms={setPagingEforms}
          reminders={reminders}
          setReminders={setReminders}
          loadingReminders={loadingReminders}
          setLoadingReminders={setLoadingReminders}
          errReminders={errReminders}
          setErrReminders={setErrReminders}
          hasMoreReminders={hasMoreReminders}
          setHasMoreReminders={setHasMoreReminders}
          pagingReminders={pagingReminders}
          setPagingReminders={setPagingReminders}
        />
        <ClinicalNotes
          demographicsInfos={demographicsInfos}
          notesVisible={notesVisible}
          setNotesVisible={setNotesVisible}
          contentsVisible={notesContentsVisible}
          setContentsVisible={setNotesContentsVisible}
          patientId={patientId}
          loadingPatient={loadingPatient}
          errPatient={errPatient}
        />
        <PatientMenuRight
          demographicsInfos={demographicsInfos}
          patientId={patientId}
          contentsVisible={rightContentsVisible}
          loadingPatient={loadingPatient}
          errPatient={errPatient}
          personalHistory={personalHistory}
          setPersonalHistory={setPersonalHistory}
          loadingPersonalHistory={loadingPersonalHistory}
          setLoadingPersonalHistory={setLoadingPersonalHistory}
          errPersonalHistory={errPersonalHistory}
          setErrPersonalHistory={setErrPersonalHistory}
          hasMorePersonalHistory={hasMorePersonalHistory}
          setHasMorePersonalHistory={setHasMorePersonalHistory}
          pagingPersonalHistory={pagingPersonalHistory}
          setPagingPersonalHistory={setPagingPersonalHistory}
          careElements={careElements}
          setCareElements={setCareElements}
          loadingCareElements={loadingCareElements}
          setLoadingCareElements={setLoadingCareElements}
          errCareElements={errCareElements}
          setErrCareElements={setErrCareElements}
          hasMoreCareElements={hasMoreCareElements}
          setHasMoreCareElements={setHasMoreCareElements}
          pagingCareElements={pagingCareElements}
          setPagingCareElements={setPagingCareElements}
          problemList={problemList}
          setProblemList={setProblemList}
          loadingProblemList={loadingProblemList}
          setLoadingProblemList={setLoadingProblemList}
          errProblemList={errProblemList}
          setErrProblemList={setErrProblemList}
          hasMoreProblemList={hasMoreProblemList}
          setHasMoreProblemList={setHasMoreProblemList}
          pagingProblemList={pagingProblemList}
          setPagingProblemList={setPagingProblemList}
          pregnancies={pregnancies}
          setPregnancies={setPregnancies}
          loadingPregnancies={loadingPregnancies}
          setLoadingPregnancies={setLoadingPregnancies}
          errPregnancies={errPregnancies}
          setErrPregnancies={setErrPregnancies}
          hasMorePregnancies={hasMorePregnancies}
          setHasMorePregnancies={setHasMorePregnancies}
          pagingPregnancies={pagingPregnancies}
          setPagingPregnancies={setPagingPregnancies}
          allergies={allergies}
          setAllergies={setAllergies}
          loadingAllergies={loadingAllergies}
          setLoadingAllergies={setLoadingAllergies}
          errAllergies={errAllergies}
          setErrAllergies={setErrAllergies}
          hasMoreAllergies={hasMoreAllergies}
          setHasMoreAllergies={setHasMoreAllergies}
          pagingAllergies={pagingAllergies}
          setPagingAllergies={setPagingAllergies}
          labResults={labResults}
          setLabResults={setLabResults}
          loadingLabResults={loadingLabResults}
          setLoadingLabResults={setLoadingLabResults}
          errLabResults={errLabResults}
          setErrLabResults={setErrLabResults}
          hasMoreLabResults={hasMoreLabResults}
          setHasMoreLabResults={setHasMoreLabResults}
          pagingLabResults={pagingLabResults}
          setPagingLabResults={setPagingLabResults}
          reportsReceived={reportsReceived}
          setReportsReceived={setReportsReceived}
          loadingReportsReceived={loadingReportsReceived}
          setLoadingReportsReceived={setLoadingReportsReceived}
          errReportsReceived={errReportsReceived}
          setErrReportsReceived={setErrReportsReceived}
          hasMoreReportsReceived={hasMoreReportsReceived}
          setHasMoreReportsReceived={setHasMoreReportsReceived}
          pagingReportsReceived={pagingReportsReceived}
          setPagingReportsReceived={setPagingReportsReceived}
          reportsSent={reportsSent}
          setReportsSent={setReportsSent}
          loadingReportsSent={loadingReportsSent}
          setLoadingReportsSent={setLoadingReportsSent}
          errReportsSent={errReportsSent}
          setErrReportsSent={setErrReportsSent}
          hasMoreReportsSent={hasMoreReportsSent}
          setHasMoreReportsSent={setHasMoreReportsSent}
          pagingReportsSent={pagingReportsSent}
          setPagingReportsSent={setPagingReportsSent}
          immunizations={immunizations}
          setImmunizations={setImmunizations}
          loadingImmunizations={loadingImmunizations}
          setLoadingImmunizations={setLoadingImmunizations}
          errImmunizations={errImmunizations}
          setErrImmunizations={setErrImmunizations}
          hasMoreImmunizations={hasMoreImmunizations}
          setHasMoreImmunizations={setHasMoreImmunizations}
          pagingImmunizations={pagingImmunizations}
          setPagingImmunizations={setPagingImmunizations}
          appointments={appointments}
          setAppointments={setAppointments}
          loadingAppointments={loadingAppointments}
          setLoadingAppointments={setLoadingAppointments}
          errAppointments={errAppointments}
          setErrAppointments={setErrAppointments}
          hasMoreAppointments={hasMoreAppointments}
          setHasMoreAppointments={setHasMoreAppointments}
          pagingAppointments={pagingAppointments}
          setPagingAppointments={setPagingAppointments}
          messagesAbout={messagesAbout}
          loadingMessagesAbout={loadingMessagesAbout}
          errMessagesAbout={errMessagesAbout}
          messagesWith={messagesWith}
          loadingMessagesWith={loadingMessagesWith}
          errMessagesWith={errMessagesWith}
          todosAbout={todosAbout}
          loadingTodosAbout={loadingTodosAbout}
          errTodosAbout={errTodosAbout}
        />
      </div>
    </>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgressMedium />
    </div>
  );
};

export default PatientRecord;
