import React, { useRef, useState } from "react";
import useTopicSocket from "../../../../hooks/socket/useTopicSocket";
import { toPatientName } from "../../../../utils/names/toPatientName";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import NewMessageExternal from "../../Messaging/External/NewMessageExternal";
import NewMessage from "../../Messaging/Internal/NewMessage";
import NewTodo from "../../Messaging/Internal/NewTodo";
import AlertsContent from "../Topics/Alerts/AlertContent";
import AlertsPU from "../Topics/Alerts/AlertsPU";
import AllergiesContent from "../Topics/Allergies/AllergiesContent";
import AllergiesPU from "../Topics/Allergies/AllergiesPU";
import AppointmentsContent from "../Topics/Appointments/AppointmentsContent";
import AppointmentsPU from "../Topics/Appointments/AppointmentsPU";
import CareElementsContent from "../Topics/CareElements/CareElementsContent";
import CareElementsPU from "../Topics/CareElements/CareElementsPU";
import DemographicsContent from "../Topics/Demographics/DemographicsContent";
import DemographicsPU from "../Topics/Demographics/DemographicsPU";
import EformsContent from "../Topics/Eforms/EformsContent";
import EformsPU from "../Topics/Eforms/EformsPU";
import FamilyHistoryContent from "../Topics/FamilyHistory/FamilyHistoryContent";
import FamilyHistoryPU from "../Topics/FamilyHistory/FamilyHistoryPU";
import ImmunizationsContent from "../Topics/Immunizations/ImmunizationsContent";
import ImmunizationsPU from "../Topics/Immunizations/ImmunizationsPU";
import LabResultsContent from "../Topics/LabResults/LabResultsContent";
import LabelsContent from "../Topics/Labels/LabelsContent";
import MedicationsContent from "../Topics/Medications/MedicationsContent";
import MedicationsPU from "../Topics/Medications/MedicationsPU";
import MessagesContent from "../Topics/MessagesAboutPatient/MessagesContent";
import MessagesExternalContent from "../Topics/MessagesWithPatient/MessagesExternalContent";
import PastHealthContent from "../Topics/PastHealth/PastHealthContent";
import PastHealthPU from "../Topics/PastHealth/PastHealthPU";
import PersonalHistoryContent from "../Topics/PersonalHistory/PersonalHistoryContent";
import PersonalHistoryPU from "../Topics/PersonalHistory/PersonalHistoryPU";
import PharmaciesContent from "../Topics/Pharmacies/PharmaciesContent";
import PharmaciesPU from "../Topics/Pharmacies/PharmaciesPU";
import PregnanciesContent from "../Topics/Pregnancies/PregnanciesContent";
import PregnanciesPU from "../Topics/Pregnancies/PregnanciesPU";
import PrescriptionsContent from "../Topics/Prescriptions/PrescriptionsContent";
import PrescriptionsPU from "../Topics/Prescriptions/PrescriptionsPU";
import ProblemListContent from "../Topics/ProblemList/ProblemListContent";
import ProblemListPU from "../Topics/ProblemList/ProblemListPU";
import RelationshipsContent from "../Topics/Relationships/RelationshipsContent";
import RelationshipsPU from "../Topics/Relationships/RelationshipsPU";
import RemindersContent from "../Topics/Reminders/RemindersContent";
import RemindersPU from "../Topics/Reminders/RemindersPU";
import RiskContent from "../Topics/Risks/RiskContent";
import RiskPU from "../Topics/Risks/RiskPU";
import TodosContent from "../Topics/Todos/TodosContent";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopic = ({
  backgroundColor,
  textColor,
  topic,
  patientName,
  patientId,
  patientDob = null,
  contentsVisible,
  side,
  topicDatas,
  setTopicDatas,
  loading,
  setLoading,
  errMsg,
  setErrMsg,
  hasMore,
  setHasMore,
  paging,
  setPaging,
  demographicsInfos = null,
  loadingPatient = null,
  errPatient = null,
}) => {
  //HOOKS
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef(null);
  const triangleRef = useRef(null);

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //SOCKET
  useTopicSocket(topic, topicDatas, setTopicDatas, patientId);

  //HANDLERS
  const handlePopUpClick = (e) => {
    e.stopPropagation();
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
    if (topic === "REMINDERS" || topic === "TO-DOS ABOUT PATIENT") {
      containerRef.current.classList.toggle(
        `patient-record__topic-container--bottom`
      );
    }
  };

  const handleClickHeader = () => {
    triangleRef.current.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
    if (topic === "REMINDERS" || topic === "TO-DOS ABOUT PATIENT") {
      containerRef.current.classList.toggle(
        `patient-record__topic-container--bottom`
      );
    }
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
        onClick={handleClickHeader}
      >
        <PatientTopicHeader
          topic={topic}
          handleTriangleClick={handleTriangleClick}
          handlePopUpClick={handlePopUpClick}
          contentsVisible={contentsVisible}
          popUpButton={
            topic === "MESSAGES WITH PATIENT" ||
            topic === "MESSAGES ABOUT PATIENT" ||
            topic === "TO-DOS ABOUT PATIENT"
              ? "paperPlane"
              : topic === "LABELS"
              ? ""
              : "popUp"
          }
          triangleRef={triangleRef}
        />
      </div>
      <div
        className={
          contentsVisible
            ? topic === "REMINDERS" || topic === "TO-DOS ABOUT PATIENT"
              ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active patient-record__topic-container--bottom`
              : `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        {/* DEMOGRAPHICS */}
        {topic === "DEMOGRAPHICS" && (
          <DemographicsContent
            demographicsInfos={demographicsInfos}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        )}
        {topic === "DEMOGRAPHICS" && popUpVisible && (
          <FakeWindow
            title={`DEMOGRAPHICS of ${patientName}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <DemographicsPU
              demographicsInfos={demographicsInfos}
              setPopUpVisible={setPopUpVisible}
              loadingPatient={loadingPatient}
              errPatient={errPatient}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PAST HEALTH */}
        {topic === "PAST HEALTH" && (
          <PastHealthContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "PAST HEALTH" && popUpVisible && (
          <FakeWindow
            title={`PAST HEALTH of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PastHealthPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* FAMILY HISTORY */}
        {topic === "FAMILY HISTORY" && (
          <FamilyHistoryContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "FAMILY HISTORY" && popUpVisible && (
          <FakeWindow
            title={`FAMILY HISTORY of ${patientName}`}
            width={1200}
            height={600}
            x={(window.innerWidth - 1200) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <FamilyHistoryPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* RELATIONSHIPS */}
        {topic === "RELATIONSHIPS" && (
          <RelationshipsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "RELATIONSHIPS" && popUpVisible && (
          <FakeWindow
            title={`RELATIONSHIPS of ${patientName}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RelationshipsPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* ALERTS AND SPECIAL NEEDS */}
        {topic === "ALERTS & SPECIAL NEEDS" && (
          <AlertsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "ALERTS & SPECIAL NEEDS" && popUpVisible && (
          <FakeWindow
            title={`ALERTS & SPECIAL NEEDS about ${patientName}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AlertsPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* RISK FACTORS */}
        {topic === "RISK FACTORS" && (
          <RiskContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "RISK FACTORS" && popUpVisible && (
          <FakeWindow
            title={`RISK FACTORS of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RiskPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MEDICATIONS AND TREATMENTS */}
        {topic === "MEDICATIONS AND TREATMENTS" && (
          <MedicationsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "MEDICATIONS AND TREATMENTS" && popUpVisible && (
          <FakeWindow
            title={`MEDICATIONS AND TREATMENTS for ${patientName}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <MedicationsPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PRESCRIPTIONS */}
        {topic === "PRESCRIPTIONS" && (
          <PrescriptionsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "PRESCRIPTIONS" && popUpVisible && (
          <FakeWindow
            title={`PRESCRIPTIONS for ${patientName}`}
            width={800}
            height={700}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 700) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PrescriptionsPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PHARMACIES */}
        {topic === "PHARMACIES" && (
          <PharmaciesContent
            patientId={patientId}
            demographicsInfos={demographicsInfos}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        )}
        {topic === "PHARMACIES" && popUpVisible && (
          <FakeWindow
            title={`PREFERRED PHARMACY of ${patientName}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PharmaciesPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/*E-FORMS */}
        {topic === "E-FORMS" && (
          <EformsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "E-FORMS" && popUpVisible && (
          <FakeWindow
            title={`ELECTRONIC FORMS of ${patientName}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <EformsPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* REMINDERS */}
        {topic === "REMINDERS" && (
          <RemindersContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "REMINDERS" && popUpVisible && (
          <FakeWindow
            title={`REMINDERS for ${patientName}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RemindersPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PERSONAL HISTORY */}
        {topic === "PERSONAL HISTORY" && (
          <PersonalHistoryContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "PERSONAL HISTORY" && popUpVisible && (
          <FakeWindow
            title={`PERSONAL HISTORY of ${patientName}`}
            width={800}
            height={500}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 500) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PersonalHistoryPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* CARE ELEMENTS */}
        {topic === "CARE ELEMENTS" && (
          <CareElementsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "CARE ELEMENTS" && popUpVisible && (
          <FakeWindow
            title={`CARE ELEMENTS of ${patientName}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <CareElementsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              patientName={patientName}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PROBLEM LIST */}
        {topic === "PROBLEM LIST" && (
          <ProblemListContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "PROBLEM LIST" && popUpVisible && (
          <FakeWindow
            title={`PROBLEM LIST of ${patientName}`}
            width={1250}
            height={600}
            x={(window.innerWidth - 1250) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ProblemListPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PREGNANCIES */}
        {topic === "PREGNANCIES" && (
          <PregnanciesContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "PREGNANCIES" && popUpVisible && (
          <FakeWindow
            title={`PREGNANCIES of ${patientName}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PregnanciesPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* ALLERGIES */}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && (
          <AllergiesContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && popUpVisible && (
          <FakeWindow
            title={`ALLERGIES & ADVERSE REACTIONS of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AllergiesPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/* LAB RESULTS */}
        {topic === "LABORATORY RESULTS" && (
          <LabResultsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {/*******************/}
        {/* LABELS */}
        {topic === "LABELS" && (
          <LabelsContent
            demographicsInfos={demographicsInfos}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        )}
        {/*******************/}
        {/* IMMUNIZATIONS */}
        {topic === "IMMUNIZATIONS" && (
          <ImmunizationsContent loading={loading} errMsg={errMsg} />
        )}
        {topic === "IMMUNIZATIONS" && popUpVisible && (
          <FakeWindow
            title={`IMMUNIZATIONS of ${patientName}`}
            width={1400}
            height={700}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 700) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ImmunizationsPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              patientDob={patientDob}
              loadingPatient={loadingPatient}
              errPatient={errPatient}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* APPOINTMENTS */}
        {topic === "APPOINTMENTS" && (
          <AppointmentsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "APPOINTMENTS" && popUpVisible && (
          <FakeWindow
            title={`APPOINTMENTS of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AppointmentsPU
              topicDatas={topicDatas}
              setTopicDatas={setTopicDatas}
              loading={loading}
              setLoading={setLoading}
              errMsg={errMsg}
              setErrMsg={setErrMsg}
              hasMore={hasMore}
              setHasMore={setHasMore}
              paging={paging}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MESSAGES ABOUT PATIENT */}
        {topic === "MESSAGES ABOUT PATIENT" && (
          <MessagesContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "MESSAGES ABOUT PATIENT" && popUpVisible && (
          <FakeWindow
            title="NEW MESSAGE"
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <NewMessage
              setNewVisible={setPopUpVisible}
              initialPatient={{
                id: patientId,
                name: toPatientName(demographicsInfos),
              }}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MESSAGES WITH PATIENT */}
        {topic === "MESSAGES WITH PATIENT" && (
          <MessagesExternalContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "MESSAGES WITH PATIENT" && popUpVisible && (
          <FakeWindow
            title="NEW MESSAGE"
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <NewMessageExternal
              setNewVisible={setPopUpVisible}
              initialRecipient={{
                id: patientId,
                name: toPatientName(demographicsInfos),
              }}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* TO-DOS ABOUT PATIENT */}
        {topic === "TO-DOS ABOUT PATIENT" && (
          <TodosContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "TO-DOS ABOUT PATIENT" && popUpVisible && (
          <FakeWindow
            title="NEW TO-DO"
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <NewTodo
              setNewTodoVisible={setPopUpVisible}
              initialPatient={{
                id: patientId,
                name: toPatientName(demographicsInfos),
              }}
            />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default PatientTopic;
