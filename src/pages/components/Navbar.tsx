import { useState } from "react";

const PORTAL_LOGIN = "https://secure.tutorcruncher.com/";

const links = [
  { label: "Method", href: "#how-it-works" },
  { label: "Why us", href: "#why-us" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 lg:px-8">
        <a href="#top" className="font-display text-xl font-extrabold tracking-tight text-foreground" aria-label="MathEinstein home">
          Math<span className="text-primary">Einstein</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="relative">
            <button
              onClick={() => setLoginOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={loginOpen}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Log in
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${loginOpen ? "rotate-180" : ""}`}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {loginOpen && (
              <>
                <button aria-hidden tabIndex={-1} onClick={() => setLoginOpen(false)} className="fixed inset-0 z-40 cursor-default" />
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-lg">
                  <a href={PORTAL_LOGIN} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted">
                    <span className="text-lg">🧑‍🏫</span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">Teacher login</span>
                      <span className="text-xs text-muted-foreground">For tutors</span>
                    </span>
                  </a>
                  <a href={PORTAL_LOGIN} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted">
                    <span className="text-lg">🎒</span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">Student login</span>
                      <span className="text-xs text-muted-foreground">Students &amp; parents</span>
                    </span>
                  </a>
                </div>
              </>
            )}
          </div>
          <a href="#book-demo" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:-translate-y-0.5">
            Book a free demo
          </a>
        </div>

        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" className="rounded-lg p-2 text-foreground md:hidden">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-card md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                {l.label}
              </a>
            ))}
            <div className="my-2 border-t border-border" />
            <a href={PORTAL_LOGIN} target="_blank" rel="noopener noreferrer" className="rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">🧑‍🏫 Teacher login</a>
            <a href={PORTAL_LOGIN} target="_blank" rel="noopener noreferrer" className="rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">🎒 Student login</a>
            <a href="#book-demo" onClick={() => setOpen(false)} className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-center text-sm font-bold text-primary-foreground">Book a free demo</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
