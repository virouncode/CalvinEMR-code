import interaction from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGrid from "@fullcalendar/resource-timegrid";

const TimelineView = ({
  slotDuration,
  firstDay,
  fcRef,
  events,
  isSecretary,
  handleDatesSet,
  handleEventClick,
  handleDateSelect,
  handleDragStart,
  handleDrop,
  handleResize,
  handleResizeStart,
  renderEventContent,
  site,
}) => {
  return (
    <FullCalendar
      plugins={[resourceTimeGrid, interaction]}
      //===================Design=====================//
      headerToolbar={{
        start: "title",
        // center: "resourceTimeGridDay",
        end: "prev today next",
      }}
      slotLabelFormat={{
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: true,
        meridiem: "short",
      }}
      buttonText={{
        today: "Today",
      }}
      resourceAreaHeaderContent="Rooms"
      resourceAreaWidth="10%"
      initialView="resourceTimeGridDay"
      slotDuration={slotDuration}
      firstDay={firstDay}
      weekNumbers={true}
      nowIndicator={true}
      eventTextColor="#3D375A"
      eventColor={isSecretary ? "#bfbfbf" : "#93B5E9"}
      slotLabelInterval="01:00"
      navLinks={true}
      navLinkDayClick="timeGrid"
      // weekText="Week"
      aspectRatio="2"
      expandRows={true}
      eventMinWidth="5"
      //==================== INTERACTION ====================//
      selectable={true}
      selectMirror={true}
      eventResizableFromStart={true}
      editable={true}
      unselectAuto={false}
      allDayMaintainDuration={true}
      ref={fcRef}
      //==================== CALLBACKS ====================//
      resources={site.rooms.map((room) => {
        return { id: room.id, title: room.title };
      })}
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

export default TimelineView;
