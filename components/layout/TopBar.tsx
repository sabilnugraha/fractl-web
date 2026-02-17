import React from "react";
import "../../app/globals.css";

export default function TopBar({
  left,
  center,
  right,
}: {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="fr-topbar">
      <div className="fr-topbar-row">
        <div className="fr-topbar-left">
          {left}
          <div className="fr-topbar-center">{center}</div>
        </div>
        <div className="fr-topbar-right">{right}</div>
      </div>
    </header>
  );
}
