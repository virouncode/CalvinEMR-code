import React from "react";
import GuestsSearchForm from "./GuestsSearchForm";
import GuestsSearchResults from "./GuestsSearchResults";

const GuestsSearch = ({
  search,
  handleSearch,
  patientsDemographics,
  hostId,
  handleAddGuest,
  hasMore,
  setPaging,
  loading,
}) => {
  return (
    <>
      <GuestsSearchForm search={search} handleSearch={handleSearch} />
      <GuestsSearchResults
        search={search}
        handleAddGuest={handleAddGuest}
        patientsDemographics={patientsDemographics}
        hostId={hostId}
        hasMore={hasMore}
        setPaging={setPaging}
        loading={loading}
      />
    </>
  );
};

export default GuestsSearch;
