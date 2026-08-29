import type { ReactNode } from "react";
import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import type { WorkspaceContext } from "@/lib/auth";

export type IconName =
  | "activity"
  | "arrow"
  | "check"
  | "chevron"
  | "grid"
  | "layers"
  | "plus";

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
  };

  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 18 18" width={size}>
      {paths[name]}
    </svg>
  );
}

type WorkspaceRoute = "dashboard" | "leads" | "tasks";

const navItems: ReadonlyArray<{
  label: string;
  icon: IconName;
  href: string;
  route: WorkspaceRoute;
}> = [
  { label: "Home", icon: "grid", href: "/", route: "dashboard" },
  { label: "Leads", icon: "layers", href: "/leads", route: "leads" },
  { label: "Tasks", icon: "check", href: "/tasks", route: "tasks" },
];

export function WorkspaceShell({
  breadcrumb,
  children,
  currentRoute,
  workspace,
}: {
  breadcrumb: string;
  children: ReactNode;
  currentRoute: WorkspaceRoute;
  workspace: WorkspaceContext;
}) {
  const workspaceInitial = workspace.workspaceName.trim().charAt(0).toUpperCase() || "W";
  const userInitial = workspace.userName.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="Outreach home">
          <span className="brand-mark">o</span>
          <span>outreach</span>
          <span className="brand-dot">.</span>
        </Link>

        <div className="workspace-switcher">
          <span className="workspace-avatar">{workspaceInitial}</span>
          <span className="workspace-copy">
            <span className="workspace-name">{workspace.workspaceName}</span>
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
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`nav-item${isActive ? " nav-item-active" : ""}`}
                    href={item.href}
                  >
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

      </aside>

      <main className="main-content">
        <header className="topbar">
          <div aria-label="Breadcrumb" className="breadcrumbs">
            <span>Workspace</span>
            <Icon name="chevron" size={14} />
            <strong>{breadcrumb}</strong>
          </div>
          <div className="topbar-actions">
            <span aria-label={workspace.userName} className="user-avatar">{userInitial}</span>
            <LogoutButton />
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
