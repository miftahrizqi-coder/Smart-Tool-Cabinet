import React from "react";
import { Bell, Search } from "lucide-react";

function Header({
  title = "Overview",
  description,
}) {
  return (
    <header className="stc-header">
      <div className="stc-header__left">
        <div>
          <div className="stc-header__title">
            {title}
          </div>

          {description && (
            <div className="stc-header__description">
              {description}
            </div>
          )}
        </div>
      </div>

      <div className="stc-header__right">
        <div className="stc-header__search">
          <Search size={14} />

          <span>Search...</span>
        </div>

        <div className="stc-header__system">
          <span className="stc-header__system-dot" />
          <span>System Online</span>
        </div>

        <button
          type="button"
          className="stc-header__notification"
          aria-label="Notifications"
        >
          <Bell size={16} />

          <span className="stc-header__notification-dot" />
        </button>

        <div
          className="stc-header__avatar"
          aria-label="Admin"
        >
          A
        </div>
      </div>
    </header>
  );
}

export default Header;