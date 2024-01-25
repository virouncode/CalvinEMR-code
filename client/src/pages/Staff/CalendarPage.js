import React from "react";
import { Helmet } from "react-helmet";
import Calendar from "../../components/Staff/Calendar/Calendar";

const CalendarPage = () => {
  return (
    <>
      <Helmet>
        <title>Calendar</title>
      </Helmet>
      <section className="calendar-section">
        <h2 className="calendar-section__title">Calendar</h2>
        <Calendar />
      </section>
    </>
  );
};

export default CalendarPage;
