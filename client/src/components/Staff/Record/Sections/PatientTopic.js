import React, { useRef, useState } from "react";
import useFetchTopicDatas from "../../../../hooks/useFetchTopicDatas";
import useTopicSocket from "../../../../hooks/useTopicSocket";
import { toPatientName } from "../../../../utils/toPatientName";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import AlertsPU from "../Popups/AlertsPU";
import DemographicsPU from "../Popups/DemographicsPU";
import EformsPU from "../Popups/EformsPU";
import FamHistoryPU from "../Popups/FamHistoryPU";
import FamilyDoctorsPU from "../Popups/FamilyDoctorsPU";
import MedicationsPU from "../Popups/MedicationsPU";
import PastHealthPU from "../Popups/PastHealthPU";
import PersonalHistoryPU from "../Popups/PersonalHistoryPU";
import PharmaciesPU from "../Popups/PharmaciesPU";
import RelationshipsPU from "../Popups/RelationshipsPU";
import RiskPU from "../Popups/RiskPU";
import AlertsContent from "../Topics/Alerts/AlertContent";
import DemographicsContent from "../Topics/Demographics/DemographicsContent";
import EformsContent from "../Topics/Eforms/EformsContent";
import FamHistoryContent from "../Topics/Family/FamHistoryContent";
import FamilyDoctorsContent from "../Topics/FamilyDoctors/FamilyDoctorsContent";
import MedicationsContent from "../Topics/Medications/MedicationsContent";
import PastHealthContent from "../Topics/PastHealth/PastHealthContent";
import PersonalHistoryContent from "../Topics/PersonalHistory/PersonalHistoryContent";
import PharmaciesContent from "../Topics/Pharmacies/PharmaciesContent";
import RelationshipsContent from "../Topics/Relationships/RelationshipsContent";
import RiskContent from "../Topics/Risks/RiskContent";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopic = ({
  url = null,
  backgroundColor,
  textColor,
  topic,
  patientName,
  patientId,
  demographicsInfos = null,
  allContentsVisible,
  side,
  loadingPatient = null,
  errPatient = null,
}) => {
  //HOOKS
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef("null");

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //DATAS
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const { topicDatas, setTopicDatas, loading, errMsg, hasMore } =
    useFetchTopicDatas(url, paging, patientId);

  //SOCKET
  useTopicSocket(topic, topicDatas, setTopicDatas, patientId);

  //HANDLERS
  const handlePopUpClick = (e) => {
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.target.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
      >
        <PatientTopicHeader
          topic={topic}
          handleTriangleClick={handleTriangleClick}
          handlePopUpClick={handlePopUpClick}
          allContentsVisible={allContentsVisible}
          popUpButton={
            topic === "MESSAGES WITH PATIENT" ||
            topic === "MESSAGES ABOUT PATIENT"
              ? false
              : true
          }
        />
      </div>
      <div
        className={
          allContentsVisible
            ? topic === "PERSONAL HISTORY" || topic === "MESSAGES WITH PATIENT"
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
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* FAMILY HISTORY */}
        {topic === "FAMILY HISTORY" && (
          <FamHistoryContent
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
            <FamHistoryPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
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
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
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
            title={`ALERTS & SPECIAL NEEDS about ${toPatientName(
              demographicsInfos
            )}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AlertsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
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
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
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
            title={`MEDICATIONS AND TREATMENTS for ${toPatientName(
              demographicsInfos
            )}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <MedicationsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* FAMILY DOCTORS */}
        {topic === "FAMILY DOCTORS/SPECIALISTS" && (
          <FamilyDoctorsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "FAMILY DOCTORS/SPECIALISTS" && popUpVisible && (
          <FakeWindow
            title={`FAMILY DOCTORS & SPECIALISTS of ${toPatientName(
              demographicsInfos
            )}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <FamilyDoctorsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              // hasMore={hasMore} not needed
              // setPaging={setPaging} not needed
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
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
            title={`PHARMACIES of ${patientName}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PharmaciesPU
              patientId={patientId}
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
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
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
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
        {/* {topic === "CARE ELEMENTS" && (
          <CareElementsContent datas={datas} loading={loading} err={err} />
        )} */}
        {/* {topic === "CARE ELEMENTS" && popUpVisible && (
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
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              loading={loading}
              err={err}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )} */}
        {/*******************/}
        {/* PROBLEM LIST */}
        {/* {topic === "PROBLEM LIST" && (
          <ProblemListContent datas={datas} loading={loading} err={err} />
        )} */}
        {/* {topic === "PROBLEM LIST" && popUpVisible && (
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
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              loading={loading}
              err={err}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )} */}
        {/*******************/}

        {/* REMINDERS */}
        {/* {topic === "REMINDERS" && (
          <RemindersContent datas={datas} loading={loading} err={err} />
        )} */}
        {/* {topic === "REMINDERS" && popUpVisible && (
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
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              loading={loading}
              err={err}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )} */}
        {/*******************/}

        {/* PREGNANCIES */}
        {/* {topic === "PREGNANCIES" && (
          <PregnanciesContent datas={datas} loading={loading} err={err} />
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
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              loading={loading}
              err={err}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )} */}
        {/*******************/}

        {/* ALLERGIES */}
        {/* {topic === "ALLERGIES & ADVERSE REACTIONS" && (
          <AllergiesContent datas={datas} loading={loading} err={err} />
        )}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && popUpVisible && (
          <FakeWindow
            title={`ALLERGIES & ADVERSE REACTIONS of ${toPatientName(
              demographicsInfos
            )}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AllergiesPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              loading={loading}
              err={err}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )} */}

        {/* LAB RESULTS */}
        {/* {topic === "LABORATORY RESULTS" && (
          <LabResultsContent datas={datas} loading={loading} err={err} />
        )} */}
        {/*******************/}

        {/* REPORTS */}
        {/* {topic === "REPORTS" && (
          <ReportsContent datas={datas} loading={loading} err={err} />
        )}
        {topic === "REPORTS" && popUpVisible && (
          <FakeWindow
            title={`REPORTS about ${patientName}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ReportsPU
              patientId={patientId}
              demographicsInfos={demographicsInfos}
              datas={datas}
              loading={loading}
              err={err}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )} */}
        {/*******************/}

        {/* IMMUNIZATIONS */}
        {/* {topic === "IMMUNIZATIONS" && (
          <ImmunizationsContent datas={datas} loading={loading} err={err} />
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
              datas={datas}
              setDatas={setDatas}
              loading={loading}
              err={err}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
              patientId={patientId}
            />
          </FakeWindow>
        )} */}
        {/*******************/}

        {/* APPOINTMENTS */}
        {/* {topic === "APPOINTMENTS" && (
          <AppointmentsContent datas={datas} loading={loading} err={err} />
        )} */}
        {/* {topic === "APPOINTMENTS" && popUpVisible && (
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
              patientId={patientId}
              demographicsInfos={demographicsInfos}
              datas={datas}
              setDatas={setDatas}
              loading={loading}
              err={err}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )} */}
        {/*******************/}
        {/* MESSAGES ABOUT PATIENT */}
        {/* {topic === "MESSAGES ABOUT PATIENT" && (
          <MessagesContent datas={datas} loading={loading} err={err} />
        )} */}
        {/*******************/}
        {/* MESSAGES WITH PATIENT */}
        {/* {topic === "MESSAGES WITH PATIENT" && (
          <MessagesExternalContent datas={datas} loading={loading} err={err} />
        )} */}
        {/*******************/}
      </div>
    </div>
  );
};

export default PatientTopic;
