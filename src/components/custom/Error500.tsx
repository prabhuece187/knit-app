import { Link } from "react-router-dom";

export default function Error500() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-6xl font-bold text-muted-foreground">500</h1>
      <p className="text-lg text-muted-foreground">Server error</p>
      <Link to="/" className="text-primary hover:underline">
        Go home
      </Link>
    </div>
  );
}
