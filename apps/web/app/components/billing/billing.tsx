// import DashboardTopbar from "../dashboard/DashboardTopbar";

// export default function BillingPage() {
//   const notesUsed = 4;
//   const notesLimit = 5;
//   const pct = (notesUsed / notesLimit) * 100;

//   return (

//     <DashboardTopbar/>
//     <div className="px-8 py-8 max-w-2xl">
//       <h1 className="text-xl font-semibold text-zinc-900 mb-6">Billing</h1>

//       {/* Current plan */}
//       <div className="bg-white border border-zinc-200 rounded-xl px-6 py-5 mb-4">
//         <p className="text-xs text-zinc-400 mb-1">Current plan</p>
//         <p className="text-2xl font-bold text-zinc-900 mb-3">Free</p>
//         <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
//           <span>Notes used this month</span>
//           <span>{notesUsed} / {notesLimit}</span>
//         </div>
//         <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-red-500 rounded-full transition-all"
//             style={{ width: `${pct}%` }}
//           />
//         </div>
//       </div>

//       {/* Pro plan upsell */}
//       <div className="relative bg-zinc-900 text-white rounded-xl px-6 py-6 mb-4">
//         <span className="absolute top-4 right-4 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded uppercase tracking-wider">
//           Recommended
//         </span>
//         <p className="text-lg font-bold mb-1">Pro Plan</p>
//         <p className="text-blue-400 font-semibold mb-4">$12 / month</p>
//         <ul className="flex flex-col gap-2 mb-6">
//           {["Unlimited notes", "Team workspaces", "PDF export", "Priority support"].map((f) => (
//             <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
//               <span className="text-emerald-400 font-bold">+</span>
//               {f}
//             </li>
//           ))}
//         </ul>
//         <button className="w-full py-2.5 rounded-lg bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors">
//           Upgrade to Pro
//         </button>
//       </div>

//       {/* Billing history */}
//       <p className="text-sm text-zinc-400">No billing history yet.</p>
//     </div>
//   );
// }
