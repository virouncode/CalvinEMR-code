import { useEffect, useState } from "react";
import { axiosXanoStaff } from "../api/xanoStaff";
import useAuthContext from "./useAuthContext";

const useFetchPatientRecord = (patientId) => {
  const { auth } = useAuthContext();

  const [loadingRecord, setLoadingRecord] = useState(false);
  const [pastHealth, setPastHealth] = useState([]);
  const [loadingPastHealth, setLoadingPastHealth] = useState(true);
  const [errPastHealth, setErrPastHealth] = useState("");
  const [hasMorePastHealth, setHasMorePastHealth] = useState(true);
  const [pagingPastHealth, setPagingPastHealth] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [famHistory, setFamHistory] = useState([]);
  const [loadingFamHistory, setLoadingFamHistory] = useState(true);
  const [errFamHistory, setErrFamHistory] = useState("");
  const [hasMoreFamHistory, setHasMoreFamHistory] = useState(true);
  const [pagingFamHistory, setPagingFamHistory] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [relationships, setRelationships] = useState([]);
  const [loadingRelationships, setLoadingRelationships] = useState(true);
  const [errRelationships, setErrRelationships] = useState("");
  const [hasMoreRelationships, setHasMoreRelationships] = useState(true);
  const [pagingRelationships, setPagingRelationships] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [errAlerts, setErrAlerts] = useState("");
  const [hasMoreAlerts, setHasMoreAlerts] = useState(true);
  const [pagingAlerts, setPagingAlerts] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [risks, setRisks] = useState([]);
  const [loadingRisks, setLoadingRisks] = useState(true);
  const [errRisks, setErrRisks] = useState("");
  const [hasMoreRisks, setHasMoreRisks] = useState(true);
  const [pagingRisks, setPagingRisks] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [medications, setMedications] = useState([]);
  const [loadingMedications, setLoadingMedications] = useState(true);
  const [errMedications, setErrMedications] = useState("");
  const [hasMoreMedications, setHasMoreMedications] = useState(true);
  const [pagingMedications, setPagingMedications] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [errDoctors, setErrDoctors] = useState("");
  const [hasMoreDoctors, setHasMoreDoctors] = useState(true);
  const [pagingDoctors, setPagingDoctors] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [pharmacies, setPharmacies] = useState([]);
  const [loadingPharmacies, setLoadingPharmacies] = useState(true);
  const [errPharmacies, setErrPharmacies] = useState("");
  const [hasMorePharmacies, setHasMorePharmacies] = useState(true);
  const [pagingPharmacies, setPagingPharmacies] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [eforms, setEforms] = useState([]);
  const [loadingEforms, setLoadingEforms] = useState(true);
  const [errEforms, setErrEforms] = useState("");
  const [hasMoreEforms, setHasMoreEforms] = useState(true);
  const [pagingEforms, setPagingEforms] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [errReminders, setErrReminders] = useState("");
  const [hasMoreReminders, setHasMoreReminders] = useState(true);
  const [pagingReminders, setPagingReminders] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [personalHistory, setPersonalHistory] = useState([]);
  const [loadingPersonalHistory, setLoadingPersonalHistory] = useState(true);
  const [errPersonalHistory, setErrPersonalHistory] = useState("");
  const [hasMorePersonalHistory, setHasMorePersonalHistory] = useState(true);
  const [pagingPersonalHistory, setPagingPersonalHistory] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [careElements, setCareElements] = useState([]);
  const [loadingCareElements, setLoadingCareElements] = useState(true);
  const [errCareElements, setErrCareElements] = useState("");
  const [hasMoreCareElements, setHasMoreCareElements] = useState(true);
  const [pagingCareElements, setPagingCareElements] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [problemList, setProblemList] = useState([]);
  const [loadingProblemList, setLoadingProblemList] = useState(true);
  const [errProblemList, setErrProblemList] = useState("");
  const [hasMoreProblemList, setHasMoreProblemList] = useState(true);
  const [pagingProblemList, setPagingProblemList] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [pregnancies, setPregnancies] = useState([]);
  const [loadingPregnancies, setLoadingPregnancies] = useState(true);
  const [errPregnancies, setErrPregnancies] = useState("");
  const [hasMorePregnancies, setHasMorePregnancies] = useState(true);
  const [pagingPregnancies, setPagingPregnancies] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [allergies, setAllergies] = useState([]);
  const [loadingAllergies, setLoadingAllergies] = useState(true);
  const [errAllergies, setErrAllergies] = useState("");
  const [hasMoreAllergies, setHasMoreAllergies] = useState(true);
  const [pagingAllergies, setPagingAllergies] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [labResults, setLabResults] = useState([]);
  const [loadingLabResults, setLoadingLabResults] = useState(true);
  const [errLabResults, setErrLabResults] = useState("");
  const [hasMoreLabResults, setHasMoreLabResults] = useState(true);
  const [pagingLabResults, setPagingLabResults] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [reportsReceived, setReportsReceived] = useState([]);
  const [loadingReportsReceived, setLoadingReportsReceived] = useState(true);
  const [errReportsReceived, setErrReportsReceived] = useState("");
  const [hasMoreReportsReceived, setHasMoreReportsReceived] = useState(true);
  const [pagingReportsReceived, setPagingReportsReceived] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const [reportsSent, setReportsSent] = useState([]);
  const [loadingReportsSent, setLoadingReportsSent] = useState(true);
  const [errReportsSent, setErrReportsSent] = useState("");
  const [hasMoreReportsSent, setHasMoreReportsSent] = useState(true);
  const [pagingReportsSent, setPagingReportsSent] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [immunizations, setImmunizations] = useState([]);
  const [loadingImmunizations, setLoadingImmunizations] = useState(true);
  const [errImmunizations, setErrImmunizations] = useState("");
  const [hasMoreImmunizations, setHasMoreImmunizations] = useState(true);
  const [pagingImmunizations, setPagingImmunizations] = useState({
    page: 1,
    perPage: 300, //we don't want to page, because we display every immunizations in a grid, no infinite scroll
    offset: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [errAppointments, setErrAppointments] = useState("");
  const [hasMoreAppointments, setHasMoreAppointments] = useState(true);
  const [pagingAppointments, setPagingAppointments] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [messagesAbout, setMessagesAbout] = useState([]);
  const [loadingMessagesAbout, setLoadingMessagesAbout] = useState(true);
  const [errMessagesAbout, setErrMessagesAbout] = useState("");
  const [hasMoreMessagesAbout, setHasMoreMessagesAbout] = useState(true);
  const [pagingMessagesAbout, setPagingMessagesAbout] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const [messagesWith, setMessagesWith] = useState([]);
  const [loadingMessagesWith, setLoadingMessagesWith] = useState(true);
  const [errMessagesWith, setErrMessagesWith] = useState("");
  const [hasMoreMessagesWith, setHasMoreMessagesWith] = useState(true);
  const [pagingMessagesWith, setPagingMessagesWith] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const fetchTopicDatas = async (
    url,
    setTopicDatas,
    paging,
    setHasMore,
    setLoading,
    setErr,
    abortController
  ) => {
    try {
      setLoading(true);
      setErrPastHealth("");
      const response = await axiosXanoStaff.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.authToken}`,
        },
        params: {
          patient_id: patientId,
          paging,
        },
        signal: abortController.signal,
      });
      if (abortController.signal.aborted) return;
      console.log(url, response.data.items);
      setTopicDatas((prevDatas) => [...prevDatas, ...response.data.items]);
      setHasMore(response.data.items.length > 0);
      setLoading(false);
    } catch (err) {
      if (err.name !== "CanceledError") {
        setErr(err.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const fetchRecord = async () => {
      setLoadingRecord(true);
      await fetchTopicDatas(
        "/past_health_of_patient",
        setPastHealth,
        pagingPastHealth,
        setHasMorePastHealth,
        setLoadingPastHealth,
        setErrPastHealth,
        abortController
      );
      await fetchTopicDatas(
        "/family_history_of_patient",
        setFamHistory,
        pagingFamHistory,
        setHasMoreFamHistory,
        setLoadingFamHistory,
        setErrFamHistory,
        abortController
      );
      await fetchTopicDatas(
        "/relationships_of_patient",
        setRelationships,
        pagingRelationships,
        setHasMoreRelationships,
        setLoadingRelationships,
        setErrRelationships,
        abortController
      );
      await fetchTopicDatas(
        "/alerts_for_patient",
        setAlerts,
        pagingAlerts,
        setHasMoreAlerts,
        setLoadingAlerts,
        setErrAlerts,
        abortController
      );
      await fetchTopicDatas(
        "/risk_factors_of_patient",
        setRisks,
        pagingRisks,
        setHasMoreRisks,
        setLoadingRisks,
        setErrRisks,
        abortController
      );
      await fetchTopicDatas(
        "/medications_of_patient",
        setMedications,
        pagingMedications,
        setHasMoreMedications,
        setLoadingMedications,
        setErrMedications,
        abortController
      );
      await fetchTopicDatas(
        "/doctors",
        setDoctors,
        pagingDoctors,
        setHasMoreDoctors,
        setLoadingDoctors,
        setErrDoctors,
        abortController
      );
      await fetchTopicDatas(
        "/pharmacies",
        setPharmacies,
        pagingPharmacies,
        setHasMorePharmacies,
        setLoadingPharmacies,
        setErrPharmacies,
        abortController
      );
      await fetchTopicDatas(
        "/eforms_of_patient",
        setEforms,
        pagingEforms,
        setHasMoreEforms,
        setLoadingEforms,
        setErrEforms,
        abortController
      );
      await fetchTopicDatas(
        "/reminders_for_patient",
        setReminders,
        pagingReminders,
        setHasMoreReminders,
        setLoadingReminders,
        setErrReminders,
        abortController
      );
      await fetchTopicDatas(
        "/personal_history_of_patient",
        setPersonalHistory,
        pagingPersonalHistory,
        setHasMorePersonalHistory,
        setLoadingPersonalHistory,
        setErrPersonalHistory,
        abortController
      );
      await fetchTopicDatas(
        "/care_elements_of_patient",
        setCareElements,
        pagingCareElements,
        setHasMoreCareElements,
        setLoadingCareElements,
        setErrCareElements,
        abortController
      );
      await fetchTopicDatas(
        "/problemlist_for_patient",
        setProblemList,
        pagingProblemList,
        setHasMoreProblemList,
        setLoadingProblemList,
        setErrProblemList,
        abortController
      );
      await fetchTopicDatas(
        "/pregnancies_for_patient",
        setPregnancies,
        pagingPregnancies,
        setHasMorePregnancies,
        setLoadingPregnancies,
        setErrPregnancies,
        abortController
      );
      await fetchTopicDatas(
        "/allergies_for_patient",
        setAllergies,
        pagingAllergies,
        setHasMoreAllergies,
        setLoadingAllergies,
        setErrAllergies,
        abortController
      );
      await fetchTopicDatas(
        "/laboratory_results_for_patient",
        setLabResults,
        pagingLabResults,
        setHasMoreLabResults,
        setLoadingLabResults,
        setErrLabResults,
        abortController
      );
      await fetchTopicDatas(
        "/reports_received_for_patient",
        setReportsReceived,
        pagingReportsReceived,
        setHasMoreReportsReceived,
        setLoadingReportsReceived,
        setErrReportsReceived,
        abortController
      );
      await fetchTopicDatas(
        "/reports_sent_for_patient",
        setReportsSent,
        pagingReportsSent,
        setHasMoreReportsSent,
        setLoadingReportsSent,
        setErrReportsSent,
        abortController
      );
      await fetchTopicDatas(
        "/immunizations_of_patient",
        setImmunizations,
        pagingImmunizations,
        setHasMoreImmunizations,
        setLoadingImmunizations,
        setErrImmunizations,
        abortController
      );
      await fetchTopicDatas(
        "/appointments_for_patient",
        setAppointments,
        pagingAppointments,
        setHasMoreAppointments,
        setLoadingAppointments,
        setErrAppointments,
        abortController
      );
      await fetchTopicDatas(
        "/messages_about_patient",
        setMessagesAbout,
        pagingMessagesAbout,
        setHasMoreMessagesAbout,
        setLoadingMessagesAbout,
        setErrMessagesAbout,
        abortController
      );
      await fetchTopicDatas(
        "/messages_external_for_patient",
        setMessagesWith,
        pagingMessagesWith,
        setHasMoreMessagesWith,
        setLoadingMessagesWith,
        setErrMessagesWith,
        abortController
      );
      setLoadingRecord(false);
    };
    fetchRecord();
    return () => abortController.abort();
  }, []);

  return {
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
    setMessagesAbout,
    loadingMessagesAbout,
    setLoadingMessagesAbout,
    errMessagesAbout,
    setErrMessagesAbout,
    hasMoreMessagesAbout,
    setHasMoreMessagesAbout,
    pagingMessagesAbout,
    setPagingMessagesAbout,

    messagesWith,
    setMessagesWith,
    loadingMessagesWith,
    setLoadingMessagesWith,
    errMessagesWith,
    setErrMessagesWith,
    hasMoreMessagesWith,
    setHasMoreMessagesWith,
    pagingMessagesWith,
    setPagingMessagesWith,
  };
};

export default useFetchPatientRecord;
