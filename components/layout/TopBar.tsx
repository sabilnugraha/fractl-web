import React from "react";

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
    <header className="isolate relative z-50 w-full bg-white border-b-2 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000]">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {left}
          <div className="min-w-0 flex-1">{center}</div>
        </div>

        <div className="flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
}
