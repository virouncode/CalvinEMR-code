import React from "react";
import { toPatientName } from "../../../../utils/names/toPatientName";
import PatientTopic from "./PatientTopic";
import PatientTopicDoctors from "./PatientTopicDoctors";

const PatientMenuLeft = ({
  demographicsInfos,
  patientId,
  contentsVisible,
  loadingPatient,
  errPatient,
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
}) => {
  return (
    <div className="patient-record__menu">
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#495867"
        topic="DEMOGRAPHICS"
        patientName={toPatientName(demographicsInfos)}
        demographicsInfos={demographicsInfos}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        loadingPatient={loadingPatient}
        errPatient={errPatient}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#577399"
        topic="PAST HEALTH"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        topicDatas={pastHealth}
        setTopicDatas={setPastHealth}
        loading={loadingPastHealth}
        setLoading={setLoadingPastHealth}
        errMsg={errPastHealth}
        setErrMsg={setErrPastHealth}
        hasMore={hasMorePastHealth}
        setHasMore={setHasMorePastHealth}
        paging={pagingPastHealth}
        setPaging={setPagingPastHealth}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#326771"
        topic="FAMILY HISTORY"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        topicDatas={famHistory}
        setTopicDatas={setFamHistory}
        loading={loadingFamHistory}
        setLoading={setLoadingFamHistory}
        errMsg={errFamHistory}
        setErrMsg={setErrFamHistory}
        hasMore={hasMoreFamHistory}
        setHasMore={setHasMoreFamHistory}
        paging={pagingFamHistory}
        setPaging={setPagingFamHistory}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#01ba95"
        topic="RELATIONSHIPS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        topicDatas={relationships}
        setTopicDatas={setRelationships}
        loading={loadingRelationships}
        setLoading={setLoadingRelationships}
        errMsg={errRelationships}
        setErrMsg={setErrRelationships}
        hasMore={hasMoreRelationships}
        setHasMore={setHasMoreRelationships}
        paging={pagingRelationships}
        setPaging={setPagingRelationships}
        demographicsInfos={demographicsInfos}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#2c8c99"
        topic="ALERTS & SPECIAL NEEDS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        topicDatas={alerts}
        setTopicDatas={setAlerts}
        loading={loadingAlerts}
        setLoading={setLoadingAlerts}
        errMsg={errAlerts}
        setErrMsg={setErrAlerts}
        hasMore={hasMoreAlerts}
        setHasMore={setHasMoreAlerts}
        paging={pagingAlerts}
        setPaging={setPagingAlerts}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#ef0b00"
        topic="RISK FACTORS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        topicDatas={risks}
        setTopicDatas={setRisks}
        loading={loadingRisks}
        setLoading={setLoadingRisks}
        errMsg={errRisks}
        setErrMsg={setErrRisks}
        hasMore={hasMoreRisks}
        setHasMore={setHasMoreRisks}
        paging={pagingRisks}
        setPaging={setPagingRisks}
      />

      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#931621"
        topic="MEDICATIONS AND TREATMENTS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        topicDatas={medications}
        setTopicDatas={setMedications}
        loading={loadingMedications}
        setLoading={setLoadingMedications}
        errMsg={errMedications}
        setErrMsg={setErrMedications}
        hasMore={hasMoreMedications}
        setHasMore={setHasMoreMedications}
        paging={pagingMedications}
        setPaging={setPagingMedications}
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#e3afce"
        topic="PRESCRIPTIONS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        topicDatas={prescriptions}
        setTopicDatas={setPrescriptions}
        loading={loadingPrescriptions}
        setLoading={setLoadingPrescriptions}
        errMsg={errPrescriptions}
        setErrMsg={setErrPrescriptions}
        hasMore={hasMorePrescriptions}
        setHasMore={setHasMorePrescriptions}
        paging={pagingPrescriptions}
        setPaging={setPagingPrescriptions}
        demographicsInfos={demographicsInfos}
      />
      <PatientTopicDoctors
        textColor="#FEFEFE"
        backgroundColor="#21201e"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        doctors={doctors}
        setDoctors={setDoctors}
        loadingDoctors={loadingDoctors}
        setLoadingDoctors={setLoadingDoctors}
        errMsgDoctors={errDoctors}
        setErrMsgDoctors={setErrDoctors}
        hasMoreDoctors={hasMoreDoctors}
        setHasMoreDoctors={setHasMoreDoctors}
        pagingDoctors={pagingDoctors}
        setPagingDoctors={setPagingDoctors}
        patientDoctors={patientDoctors}
        setPatientDoctors={setPatientDoctors}
        loadingPatientDoctors={loadingPatientDoctors}
        setLoadingPatientDoctors={setLoadingPatientDoctors}
        errMsgPatientDoctors={errPatientDoctors}
        setErrMsgPatientDoctors={setErrPatientDoctors}
        hasMorePatientDoctors={hasMorePatientDoctors}
        setHasMorePatientDoctors={setHasMorePatientDoctors}
        pagingPatientDoctors={pagingPatientDoctors}
        setPagingPatientDoctors={setPagingPatientDoctors}
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#28464b"
        topic="PHARMACIES"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        topicDatas={pharmacies}
        setTopicDatas={setPharmacies}
        loading={loadingPharmacies}
        setLoading={setLoadingPharmacies}
        errMsg={errPharmacies}
        setErrMsg={setErrPharmacies}
        hasMore={hasMorePharmacies}
        setHasMore={setHasMorePharmacies}
        paging={pagingPharmacies}
        setPaging={setPagingPharmacies}
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#2acbd6"
        topic="E-FORMS"
        patientName={toPatientName(demographicsInfos)}
        patientId={patientId}
        contentsVisible={contentsVisible}
        side="left"
        topicDatas={eforms}
        setTopicDatas={setEforms}
        loading={loadingEforms}
        setLoading={setLoadingEforms}
        errMsg={errEforms}
        setErrMsg={setErrEforms}
        hasMore={hasMoreEforms}
        setHasMore={setHasMoreEforms}
        paging={pagingEforms}
        setPaging={setPagingEforms}
        demographicsInfos={demographicsInfos}
      />
      <PatientTopic
        textColor="#FEFEFE"
        backgroundColor="#CE2D4F"
        topic="REMINDERS"
        patientId={patientId}
        contentsVisible={contentsVisible}
        patientName={toPatientName(demographicsInfos)}
        side="left"
        topicDatas={reminders}
        setTopicDatas={setReminders}
        loading={loadingReminders}
        setLoading={setLoadingReminders}
        errMsg={errReminders}
        setErrMsg={setErrReminders}
        hasMore={hasMoreReminders}
        setHasMore={setHasMoreReminders}
        paging={pagingReminders}
        setPaging={setPagingReminders}
      />
    </div>
  );
};

export default PatientMenuLeft;
