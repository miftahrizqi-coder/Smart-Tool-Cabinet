import React, {
  useState,
} from "react";
import {
  Lock,
  Unlock,
  DoorOpen,
} from "lucide-react";

import Button from "../ui/Button";

function DoorControl({
  cabinet,
  onCommand,
}) {
  const [isConfirming, setIsConfirming] =
    useState(false);

  const isOnline =
    cabinet.status === "ONLINE";

  const isOpen =
    cabinet.door === "OPEN";

  const handleOpen = () => {
    if (!isOnline) return;

    setIsConfirming(false);

    onCommand?.({
      command: "OPEN_DOOR",
      cabinetId: cabinet.id,
      target: "LOCK",
    });
  };

  return (
    <div className="stc-door-control">
      <div className="stc-door-control__header">
        <div>
          <div className="stc-door-control__title">
            Door Control
          </div>

          <div className="stc-door-control__description">
            Send a door command to this cabinet.
          </div>
        </div>

        <div className="stc-door-control__state">
          {isOpen ? (
            <>
              <Unlock size={14} />
              OPEN
            </>
          ) : (
            <>
              <Lock size={14} />
              {cabinet.door}
            </>
          )}
        </div>
      </div>

      <div className="stc-door-control__actions">
        {!isConfirming ? (
          <Button
            variant="primary"
            size="sm"
            disabled={!isOnline || isOpen}
            onClick={() =>
              setIsConfirming(true)
            }
          >
            <DoorOpen size={14} />
            Open Door
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpen}
            >
              Confirm Open
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setIsConfirming(false)
              }
            >
              Cancel
            </Button>
          </>
        )}
      </div>

      {!isOnline && (
        <div className="stc-door-control__warning">
          Cabinet is offline. Door commands
          are unavailable.
        </div>
      )}
    </div>
  );
}

export default DoorControl;