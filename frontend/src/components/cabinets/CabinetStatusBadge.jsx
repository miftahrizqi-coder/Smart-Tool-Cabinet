
import React from "react";

import Badge from "../ui/Badge";

function CabinetStatusBadge({
  status = "UNKNOWN",
}) {
  return (
    <Badge
      status={status}
    />
  );
}

export default CabinetStatusBadge;