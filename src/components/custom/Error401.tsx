import { Link } from "react-router-dom";

export default function Error401() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-6xl font-bold text-muted-foreground">401</h1>
      <p className="text-lg text-muted-foreground">Unauthorized</p>
      <Link to="/login" className="text-primary hover:underline">
        Go to login
      </Link>
    </div>
  );
}
