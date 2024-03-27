import React, { useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useFetchDoctorsList from "../../../hooks/useFetchDoctorsList";
import useIntersection from "../../../hooks/useIntersection";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";

const ReferringOHIPSearch = ({ handleClickRefOHIP }) => {
  const [search, setSearch] = useState("");
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 15,
    offset: 0,
  });
  const { loading, err, doctors, hasMore } = useFetchDoctorsList(
    search,
    paging
  );
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);
  const { staffInfos } = useStaffInfosContext();
  const clinicDoctors = staffInfos.filter(({ title }) => title === "Doctor");

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPaging({ ...paging, page: 1 });
  };

  return (
    <div className="refohip__container">
      <div className="refohip-search">
        <label htmlFor="">Search</label>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="OHIP#, Name"
        />
      </div>
      <p
        style={{
          padding: 0,
          marginBottom: "5px",
          fontWeight: "bold",
        }}
      >
        External doctors
      </p>
      {err && <p className="refohip__err">Unable to fetch doctors datas</p>}
      <ul className="refohip-results" ref={rootRef}>
        <li className="refohip-results__item refohip-results__item--headers">
          <span className="refohip-results__code">OHIP#</span>{" "}
          <span
            className="refohip-results__name"
            style={{ fontWeight: "bold" }}
          >
            Name
          </span>
        </li>
        {!err && doctors && doctors.length > 0
          ? doctors.map((item, index) =>
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
                    Dr. {item.FirstName} {item.LastName} (
                    {item.speciality || ""},{" "}
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
                    Dr. {item.FirstName} {item.LastName} (
                    {item.speciality || ""},{" "}
                    {item.Address?.Structured?.City || ""})
                  </span>
                </li>
              )
            )
          : !loading && (
              <EmptyLi paddingLateral={20} text="No external doctors" />
            )}
        {loading && <LoadingLi paddingLateral={20} />}
      </ul>
      <p
        style={{
          padding: 0,
          marginBottom: "5px",
          fontWeight: "bold",
          marginTop: "20px",
        }}
      >
        Clinic doctors
      </p>
      <ul className="refohip-results">
        <li className="refohip-results__item refohip-results__item--headers">
          <span className="refohip-results__code">OHIP#</span>{" "}
          <span
            className="refohip-results__name"
            style={{ fontWeight: "bold" }}
          >
            Name
          </span>
        </li>
        {clinicDoctors
          .filter(
            (clinicDoctor) =>
              clinicDoctor.full_name.includes(search) ||
              clinicDoctor.ohip_billing_nbr.includes(search)
          )
          .map((item) => (
            <li
              className="refohip-results__item"
              key={item.id}
              onClick={(e) => handleClickRefOHIP(e, item.ohip_billing_nbr)}
            >
              <span className="refohip-results__code">
                {item.ohip_billing_nbr}
              </span>{" "}
              <span className="refohip-results__name">
                Dr. {item.first_name} {item.last_name} ({item.speciality})
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ReferringOHIPSearch;
