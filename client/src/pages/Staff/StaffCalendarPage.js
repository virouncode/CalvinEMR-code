import React from "react";
import { Helmet } from "react-helmet";
import Calendar from "../../components/Staff/Calendar/Calendar";
import useTitle from "../../hooks/useTitle";

const StaffCalendarPage = () => {
  useTitle("Calendar");
  return (
    <>
      <Helmet>
        <title>Calendar</title>
      </Helmet>
      <section className="calendar-section">
        <Calendar />
      </section>
    </>
  );
};

export default StaffCalendarPage;
