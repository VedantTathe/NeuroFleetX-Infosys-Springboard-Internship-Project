import React, { useMemo, useState } from "react";

const now = new Date();
const mockMetrics = {
  activeVehicles: 42,
  totalFleet: 60,
  activeTrips: 8,
  completedTripsWeek: 154,
  activeDrivers: 38,
  weeklyRevenue: 32450,
  revenueTrend: [1200, 1800, 1600, 2400, 3000, 3200, 4100],
};

const mockVehicles = Array.from({ length: 16 }).map((_, i) => ({
  id: `VH-${1000 + i}`,
  model: ["Toyota Innova", "Winger", "Tata Ace", "Mahindra e-Verito"][i % 4],
  status: ["active", "maintenance", "idle"][i % 3],
  lastLocation: ["Pune", "Sangli", "Pandharpur", "Mumbai"][i % 4],
  kmsToday: Math.floor(Math.random() * 200),
  driver: ["Rohit S.", "Kumar P.", "Asha R.", "Siddhesh M."][i % 4],
  battery: 50 + (i % 50),
}));

const mockDrivers = [
  { id: "DR-101", name: "Rohit S.", rating: 4.7, phone: "98765 43210", status: "online" },
  { id: "DR-102", name: "Asha R.", rating: 4.9, phone: "91234 56789", status: "offline" },
  { id: "DR-103", name: "Siddhesh M.", rating: 4.4, phone: "99876 54321", status: "online" },
];

const mockTrips = [
  {
    id: "TR-9001",
    vehicle: "VH-1001",
    driver: "Rohit S.",
    from: "Sangli",
    to: "Pandharpur",
    etaMin: 22,
    status: "ongoing",
    startedAt: new Date(now.getTime() - 1000 * 60 * 35),
  },
  {
    id: "TR-9002",
    vehicle: "VH-1003",
    driver: "Asha R.",
    from: "Pune",
    to: "Mumbai",
    etaMin: 120,
    status: "ongoing",
    startedAt: new Date(now.getTime() - 1000 * 60 * 100),
  },
];

function formatCurrency(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function downloadCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => `"${(r[h] ?? "").toString().replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Sparkline({ data = [], className = "" }) {
  if (!data || data.length === 0) return null;
  const w = 120;
  const h = 30;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`inline-block ${className}`} aria-hidden>
      <polyline fill="none" strokeWidth="2" stroke="currentColor" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Navbar({ userName = "Fleet Manager" }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur sticky top-0 z-20 border-b">
      <div className="flex items-center gap-3">
        <div className="text-xl font-semibold">NeuroFleetX</div>
        <div className="text-sm text-gray-500">Fleet Manager Dashboard</div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 hidden sm:block">Welcome, <span className="font-medium">{userName}</span></div>
        <button className="px-3 py-2 rounded bg-indigo-600 text-white text-sm">New Trip</button>
      </div>
    </header>
  );
}

export default function FleetManagerDashboard() {
  const [metrics] = useState(mockMetrics);
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [drivers] = useState(mockDrivers);
  const [trips, setTrips] = useState(mockTrips);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState({ key: "id", dir: "asc" });
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    let arr = vehicles.slice();
    if (q.trim()) {
      const s = q.toLowerCase();
      arr = arr.filter((v) => [v.id, v.model, v.driver, v.lastLocation].some((f) => f.toLowerCase().includes(s)));
    }
    if (statusFilter !== "all") arr = arr.filter((v) => v.status === statusFilter);
    arr.sort((a, b) => {
      const av = a[sortBy.key];
      const bv = b[sortBy.key];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number") return sortBy.dir === "asc" ? av - bv : bv - av;
      return sortBy.dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [vehicles, q, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  function toggleSort(key) {
    setSortBy((s) => (s.key === key ? { ...s, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  function markTripComplete(tripId) {
    setTrips((t) => t.map((tr) => (tr.id === tripId ? { ...tr, status: "completed" } : tr)));
  }

  function exportVehiclesCSV() {
    downloadCSV("vehicles_export.csv", vehicles);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-4 max-w-7xl mx-auto">
        <section className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Fleet Overview</h1>
            <p className="text-sm text-gray-500">Snapshot of fleet health, active trips, and revenue</p>
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 bg-white p-2 rounded shadow-sm border">
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search vehicles, drivers, location..." className="outline-none text-sm" />
              <button className="text-xs text-indigo-600" onClick={() => { setQ(""); }}>Clear</button>
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded border bg-white text-sm">
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <button onClick={exportVehiclesCSV} className="px-3 py-2 rounded bg-gray-800 text-white text-sm">Export CSV</button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <MetricCard title="Active Vehicles" value={metrics.activeVehicles} subtitle={`${metrics.totalFleet} total`} />
          <MetricCard title="Active Trips" value={metrics.activeTrips} subtitle={`${metrics.completedTripsWeek} completed (week)`} />
          <MetricCard title="Active Drivers" value={metrics.activeDrivers} subtitle="Available now" />
          <MetricCard title="Weekly Revenue" value={formatCurrency(metrics.weeklyRevenue)} subtitle="This week" trend={<Sparkline data={metrics.revenueTrend} />} />
          <MetricCard title="Fleet Size" value={metrics.totalFleet} subtitle="All registered" />
          <MetricCard title="Completed Trips (W)" value={metrics.completedTripsWeek} subtitle="Week total" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Vehicles</h2>
              <div className="text-sm text-gray-500">Showing {filtered.length} results</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-600 border-b">
                    <th className="py-2 cursor-pointer" onClick={() => toggleSort("id")}>ID</th>
                    <th className="py-2 cursor-pointer" onClick={() => toggleSort("model")}>Model</th>
                    <th className="py-2">Driver</th>
                    <th className="py-2">Location</th>
                    <th className="py-2">KMs Today</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="py-2 font-mono">{v.id}</td>
                      <td className="py-2">{v.model}</td>
                      <td className="py-2">{v.driver}</td>
                      <td className="py-2">{v.lastLocation}</td>
                      <td className="py-2">{v.kmsToday} km</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded text-xs ${v.status === "active" ? "bg-green-100 text-green-700" : v.status === "maintenance" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <div>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 rounded border mr-2">Prev</button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-2 py-1 rounded border">Next</button>
              </div>
              <div className="text-gray-500">Page {page} / {totalPages}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Active Trips</h3>
                <span className="text-xs text-gray-500">{trips.length} ongoing</span>
              </div>
              <ul className="space-y-2">
                {trips.map((t) => (
                  <li key={t.id} className="flex items-center justify-between p-2 rounded border">
                    <div>
                      <div className="text-sm font-medium">{t.id} — {t.vehicle}</div>
                      <div className="text-xs text-gray-500">{t.from} → {t.to} • ETA {t.etaMin} min</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => alert(`Viewing ${t.id}`)} className="px-2 py-1 text-xs border rounded">View</button>
                      <button onClick={() => markTripComplete(t.id)} className="px-2 py-1 text-xs bg-green-600 text-white rounded">Mark complete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-medium mb-2">Drivers</h3>
              <ul className="space-y-2">
                {drivers.map((d) => (
                  <li key={d.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.id} • {d.rating} ★</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => alert(`Call ${d.phone}`)} className="px-2 py-1 text-xs border rounded">Call</button>
                      <button onClick={() => alert(`Message ${d.name}`)} className="px-2 py-1 text-xs border rounded">Msg</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded shadow p-4">
              <h3 className="font-medium mb-2">Map / Visualization</h3>
              <div className="h-36 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">Map placeholder (embed your map here)</div>
            </div>
          </div>
        </div>

        <section className="mt-6 flex gap-2 items-center">
          <button onClick={() => alert("Open create vehicle modal (mock)")} className="px-4 py-2 rounded bg-indigo-600 text-white">Add vehicle</button>
          <button onClick={() => alert("Open schedule trip (mock)")} className="px-4 py-2 rounded border">Schedule trip</button>
          <button onClick={() => alert("Generate weekly report (mock)")} className="px-4 py-2 rounded border">Generate report</button>
        </section>
      </main>
    </div>
  );
}

function MetricCard({ title, value, subtitle, trend }) {
  return (
    <div className="bg-white p-3 rounded shadow-sm flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-xl font-semibold">{value}</div>
        {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
      </div>
      {trend ? <div className="text-indigo-600">{trend}</div> : null}
    </div>
  );
}
