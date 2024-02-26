export const onMessageTopic = (message, topic, datas, setDatas, patientId) => {
  //if the route is not the topic
  if (message.route !== topic) return;
  // On vire tout ce qui ne concerne pas directement un patient ou que un patient
  if (
    topic === "DEMOGRAPHICS" //because there is already a socket on the patientRecord component
    // topic === "MESSAGES ABOUT PATIENT" ||
    // topic === "MESSAGES WITH PATIENT"
  ) {
    return;
  }
  if (topic === "PATIENT DOCTORS") {
    if (message.patientId !== patientId) return;
    switch (message.action) {
      case "create":
        setDatas([message.content.data, ...datas]);
        break;
      case "update":
        setDatas(
          datas.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        );
        break;
      case "delete":
        setDatas(datas.filter((item) => item.id !== message.content.id));
        break;
      default:
        break;
    }
  } else if (topic === "PREFERRED PHARMACY") {
    switch (message.action) {
      case "update":
        if (datas.id === message.content.id) {
          //la pharmacie en question est la pref du patient
          setDatas(message.content.data);
        }
        break;
      case "refresh":
        if (message.patientId === patientId) {
          //le message concerne le patient actuel
          setDatas(message.content.data);
        }
        break;
      default:
        break;
    }
  } else if (topic === "FAMILY DOCTORS/SPECIALISTS" || topic === "PHARMACIES") {
    switch (message.action) {
      case "create": //we don't check because the doctors/pharmacies database are used for everyone
        setDatas([message.content.data, ...datas]);
        break;
      case "update": //we don't check because the doctors/pharmacies database are used for everyone
        setDatas(
          datas.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        );
        break;
      default:
        break;
    }
  } else if (message.route === "APPOINTMENTS") {
    //we talk about the patient's appointments, don't think about the calendar because it is connected to useEventsSocket
    console.log(message);
    switch (message.action) {
      case "create":
        if (
          message.content.data.patients_guests_ids.find(
            ({ patient_infos }) => patient_infos.patient_id === patientId
          )
        ) {
          //the new appointment contains the current patient
          setDatas([...datas, message.content.data]);
        }
        break;
      case "update":
        if (
          message.content.data.patients_guests_ids.find(
            ({ patient_infos }) => patient_infos.patient_id === patientId
          )
        ) {
          //the appointment to update contains the current patient
          if (
            datas.find(
              ({ id }) => parseInt(id) === parseInt(message.content.id)
            ) //the patient's appointmts already contains the appointment
          ) {
            setDatas(
              datas.map((item) =>
                item.id === message.content.id ? message.content.data : item
              )
            );
          } else {
            //the patient was added to an exiting appointment
            setDatas([message.content.data, ...datas]);
          }
        } else {
          //the appointment to update doesn't contains the patientId
          if (
            datas.find(
              ({ id }) => parseInt(id) === parseInt(message.content.id)
            ) //the patient's appointmts already contains the appointment => the patient was removed from this appointment => delete the appointment
          ) {
            setDatas(
              datas.filter(
                ({ id }) => parseInt(id) !== parseInt(message.content.id)
              )
            );
          }
        }
        break;
      case "delete": //delete the appointment for all guests
        setDatas(
          datas.filter(
            ({ id }) => parseInt(id) !== parseInt(message.content.id)
          )
        );
        break;
      default:
        break;
    }
  } else if (message.route === "MESSAGES ABOUT PATIENT") {
    switch (message.action) {
      case "create":
        if (message.content.data.related_patient_id === patientId) {
          setDatas([message.content.data, ...datas]);
        }
        break;
      case "update":
        if (message.content.data.related_patient_id === patientId) {
          setDatas(
            datas.map((item) =>
              item.id === message.content.id ? message.content.data : item
            )
          );
        }
        break;
      default:
        break;
    }
  } else if (message.route === "MESSAGES WITH PATIENT") {
    switch (message.action) {
      case "create":
        if (
          (message.content.data.from_patient_id &&
            message.content.data.from_patient_id === patientId) ||
          (message.content.data.to_patient_id &&
            message.content.data.to_patient_id === patientId)
        ) {
          setDatas([message.content.data, ...datas]);
        }
        break;
      case "update":
        if (
          (message.content.data.from_patient_id &&
            message.content.data.from_patient_id === patientId) ||
          (message.content.data.to_patient_id &&
            message.content.data.to_patient_id === patientId)
        ) {
          setDatas(
            datas.map((item) =>
              item.id === message.content.id ? message.content.data : item
            )
          );
        }
        break;
      default:
        break;
    }
  } else {
    switch (message.action) {
      case "create":
        if (message.content.data.patient_id !== patientId) break;
        setDatas([message.content.data, ...datas]);
        break;
      case "update":
        if (message.content.data.patient_id !== patientId) break;
        setDatas(
          datas.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        );
        break;
      case "delete":
        setDatas(datas.filter((item) => item.id !== message.content.id));
        break;
      default:
        break;
    }
  }
};
