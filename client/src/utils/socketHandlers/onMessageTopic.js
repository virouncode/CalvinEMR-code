export const onMessageTopic = (message, topic, datas, setDatas, patientId) => {
  //if the route is not the topic
  if (message.route !== topic) return;
  // On vire tout ce qui ne concerne pas directement un patient ou que un patient
  if (
    topic === "DEMOGRAPHICS" //because there is already a socket on the patientRecord component
    // ||
    // topic === "APPOINTMENTS" ||
    // topic === "MESSAGES ABOUT PATIENT" ||
    // topic === "MESSAGES WITH PATIENT"
  )
    return;
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
  } else if (topic === "FAMILY DOCTORS/SPECIALISTS" || topic === "PHARMACIES") {
    console.log(topic);
    //we don't care about the patientId because the doctors/pharmacies database are used for everyone
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
      default:
        break;
    }
  } else if (topic === "PREFERRED PHARMACY") {
    switch (message.action) {
      case "update":
        if (datas.id !== message.content.id) break; //la pharmacie en question n'est pas la pref du patient
        setDatas(message.content.data); //c'est la pref du patient: on change les infos de la pharmacie
        break;
      case "refresh":
        if (message.patientId !== patientId) return; //ca ne doit concerner que le patient actuel
        setDatas(message.content.data);
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

// //(message.route !== topic) POURQUOI JE L'AI MIS APRES
// // if (
// //   message.route === "MESSAGES INBOX" &&
// //   topic === "MESSAGES ABOUT PATIENT"
// // ) {
// //   switch (message.action) {
// //     case "create":
// //       if (message.content.data.related_patient_id !== patientId) return;
// //       setDatas([message.content.data, ...datas]);
// //       break;
// //     case "update":
// //       if (message.content.data.related_patient_id !== patientId) return;
// //       setDatas(
// //         datas.map((item) =>
// //           item.id === message.content.id ? message.content.data : item
// //         )
// //       );
// //       break;
// //     case "delete":
// //       setDatas(datas.filter((item) => item.id !== message.content.id));
// //       break;
// //     default:
// //       break;
// //   }
// // } else if (
// //   message.route === "MESSAGES INBOX EXTERNAL" &&
// //   topic === "MESSAGES WITH PATIENT"
// // ) {
// //   switch (message.action) {
// //     case "create":
// //       if (
// //         (message.content.data.from_user_type === "patient" &&
// //           message.content.data.from_id !== patientId) ||
// //         (message.content.data.to_user_type === "patient" &&
// //           message.content.data.to_id !== patientId)
// //       )
// //         return;
// //       setDatas([message.content.data, ...datas]);
// //       break;
// //     case "update":
// //       setDatas(
// //         datas.map((item) =>
// //           item.id === message.content.id ? message.content.data : item
// //         )
// //       );
// //       break;
// //     case "delete":
// //       setDatas(datas.filter((item) => item.id !== message.content.id));
// //       break;
// //     default:
// //       break;
// //   }
// if (message.route !== topic || message.patient_id !== patientId) {
//   //si ça ne concerne pas le topic ou le patient
//   return;
// }

// if (message.route === "APPOINTMENTS") {
//   switch (message.action) {
//     case "create":
//       if (!message.content.data.patients_guests_ids.includes(patientId)) {
//         break;
//       }
//       setDatas([...datas, message.content.data]);
//       break;
//     case "update":
//       if (!message.content.data.patients_guests_ids.includes(patientId)) {
//         if (
//           datas.find(({ id }) => parseInt(id) === parseInt(message.content.id))
//         ) {
//           setDatas(
//             datas.filter(
//               ({ id }) => parseInt(id) !== parseInt(message.content.id)
//             )
//           );
//           break;
//         } else {
//           break;
//         }
//       } else if (
//         datas.find(({ id }) => parseInt(id) === parseInt(message.content.id))
//       ) {
//         setDatas(
//           datas.map((item) =>
//             item.id === message.content.id ? message.content.data : item
//           )
//         );
//         break;
//       } else {
//         setDatas([...datas, message.content.data]);
//         break;
//       }
//     case "delete":
//       setDatas(
//         datas.filter(({ id }) => parseInt(id) !== parseInt(message.content.id))
//       );
//       break;
//     default:
//       break;
//   }
// } else if (
//   message.route === "FAMILY DOCTORS/SPECIALISTS" ||
//   message.route === "PHARMACIES"
// ) {
//   switch (message.action) {
//     case "create":
//       setDatas([message.content.data, ...datas]);
//       break;
//     case "update":
//       setDatas(
//         datas.map((item) =>
//           item.id === message.content.id ? message.content.data : item
//         )
//       );
//       break;
//     case "delete":
//       setDatas(datas.filter((item) => item.id !== message.content.id));
//       break;
//     case "refresh":
//       setDatas([...datas]);
//       break;
//     default:
//       break;
//   }
// } else if (message.route === "PATIENT DOCTORS") {
//   switch (message.action) {
//     case "create":
//       if (!message.content.data.patients.includes(patientId)) {
//         break;
//       }
//       setDatas([message.content.data, ...datas]);
//       break;
//     case "update":
//       if (!message.content.data.patients.includes(patientId)) {
//         break;
//       }
//       setDatas(
//         datas.map((item) =>
//           item.id === message.content.id ? message.content.data : item
//         )
//       );
//       break;
//     case "delete":
//       if (message.content.patient_id !== patientId) break;
//       setDatas(datas.filter((item) => item.id !== message.content.id));
//       break;
//     case "refresh":
//       setDatas([...datas]);
//       break;
//     default:
//       break;
//   }
// } else {
// }
