import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function LoginSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, []);

  return <p>Logging in...</p>;
}

export default LoginSuccess;
