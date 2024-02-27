import React, { useState } from "react";
import useFetchDoctorsList from "../../../hooks/useFetchDoctorsList";
import useIntersection from "../../../hooks/useIntersection";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";

const ReferringOHIPSearch = ({ handleClickRefOHIP }) => {
  const [search, setSearch] = useState("");
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 15,
    offset: 0,
  });
  const { loading, err, doctors, setDoctors, hasMore } = useFetchDoctorsList(
    search,
    paging
  );
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPaging({ ...paging, page: 1 });
  };

  return (
    <div className="refohip__container" ref={rootRef}>
      <div className="refohip-search">
        <label htmlFor="">Search</label>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="OHIP#, Name"
        />
      </div>
      {err && <p className="refohip__err">Unable to fetch doctors datas</p>}
      {!err && doctors && doctors.length > 0 ? (
        <ul className="refohip-results">
          {doctors.map((item, index) =>
            index === doctors.length - 1 ? (
              <li
                className="refohip-results__item"
                key={item.id}
                onClick={(e) => handleClickRefOHIP(e, item.ohip_billing_nbr)}
                ref={lastItemRef}
              >
                <span className="refohip-results__code">
                  {item.ohip_billing_nbr}
                </span>{" "}
                <span className="refohip-results__name">
                  Dr. {item.FirstName} {item.LastName} ({item.speciality || ""},{" "}
                  {item.Address?.Structured?.City || ""})
                </span>
              </li>
            ) : (
              <li
                className="refohip-results__item"
                key={item.id}
                onClick={(e) => handleClickRefOHIP(e, item.ohip_billing_nbr)}
              >
                <span className="refohip-results__code">
                  {item.ohip_billing_nbr}
                </span>{" "}
                <span className="refohip-results__name">
                  Dr. {item.FirstName} {item.LastName} ({item.speciality || ""},{" "}
                  {item.Address?.Structured?.City || ""})
                </span>
              </li>
            )
          )}
        </ul>
      ) : (
        !loading && <EmptyParagraph text="No corresponding doctors" />
      )}
      {loading && <LoadingParagraph />}
    </div>
  );
};

export default ReferringOHIPSearch;
