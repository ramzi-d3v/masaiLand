"use client";

import { CalendarIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const fmt = (d) => d?.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/*
  A real date-range filter, not a decoration: `range` is {from, to} | undefined
  and the caller filters its own rows against it. One control, reused by
  Bookings and Enquiries — anything with a timestamp. Rooms & halls has none
  (a catalogue doesn't have a date), so that table doesn't get this filter.
*/
export default function DateRangeFilter({ range, onChange, label = "Date received" }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="justify-start font-normal" size="sm" variant="outline">
          <CalendarIcon aria-hidden="true" />
          {range?.from ? (
            range.to ? (
              <>
                {fmt(range.from)} – {fmt(range.to)}
              </>
            ) : (
              fmt(range.from)
            )
          ) : (
            label
          )}
        </Button>
      </PopoverTrigger>
      {/* align="end" anchors the popover's right edge to the trigger's right
          edge, so a two-month calendar opens leftward instead of running off
          the right side of the toolbar it sits in. */}
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          defaultMonth={range?.from}
          mode="range"
          numberOfMonths={2}
          onSelect={onChange}
          selected={range}
        />
        {range?.from && (
          <div className="border-t p-2">
            <Button
              className="w-full"
              onClick={() => onChange(undefined)}
              size="sm"
              variant="ghost"
            >
              <XIcon aria-hidden="true" />
              Clear dates
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
