import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Sydney")
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-green-100 text-green-700"
      case "updated":
        return "bg-yellow-100 text-yellow-700"
      case "inactive":
        return "bg-gray-200 text-gray-600";
      case "imported":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  };

  // Safe Date format
  const formatDate = (date) => {
    if (!date || date === "Date not available") return "N/A";
    const d = new Date(date);
    return isNaN(d) ? date : d.toLocaleDateString();
  };

  // ----------- Fetch events-----------
  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        `/events/dashboard?city=${city}&search=${search}&startDate=${startDate}&endDate=${endDate}`
      );

      setEvents(response.data);
    } catch (err) {
      toast.error("Failed to load events")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [city, startDate, endDate]);

  // Import Event
  const importEvent = async (id) => {
    try {
      await axiosInstance.post(
        `/events/import/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Event Imported")
      fetchEvents()
    } catch (error) {
      toast.error("Import failed");
    }
  }

  // Search debounce like
  useEffect(() => {
    const timer = setTimeout(fetchEvents, 400)
    return () => clearTimeout(timer)
  }, [search]);

  return (
    <div className="p-6 grid grid-cols-3 gap-4 bg-gray-100 min-h-screen">
      {/* LEFT PANEL */}
      <div className="col-span-2 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Events Dashboard</h2>

        {/* Filters */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Sydney">Sydney</option>
            <option value="Melbourne">Melbourne</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="date"
            className="border p-2 rounded"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center py-10">Loading events...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Title</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {events.map((ev) => (
                <tr
                  key={ev._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelected(ev)}
                >
                  <td className="py-2">{ev.title}</td>

                  {/* Date */}
                  <td>{formatDate(ev.dateTime)}</td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        ev.status
                      )}`}
                    >
                      {ev.status}
                    </span>
                  </td>

                  {/* Import */}
                  <td>
                    {ev.status === "imported" ? (
                      <span className="text-gray-400 text-xs">Imported</span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          importEvent(ev._id);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Import
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* RIGHT PREVIEW PANEL */}
      <div className="bg-white p-4 rounded shadow">
        {selected ? (
          <>
            <h3 className="text-lg font-bold">{selected.title}</h3>

            {selected.image && (
              <img
                src={selected.image}
                alt=""
                className="mt-2 rounded h-40 w-full object-cover"
              />
            )}

            <p className="text-sm mt-3">{selected.description}</p>

            <div className="mt-3 text-xs text-gray-600 space-y-1">
              <p>Status: {selected.status}</p>
              <p>City: {selected.city || "Sydney"}</p>
              <p>Date: {formatDate(selected.dateTime)}</p>
            </div>

            <a
              href={selected.eventUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-blue-600 text-sm"
            >
              View Original Event →
            </a>
          </>
        ) : (
          <p className="text-gray-500">Select an event to preview</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
