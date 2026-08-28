import type { ReactNode } from "react";
import Link from "next/link";

export type IconName =
  | "activity"
  | "arrow"
  | "building"
  | "check"
  | "chevron"
  | "grid"
  | "layers"
  | "plus"
  | "search"
  | "settings"
  | "users";

export function Icon({ name, size = 17 }: { name: IconName; size?: number }) {
  const sharedProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
  };

  const paths: Record<IconName, ReactNode> = {
    activity: <path {...sharedProps} d="M3.5 12.5h3l1.7-5 3.2 8 1.7-4h3.4" />,
    arrow: <path {...sharedProps} d="M4 9h10m-4-4 4 4-4 4" />,
    building: (
      <>
        <path {...sharedProps} d="M4 15.5h12M5.5 15.5V5.2L10 3.5l4.5 1.7v10.3" />
        <path {...sharedProps} d="M8 7.5h.01M12 7.5h.01M8 10.5h.01M12 10.5h.01" />
      </>
    ),
    check: (
      <>
        <path {...sharedProps} d="M5 9.5 8 12l6-6" />
        <rect {...sharedProps} height="12" rx="2" width="12" x="2" y="2" />
      </>
    ),
    chevron: <path {...sharedProps} d="m6 8 3 3 3-3" />,
    grid: (
      <>
        <rect {...sharedProps} height="5" rx="1" width="5" x="2.5" y="2.5" />
        <rect {...sharedProps} height="5" rx="1" width="5" x="10.5" y="2.5" />
        <rect {...sharedProps} height="5" rx="1" width="5" x="2.5" y="10.5" />
        <rect {...sharedProps} height="5" rx="1" width="5" x="10.5" y="10.5" />
      </>
    ),
    layers: (
      <>
        <path {...sharedProps} d="m9 3 6 3-6 3-6-3 6-3Z" />
        <path {...sharedProps} d="m3 9 6 3 6-3M3 12l6 3 6-3" />
      </>
    ),
    plus: <path {...sharedProps} d="M9 3v12M3 9h12" />,
    search: (
      <>
        <circle {...sharedProps} cx="8" cy="8" r="4.8" />
        <path {...sharedProps} d="m11.5 11.5 3.5 3.5" />
      </>
    ),
    settings: (
      <>
        <circle {...sharedProps} cx="9" cy="9" r="2.4" />
        <path {...sharedProps} d="m14 10.5 1.2 1.1-1.6 2.7-1.6-.6a6 6 0 0 1-1.6.9L10 16.2H7l-.4-1.6a6 6 0 0 1-1.6-.9l-1.6.6-1.6-2.7L3 10.5a6 6 0 0 1 0-3L1.8 6.4 3.4 3.7l1.6.6a6 6 0 0 1 1.6-.9L7 1.8h3l.4 1.6a6 6 0 0 1 1.6.9l1.6-.6 1.6 2.7L14 7.5a6 6 0 0 1 0 3Z" />
      </>
    ),
    users: (
      <>
        <circle {...sharedProps} cx="9" cy="6" r="2.5" />
        <path {...sharedProps} d="M4 15c.4-2.2 2.1-3.5 5-3.5s4.6 1.3 5 3.5" />
        <path {...sharedProps} d="M4.2 8.7a2.1 2.1 0 0 0-2 2.2M13.8 8.7a2.1 2.1 0 0 1 2 2.2" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 18 18" width={size}>
      {paths[name]}
    </svg>
  );
}

type WorkspaceRoute = "dashboard" | "leads" | "tasks";

const navItems: Array<{
  label: string;
  icon: IconName;
  href?: string;
  route?: WorkspaceRoute;
}> = [
  { label: "Dashboard", icon: "grid", href: "/", route: "dashboard" },
  { label: "Leads", icon: "layers", href: "/leads", route: "leads" },
  { label: "Tasks", icon: "check", href: "/tasks", route: "tasks" },
  { label: "Companies", icon: "building" },
  { label: "Contacts", icon: "users" },
];

export function WorkspaceShell({
  breadcrumb,
  children,
  currentRoute,
}: {
  breadcrumb: string;
  children: ReactNode;
  currentRoute: WorkspaceRoute;
}) {
  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="Outreach dashboard">
          <span className="brand-mark">o</span>
          <span>outreach</span>
          <span className="brand-dot">.</span>
        </Link>

        <div className="workspace-switcher">
          <span className="workspace-avatar">W</span>
          <span className="workspace-copy">
            <span className="workspace-name">Wayne&apos;s workspace</span>
            <span className="workspace-plan">Personal</span>
          </span>
          <Icon name="chevron" size={15} />
        </div>

        <nav aria-label="Primary navigation">
          <p className="nav-section-label">Workspace</p>
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = item.route === currentRoute;

              return (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={`nav-item${isActive ? " nav-item-active" : ""}`}
                      href={item.href}
                    >
                      <Icon name={item.icon} />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <span aria-disabled="true" className="nav-item nav-item-disabled">
                      <Icon name={item.icon} />
                      <span>{item.label}</span>
                      <span className="nav-item-status">soon</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-bottom">
          <nav aria-label="Secondary navigation">
            <ul className="nav-list">
              <li>
                <span aria-disabled="true" className="nav-item nav-item-disabled">
                  <Icon name="settings" />
                  <span>Settings</span>
                  <span className="nav-item-status">soon</span>
                </span>
              </li>
            </ul>
          </nav>
          <div className="privacy-note">
            <strong>Thoughtful outreach</strong>
            <span>Keep the reason, context, and next step close to every lead.</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div aria-label="Breadcrumb" className="breadcrumbs">
            <span>Workspace</span>
            <Icon name="chevron" size={14} />
            <strong>{breadcrumb}</strong>
          </div>
          <div className="topbar-actions">
            <button aria-label="Search workspace coming soon" className="search-trigger" disabled type="button">
              <Icon name="search" size={15} />
              <span>Search workspace</span>
              <kbd>⌘ K</kbd>
            </button>
            <span aria-label="Wayne" className="user-avatar">W</span>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
