import React from "react";

function PageContainer({ children, className = "" }) {
  return (
    <main
      className={`stc-page-container ${className}`}
    >
      {children}
    </main>
  );
}

export default PageContainer;