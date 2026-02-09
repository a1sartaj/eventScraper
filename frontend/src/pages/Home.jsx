import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmailModal from "../components/EmailModal";
import axiosInstance from "../api/axiosInstance";

const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/events")
            setEvents(response.data);
        } catch (error) {
            toast.error("Failed to load events")
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchEvents()
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Sydney Events</h1>

            {loading && <p className="text-center">Loading events...</p>}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((ev) => (
                    <div
                        key={ev._id}
                        className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
                    >
                        {ev.image && (
                            <img
                                src={ev.image}
                                alt={ev.title}
                                className="h-40 w-full object-cover rounded-lg mb-3"
                            />
                        )}

                        <h3 className="font-semibold text-lg">{ev.title}</h3>

                        <p className="text-xs text-gray-500">
                            {ev.dateTime && ev.dateTime !== "Date not available"
                                ? new Date(ev.dateTime).toLocaleDateString()
                                : "Date not available"}
                        </p>

                        <p className="text-sm text-gray-600 line-clamp-3">
                            {ev.description}
                        </p>

                        <p className="text-xs mt-2">
                            Status:{" "}
                            <span className="font-semibold capitalize">{ev.status}</span>
                        </p>

                        <button
                            onClick={() => setSelectedEvent(ev)}
                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                        >
                            GET TICKETS
                        </button>
                    </div>
                ))}
            </div>

            {selectedEvent && (
                <EmailModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );
}

export default Home;
