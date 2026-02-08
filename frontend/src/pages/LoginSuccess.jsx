import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function LoginSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard"); // redirect to dashboard
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <h2 className="text-xl font-semibold">Logging you in...</h2>
    </div>
  );
}

export default LoginSuccess;