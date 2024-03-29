import React from "react";
import { toPatientName } from "../../../../utils/names/toPatientName";
import PatientTopic from "./PatientTopic";
import PatientTopicReports from "./PatientTopicReports";

const PatientMenuRight = ({
  demographicsInfos,
  patientId,
  contentsVisible,
  loadingPatient,
  errPatient,
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
}) => {
  return (
    <div className="patient-record__menu">
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#495867"
        topic="PERSONAL HISTORY"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="right"
        topicDatas={personalHistory}
        setTopicDatas={setPersonalHistory}
        loading={loadingPersonalHistory}
        setLoading={setLoadingPersonalHistory}
        errMsg={errPersonalHistory}
        setErrMsg={setErrPersonalHistory}
        hasMore={hasMorePersonalHistory}
        setHasMore={setHasMorePersonalHistory}
        paging={pagingPersonalHistory}
        setPaging={setPagingPersonalHistory}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="CARE ELEMENTS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        topicDatas={careElements}
        setTopicDatas={setCareElements}
        loading={loadingCareElements}
        setLoading={setLoadingCareElements}
        errMsg={errCareElements}
        setErrMsg={setErrCareElements}
        hasMore={hasMoreCareElements}
        setHasMore={setHasMoreCareElements}
        paging={pagingCareElements}
        setPaging={setPagingCareElements}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="PROBLEM LIST"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        topicDatas={problemList}
        setTopicDatas={setProblemList}
        loading={loadingProblemList}
        setLoading={setLoadingProblemList}
        errMsg={errProblemList}
        setErrMsg={setErrProblemList}
        hasMore={hasMoreProblemList}
        setHasMore={setHasMoreProblemList}
        paging={pagingProblemList}
        setPaging={setPagingProblemList}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#01ba95"
        topic="PREGNANCIES"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        topicDatas={pregnancies}
        setTopicDatas={setPregnancies}
        loading={loadingPregnancies}
        setLoading={setLoadingPregnancies}
        errMsg={errPregnancies}
        setErrMsg={setErrPregnancies}
        hasMore={hasMorePregnancies}
        setHasMore={setHasMorePregnancies}
        paging={pagingPregnancies}
        setPaging={setPagingPregnancies}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#2c8c99"
        topic="ALLERGIES & ADVERSE REACTIONS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        topicDatas={allergies}
        setTopicDatas={setAllergies}
        loading={loadingAllergies}
        setLoading={setLoadingAllergies}
        errMsg={errAllergies}
        setErrMsg={setErrAllergies}
        hasMore={hasMoreAllergies}
        setHasMore={setHasMoreAllergies}
        paging={pagingAllergies}
        setPaging={setPagingAllergies}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#ef0b00"
        topic="LABORATORY RESULTS"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        topicDatas={labResults}
        setTopicDatas={setLabResults}
        loading={loadingLabResults}
        setLoading={setLoadingLabResults}
        errMsg={errLabResults}
        setErrMsg={setErrLabResults}
        hasMore={hasMoreLabResults}
        setHasMore={setHasMoreLabResults}
        paging={pagingLabResults}
        setPaging={setPagingLabResults}
      />

      <PatientTopicReports
        textColor="#FEFEFE"
        backgroundColor="#931621"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
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
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#e3afce"
        topic="LABELS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="right"
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        topic="IMMUNIZATIONS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        patientDob={demographicsInfos.DateOfBirth}
        side="right"
        loadingPatient={loadingPatient}
        errPatient={errPatient}
        topicDatas={immunizations}
        setTopicDatas={setImmunizations}
        loading={loadingImmunizations}
        setLoading={setLoadingImmunizations}
        errMsg={errImmunizations}
        setErrMsg={setErrImmunizations}
        hasMore={hasMoreImmunizations}
        setHasMore={setHasMoreImmunizations}
        paging={pagingImmunizations}
        setPaging={setPagingImmunizations}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#28464b"
        topic="APPOINTMENTS"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        topicDatas={appointments}
        setTopicDatas={setAppointments}
        loading={loadingAppointments}
        setLoading={setLoadingAppointments}
        errMsg={errAppointments}
        setErrMsg={setErrAppointments}
        hasMore={hasMoreAppointments}
        setHasMore={setHasMoreAppointments}
        paging={pagingAppointments}
        setPaging={setPagingAppointments}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#2acbd6"
        topic="MESSAGES ABOUT PATIENT"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        topicDatas={messagesAbout}
        loading={loadingMessagesAbout}
        errMsg={errMessagesAbout}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#CE2D4F"
        topic="MESSAGES WITH PATIENT"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        topicDatas={messagesWith}
        loading={loadingMessagesWith}
        errMsg={errMessagesWith}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#848484"
        topic="TO-DOS ABOUT PATIENT"
        patientId={patientId}
        demographicsInfos={demographicsInfos}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="right"
        topicDatas={todosAbout}
        loading={loadingTodosAbout}
        errMsg={errTodosAbout}
      />
    </div>
  );
};
export default PatientMenuRight;
