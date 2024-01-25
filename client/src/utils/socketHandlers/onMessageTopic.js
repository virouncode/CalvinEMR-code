export const onMessageTopic = (message, topic, datas, setDatas, patientId) => {
  if (topic === "DEMOGRAPHICS") return;
  if (
    message.route === "MESSAGES INBOX" &&
    topic === "MESSAGES ABOUT PATIENT"
  ) {
    switch (message.action) {
      case "create":
        if (message.content.data.related_patient_id !== patientId) return;
        setDatas([...datas, message.content.data]);
        break;
      case "update":
        if (message.content.data.related_patient_id !== patientId) return;
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
  } else if (
    message.route === "MESSAGES INBOX EXTERNAL" &&
    topic === "MESSAGES WITH PATIENT"
  ) {
    switch (message.action) {
      case "create":
        if (
          (message.content.data.from_user_type === "patient" &&
            message.content.data.from_id !== patientId) ||
          (message.content.data.to_user_type === "patient" &&
            message.content.data.to_id !== patientId)
        )
          return;
        setDatas([...datas, message.content.data]);
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
  } else if (message.route !== topic) return;
  else if (message.route === "APPOINTMENTS") {
    switch (message.action) {
      case "create":
        if (!message.content.data.patients_guests_ids.includes(patientId)) {
          break;
        }
        setDatas([...datas, message.content.data]);
        break;
      case "update":
        if (!message.content.data.patients_guests_ids.includes(patientId)) {
          if (
            datas.find(
              ({ id }) => parseInt(id) === parseInt(message.content.id)
            )
          ) {
            setDatas(
              datas.filter(
                ({ id }) => parseInt(id) !== parseInt(message.content.id)
              )
            );
            break;
          } else {
            break;
          }
        } else if (
          datas.find(({ id }) => parseInt(id) === parseInt(message.content.id))
        ) {
          setDatas(
            datas.map((item) =>
              item.id === message.content.id ? message.content.data : item
            )
          );
          break;
        } else {
          setDatas([...datas, message.content.data]);
          break;
        }
      case "delete":
        setDatas(
          datas.filter(
            ({ id }) => parseInt(id) !== parseInt(message.content.id)
          )
        );
        break;
      default:
        break;
    }
  } else if (
    message.route === "FAMILY DOCTORS/SPECIALISTS" ||
    message.route === "PHARMACIES"
  ) {
    switch (message.action) {
      case "create":
        setDatas([...datas, message.content.data]);
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
      case "refresh":
        setDatas([...datas]);
        break;
      default:
        break;
    }
  } else {
    switch (message.action) {
      case "create":
        if (message.content.data.patient_id !== patientId) {
          break;
        }
        setDatas([...datas, message.content.data]);
        break;
      case "update":
        if (message.content.data.patient_id !== patientId) {
          break;
        }
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
