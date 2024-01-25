import dayGrid from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import list from "@fullcalendar/list";
import multimonth from "@fullcalendar/multimonth";
import FullCalendar from "@fullcalendar/react";
import timeGrid from "@fullcalendar/timegrid";
import React from "react";

const CalendarView = ({
  slotDuration,
  firstDay,
  fcRef,
  isSecretary,
  events,
  handleDatesSet,
  handleDateSelect,
  handleDragStart,
  handleEventClick,
  handleDrop,
  handleResize,
  handleResizeStart,
  renderEventContent,
}) => {
  return (
    <FullCalendar
      plugins={[dayGrid, timeGrid, list, multimonth, interaction]}
      //===================Design=====================//
      headerToolbar={{
        start: "title",
        center: "timeGrid timeGridWeek dayGridMonth multiMonthYear listWeek",
        end: "prev today next",
      }}
      slotLabelFormat={{
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: true,
        meridiem: "short",
      }}
      views={{
        timeGridWeek: {
          titleFormat: { year: "numeric", month: "short", day: "numeric" },
          eventMinHeight: 10,
          eventShortHeight: 30,
          dayHeaderFormat: {
            weekday: "short",
            day: "numeric",
            omitCommas: true,
          },
        },
        multiMonthYear: {
          multiMonthMaxColumns: 1, // force a single column
        },
      }}
      buttonText={{
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
        list: "List",
        timeGrid: "Day",
        year: "Year",
        resourceTimeline: "Timeline",
      }}
      initialView="timeGrid"
      slotDuration={slotDuration}
      firstDay={firstDay}
      weekNumbers={true}
      nowIndicator={true}
      eventTextColor="#FEFEFE"
      eventColor={isSecretary() ? "#bfbfbf" : "#6490D2"}
      slotLabelInterval="01:00"
      navLinks={true}
      navLinkDayClick="timeGrid"
      weekText="Week"
      dayMaxEventRows={true}
      dayMaxEvents={true}
      eventDisplay="block"
      //==================== INTERACTION ====================//
      selectable={true}
      selectMirror={true}
      eventResizableFromStart={true}
      editable={true}
      unselectAuto={false}
      allDayMaintainDuration={true}
      ref={fcRef}
      //==================== CALLBACKS ====================//
      events={events}
      datesSet={handleDatesSet}
      eventClick={handleEventClick}
      select={handleDateSelect}
      eventDragStart={handleDragStart}
      eventDrop={handleDrop}
      eventResize={handleResize}
      eventResizeStart={handleResizeStart}
      //====================== EVENT STYLING =================//
      eventContent={renderEventContent}
      eventClassNames={function (arg) {
        return `event-${arg.event.id}`;
      }}
    />
  );
};

export default CalendarView;
