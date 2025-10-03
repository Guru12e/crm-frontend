"use client";

import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from "@/components/ui/kibo-ui/calendar";

const earliestYear = new Date().getFullYear() - 1;

const latestYear = new Date().getFullYear() + 2;

const Calendar = ({ feature }) => {
  return (
    <CalendarProvider>
      <CalendarDate>
        <CalendarDatePicker>
          <CalendarMonthPicker className="max-sm:w-max" />
          <CalendarYearPicker
            className="max-sm:w-max"
            end={latestYear}
            start={earliestYear}
          />
        </CalendarDatePicker>
        <CalendarDatePagination />
      </CalendarDate>
      <CalendarHeader />
      <CalendarBody features={feature}>
        {({ feature }) => <CalendarItem feature={feature} key={feature.id} />}
      </CalendarBody>
    </CalendarProvider>
  );
};

export default Calendar;
