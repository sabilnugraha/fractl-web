"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";

function Brand() {
  return (
    <div className="px-3 py-[2px] border-2 border-black bg-white font-bold shadow-[3px_3px_0px_0px_#000]">
      FRACTL
    </div>
  );
}


function WorkspaceCenter({
  workspace,
  treeOpen,
  onToggleTree,
}: {
  workspace: string;
  treeOpen: boolean;
  onToggleTree: () => void;
}) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      
      {/* Workspace Active */}
      <div className="px-2 py-[2px] border-2 border-black bg-white text-sm font-medium shadow-[2px_2px_0px_0px_#000]">
        {workspace}
      </div>

      {/* Tree Toggle */}
      <button
        onClick={onToggleTree}
        className={`px-2 py-[2px] border-2 border-black text-xs shadow-[2px_2px_0px_0px_#000] ${
          treeOpen ? "bg-lime-300" : "bg-white"
        }`}
        title="Toggle Fractal Tree"
      >
        Tree: {treeOpen ? "ON" : "OFF"}
      </button>

    </div>
  );
}


function WorkspaceRight({
  onOpenSearch,
}: {
  onOpenSearch: () => void;
}) {
  return (
    <button
      onClick={onOpenSearch}
      className="px-3 py-[2px] border-2 border-black bg-white text-sm shadow-[3px_3px_0px_0px_#000] mr-2"
      title="Search (⌘K)"
    >
      Search ⌘K
    </button>
  );
}


export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const [treeOpen, setTreeOpen] = useState(true);

  return (
    <>
      <TopBar
        left={<Brand />}
        center={
          <WorkspaceCenter
            workspace="PT-A / Finance / Payroll"
            treeOpen={treeOpen}
            onToggleTree={() => setTreeOpen((v) => !v)}
          />
        }
        right={<WorkspaceRight onOpenSearch={() => alert("Open search")} />}
      />

      {/* nanti kita ganti jadi layout 3 panel */}
      <div className="relative">
        {children}
      </div>
    </>
  );
}
