import React, { useState } from "react";
import GuestsSearchForm from "./GuestsSearchForm";
import GuestsSearchResults from "./GuestsSearchResults";

const GuestsSearch = ({
  handleAddGuest,
  staffInfos,
  demographicsInfos,
  staffGuestsInfos,
  patientsGuestsInfos,
  hostId,
}) => {
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });

  return (
    <>
      <GuestsSearchForm search={search} setSearch={setSearch} />
      <GuestsSearchResults
        search={search}
        handleAddGuest={handleAddGuest}
        staffInfos={staffInfos}
        demographicsInfos={demographicsInfos}
        staffGuestsInfos={staffGuestsInfos}
        patientsGuestsInfos={patientsGuestsInfos}
        hostId={hostId}
      />
    </>
  );
};

export default GuestsSearch;
