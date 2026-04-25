import type { Config } from "tailwindcss";

const config: Config = {
    // Ensure dark mode is handled by a class (usually 'dark') for ThemeProvider compatibility
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand & Semantic Colors
                brand: {
                    indigo: "#4F46E5", // Primary Brand
                    emerald: "#10B981", // Success / Clock In
                    coral: "#F43F5E", // Warning / Clock Out
                    amber: "#F59E0B", // Overtime indicator
                    sky: "#0EA5E9", // Information
                },
                // Light Mode Palette
                light: {
                    bg: "#F3F4F6",
                    surface: "#FFFFFF",
                    textPrimary: "#111827",
                    textSecondary: "#6B7280",
                    border: "#E5E7EB",
                },
                // Dark Mode Palette
                dark: {
                    bg: "#121212",
                    surface: "#1E1E1E",
                    textPrimary: "#F9FAFB",
                    textSecondary: "#9CA3AF",
                    border: "#374151",
                },
                // Custom background surface
                'surface-bg': 'var(--surface-bg)',
            },
            // Configuration for high-fidelity tabular numbers and typography
            fontFamily: {
                sans: ["Inter", "Roboto", "ui-sans-serif", "system-ui"],
            },
        },
    },
    plugins: [
        // Plugin to support tabular numbers utility easily if not default
        require("@tailwindcss/forms"),
    ],
};

export default config;