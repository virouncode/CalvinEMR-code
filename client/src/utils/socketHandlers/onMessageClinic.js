export const onMessageClinic = (message, clinic, setClinic) => {
  if (message.route !== "PATIENTS" && message.route !== "STAFF") return;
  if (message.route === "PATIENTS") {
    switch (message.action) {
      case "create":
        setClinic({
          ...clinic,
          patientsInfos: [...clinic.patientsInfos, message.content.data],
        });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            ...clinic,
            patientsInfos: [...clinic.patientsInfos, message.content.data],
          })
        );
        break;
      case "update":
        setClinic({
          ...clinic,
          patientsInfos: clinic.patientsInfos.map((patient) =>
            patient.id === message.content.id ? message.content.data : patient
          ),
        });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            ...clinic,
            patientsInfos: clinic.patientsInfos.map((patient) =>
              patient.id === message.content.id ? message.content.data : patient
            ),
          })
        );
        break;
      default:
        break;
    }
  } else if (message.route === "STAFF") {
    switch (message.action) {
      case "create":
        setClinic({
          ...clinic,
          staffInfos: [...clinic.staffInfos, message.content.data].sort(
            (a, b) => a.last_name.localeCompare(b.last_name)
          ),
        });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            ...clinic,
            staffInfos: [...clinic.staffInfos, message.content.data].sort(
              (a, b) => a.last_name.localeCompare(b.last_name)
            ),
          })
        );
        break;
      case "update":
        setClinic({
          ...clinic,
          staffInfos: clinic.staffInfos
            .map((staff) =>
              staff.id === message.content.id ? message.content.data : staff
            )
            .sort((a, b) => a.last_name.localeCompare(b.last_name)),
        });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            ...clinic,
            staffInfos: clinic.staffInfos
              .map((staff) =>
                staff.id === message.content.id ? message.content.data : staff
              )
              .sort((a, b) => a.last_name.localeCompare(b.last_name)),
          })
        );
        break;
      default:
        break;
    }
  } else if (message.route === "DEMOGRAPHICS") {
    switch (message.action) {
      case "create":
        setClinic({
          ...clinic,
          demographicsInfos: [
            ...clinic.demographicsInfos,
            message.content.data,
          ].sort((a, b) =>
            a.Names.LegalName.LastName.Part.localeCompare(
              b.Names.LegalName.LastName.Part
            )
          ),
        });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            ...clinic,
            demographicsInfos: [
              ...clinic.demographicsInfos,
              message.content.data,
            ].sort((a, b) =>
              a.Names.LegalName.LastName.Part.localeCompare(
                b.Names.LegalName.LastName.Part
              )
            ),
          })
        );
        break;
      case "update":
        setClinic({
          ...clinic,
          demographicsInfos: clinic.demographicsInfos
            .map((demographicsInfo) =>
              demographicsInfo.id === message.content.id
                ? message.content.data
                : demographicsInfo
            )
            .sort((a, b) =>
              a.Names.LegalName.LastName.Part.localeCompare(
                b.Names.LegalName.LastName.Part
              )
            ),
        });
        localStorage.setItem(
          "clinic",
          JSON.stringify({
            ...clinic,
            demographicsInfos: clinic.demographicsInfos
              .map((demographicsInfo) =>
                demographicsInfo.id === message.content.id
                  ? message.content.data
                  : demographicsInfo
              )
              .sort((a, b) =>
                a.Names.LegalName.LastName.Part.localeCompare(
                  b.Names.LegalName.LastName.Part
                )
              ),
          })
        );
        break;
      default:
        break;
    }
  }
};
