import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 overflow-hidden relative">
      {/* Dramatic background glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] right-[0%] w-[30%] h-[40%] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-sm space-y-8 glass p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative z-10 backdrop-blur-2xl">
        <div className="text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-purple-500/10 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <svg
              width="40"
              height="40"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2.5" className="text-purple-400" />
              <path d="M14 8v6l4 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400" />
            </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">
            SHIFT<span className="text-purple-500">SYNC</span>
          </h1>
          <p className="mt-4 text-sm text-zinc-400 leading-relaxed font-medium">
            Track your time. Know your worth. <br/> 
            <span className="text-zinc-500">Sign in to the future of work.</span>
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="group w-full flex items-center justify-center gap-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] px-4 py-4 text-sm font-bold text-white border border-white/10 hover:border-purple-500/50 transition-all duration-300 active:scale-[0.98] shadow-lg"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
            Secure Authentication via Google
          </p>
        </div>
      </div>
    </div>
  );
}
