export const onMessagePatientAppointments = (
  message,
  appointments,
  setAppointments,
  patientId
) => {
  if (message.route !== "APPOINTMENTS") return;
  switch (message.action) {
    case "create":
      if (!message.content.data.patients_guests_ids.includes(patientId)) {
        break;
      }
      setAppointments([...appointments, message.content.data]);
      break;
    case "update":
      if (!message.content.data.patients_guests_ids.includes(patientId)) {
        if (
          appointments.find(
            ({ id }) => parseInt(id) === parseInt(message.content.id)
          )
        ) {
          setAppointments(
            appointments.filter(
              ({ id }) => parseInt(id) !== parseInt(message.content.id)
            )
          );
          break;
        } else {
          break;
        }
      } else if (
        appointments.find(
          ({ id }) => parseInt(id) === parseInt(message.content.id)
        )
      ) {
        setAppointments(
          appointments.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        );
        break;
      } else {
        setAppointments([...appointments, message.content.data]);
        break;
      }
    case "delete":
      setAppointments(
        appointments.filter(
          ({ id }) => parseInt(id) !== parseInt(message.content.id)
        )
      );
      break;
    default:
      break;
  }
};
