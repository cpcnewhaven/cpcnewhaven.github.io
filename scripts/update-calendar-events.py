#!/usr/bin/env python3
"""Generate the public Upcoming Events feed from the CPC Google Calendar."""

from __future__ import annotations

import json
from datetime import date, datetime, timedelta
from pathlib import Path
from urllib.request import Request, urlopen
from zoneinfo import ZoneInfo

import recurring_ical_events
from icalendar import Calendar


CALENDAR_URL = (
    "https://calendar.google.com/calendar/ical/"
    "baf2h147ghi7nu8ifijjrt994k%40group.calendar.google.com/public/basic.ics"
)
TIMEZONE = ZoneInfo("America/New_York")
LOOK_AHEAD_DAYS = 120
MAX_EVENTS = 12
OUT_PATH = Path(__file__).resolve().parents[1] / "data" / "events.json"


def fetch_calendar() -> Calendar:
    request = Request(CALENDAR_URL, headers={"User-Agent": "CPC-New-Haven-Calendar-Feed/1.0"})
    with urlopen(request, timeout=30) as response:
        return Calendar.from_ical(response.read())


def local_date(value: date | datetime) -> date:
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=TIMEZONE)
        return value.astimezone(TIMEZONE).date()
    return value


def build_events(calendar: Calendar) -> list[dict[str, object]]:
    today = datetime.now(TIMEZONE).date()
    end_date = today + timedelta(days=LOOK_AHEAD_DAYS)
    occurrences = recurring_ical_events.of(calendar).between(today, end_date)
    events: list[dict[str, object]] = []
    seen: set[tuple[str, str]] = set()

    for occurrence in occurrences:
        if str(occurrence.get("STATUS", "")).upper() == "CANCELLED":
            continue

        event_date = local_date(occurrence.decoded("DTSTART"))
        if not today <= event_date <= end_date:
            continue

        title = str(occurrence.get("SUMMARY", "")).strip()
        if not title:
            continue

        key = (str(occurrence.get("UID", "")), event_date.isoformat())
        if key in seen:
            continue
        seen.add(key)

        events.append(
            {
                "date": event_date.isoformat(),
                "title": title,
                "description": "",
                "allDay": not isinstance(occurrence.decoded("DTSTART"), datetime),
            }
        )

    events.sort(key=lambda event: (event["date"], event["title"].casefold()))
    return events[:MAX_EVENTS]


def main() -> None:
    events = build_events(fetch_calendar())
    payload = {
        "generatedAt": datetime.now(TIMEZONE).isoformat(),
        "source": "CPC Google Calendar",
        "events": events,
    }
    OUT_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(events)} upcoming calendar event(s) to {OUT_PATH}")


if __name__ == "__main__":
    main()
