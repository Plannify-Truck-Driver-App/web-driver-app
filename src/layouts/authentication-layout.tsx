import { Outlet } from "react-router";

export default function AuthenticationLayout() {
  return (
    <div className="flex flex-col w-full max-w-[800px] relative overflow-hidden p-6 mx-6 rounded-sm border border-border bg-neutral">
      <div className="grid grid-cols-4 absolute -top-16 z-0">
        <div className="rounded-full w-[160px] h-[160px] bg-gradient-to-r from-[#78BCCD] via-[#1887A3] to-[#0A4452] opacity-15 blur-3xl z-10"></div>
        <div className="rounded-full w-[139px] h-[139px] bg-[#5FB9CF] opacity-15 blur-3xl z-10"></div>
        <div className="rounded-full w-[185px] h-[185px] bg-[#58CBE8] opacity-15 blur-3xl z-10"></div>
        <div className="rounded-full w-[278px] h-[278px] bg-[#1887A3] opacity-10 blur-3xl z-10"></div>
      </div>
      <p className="font-[Sansation] text-sm text-slate-400 font-bold">PLANNIFY {import.meta.env.VITE_APP_VERSION}</p>
      <div className="z-20">
        <Outlet />
      </div>
    </div>
  );
}