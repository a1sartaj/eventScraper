import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

function EmailModal({ event, onClose }) {
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);

    const submitEmail = async () => {
        if (!email || !consent) {
            toast.error("Email & consent required");
            return;
        }

        try {
            setLoading(true);

            await axiosInstance.post("/email", {
                email,
                consent,
                eventId: event._id,
            });

            toast.success("Redirecting...");

            setTimeout(() => {
                window.location.href = event.eventUrl;
            }, 1000);
        } catch (error) {
            toast.error("Failed to save email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-80">
                <h2 className="text-lg font-semibold mb-3">Enter your email</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="flex items-center gap-2 text-sm mb-3">
                    <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                    />
                    I agree to receive updates
                </label>

                <button
                    onClick={submitEmail}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Please wait..." : "Continue"}
                </button>

                <button
                    onClick={onClose}
                    className="mt-2 w-full text-sm text-gray-500"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default EmailModal;
