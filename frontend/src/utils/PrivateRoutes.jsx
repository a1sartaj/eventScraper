import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function PrivateRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);

    useEffect(() => {
        const verify = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axiosInstance.get("/auth/verify", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setValid(res.data.valid);
            } catch {
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, []);

    if (loading) return <p>Checking auth...</p>;

    return valid ? children : <Navigate to="/" />;
}

export default PrivateRoute;
