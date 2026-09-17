import React from "react";

function Button({
  children,
  variant = "secondary",
  size = "default",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const classes = [
    "stc-button",
    `stc-button--${variant}`,
    `stc-button--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span
          className="stc-button__spinner"
          aria-hidden="true"
        />
      )}

      {!loading && Icon && iconPosition === "left" && (
        <Icon size={14} aria-hidden="true" />
      )}

      <span>{loading ? "Loading..." : children}</span>

      {!loading && Icon && iconPosition === "right" && (
        <Icon size={14} aria-hidden="true" />
      )}
    </button>
  );
}

export default Button;