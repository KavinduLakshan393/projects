export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24
      }}
    >
      <div className="card" style={{ width: "min(420px, 100%)", textAlign: "center" }}>
        <h1 style={{ marginTop: 0 }}>ShiftSync</h1>
        <p style={{ color: "var(--muted)" }}>Track your time. Know your worth.</p>
        <form action="/api/auth/demo-login" method="post">
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 12 }}>
            Continue with Google (Demo)
          </button>
        </form>
      </div>
    </div>
  );
}
