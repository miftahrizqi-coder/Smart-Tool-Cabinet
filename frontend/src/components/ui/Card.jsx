import React from "react";

function Card({
  children,
  className = "",
  padding = "default",
  interactive = false,
  ...props
}) {
  const classes = [
    "stc-card",
    `stc-card--padding-${padding}`,
    interactive ? "stc-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Card;