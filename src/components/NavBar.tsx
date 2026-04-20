export function NavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-app-border">
      <a href="/" className="flex items-center shrink-0">
        <img
          src="/gaard-capital-logo.png"
          alt="Gaard Capital"
          className="h-9 w-auto max-w-[min(100%,220px)] object-contain object-left"
        />
      </a>
      <button className="text-sm font-medium text-brand hover:text-brand-hover transition-colors px-4 py-2 rounded-lg border border-app-border hover:border-brand/40">
        Log In
      </button>
    </nav>
  );
}
