import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";

export default async function SettingsPage() {
  const userId = await requireUserId();
  const settings = await prisma.userSettings.findUnique({ where: { userId } });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <form action="/api/settings" method="post" className="card" style={{ display: "grid", gap: 10 }}>
        <label>
          Regular Shift Hours
          <input
            className="input"
            name="regularShiftHours"
            type="number"
            step="0.5"
            defaultValue={settings?.regularShiftHours ?? 8}
          />
        </label>
        <label>
          Regular Hourly Rate
          <input
            className="input"
            name="regularHourlyRate"
            type="number"
            step="0.01"
            defaultValue={settings?.regularHourlyRate ?? 0}
          />
        </label>
        <label>
          OT Hourly Rate
          <input
            className="input"
            name="otHourlyRate"
            type="number"
            step="0.01"
            defaultValue={settings?.otHourlyRate ?? 0}
          />
        </label>
        <label>
          Theme
          <select className="input" name="themePreference" defaultValue={settings?.themePreference ?? "system"}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <button className="btn btn-primary">Save Changes</button>
      </form>
      <form action="/api/auth/logout" method="post">
        <button className="btn btn-danger" style={{ width: "100%" }}>
          Sign Out
        </button>
      </form>
    </div>
  );
}
