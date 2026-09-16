import React from "react";
import {
  CreditCard,
  CheckCircle2,
  Wrench,
  RotateCcw,
  Radio,
} from "lucide-react";

import Card from "../ui/Card";

const EVENT_ICONS = {
  rfid: CreditCard,
  pin: CheckCircle2,
  borrow: Wrench,
  return: RotateCcw,
  conn: Radio,
};

function RecentEvents({
  events = [],
  onViewAll,
}) {
  return (
    <Card
      className="stc-dashboard-panel"
      padding="none"
    >
      <div className="stc-panel-header">
        <h2 className="stc-panel-title">
          Recent Events
        </h2>

        <button
          type="button"
          className="stc-panel-action"
          onClick={onViewAll}
        >
          View all
        </button>
      </div>

      <div className="stc-event-list">
        {events.map((event, index) => {
          const Icon =
            EVENT_ICONS[event.icon] || Radio;

          return (
            <div
              key={`${event.title}-${index}`}
              className="stc-event-row"
            >
              <div className="stc-event-row__icon">
                <Icon
                  size={13}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <div className="stc-event-row__content">
                <div className="stc-event-row__title">
                  {event.title}
                </div>

                <div className="stc-event-row__description">
                  {event.desc}
                </div>
              </div>

              <time className="stc-event-row__time mono">
                {event.time}
              </time>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default RecentEvents;