import TopBar from "@/components/layout/TopBar";

function Brand() {
  return <div className="border-2 border-black px-3 py-1 font-bold">FRACTL</div>;
}

function MarketingCenter() {
  return (
    <div className="flex items-center gap-2">
      <button className="border-2 border-black px-3 py-1 bg-lime-300">Overview</button>
      <button className="border-2 border-black px-3 py-1">Sign In</button>
    </div>
  );
}

function MarketingRight() {
  return (
    <div className="flex items-center gap-2">
      <button className="border-2 border-black px-3 py-1">Learn</button>
      <button className="border-2 border-black px-3 py-1 shadow-[3px_3px_0px_0px_#000]">
        Schedule a Demo
      </button>
    </div>
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar left={<Brand />} center={<MarketingCenter />} right={<MarketingRight />} />
      {children}
    </>
  );
}
