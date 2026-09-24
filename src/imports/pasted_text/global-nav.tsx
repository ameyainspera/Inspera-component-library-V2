// GlobalNav.tsx - self-contained top navigation bar. Only dependency: React.
import { useState, useEffect } from "react";

// ── Material-symbol icon paths (only the ones the nav uses) ──────────────────
const MSY = {
  home: "M220-180h150v-220q0-12.75 8.63-21.38Q387.25-430 400-430h160q12.75 0 21.38 8.62Q590-412.75 590-400v220h150v-390L480-765 220-570v390Zm-60 0v-390q0-14.25 6.38-27 6.37-12.75 17.62-21l260-195q15.68-12 35.84-12Q500-825 516-813l260 195q11.25 8.25 17.63 21 6.37 12.75 6.37 27v390q0 24.75-17.62 42.37Q764.75-120 740-120H560q-12.75 0-21.37-8.63Q530-137.25 530-150v-220H430v220q0 12.75-8.62 21.37Q412.75-120 400-120H220q-24.75 0-42.37-17.63Q160-155.25 160-180Zm320-293Z",
  search: "M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l242 240q9 8.56 9 21.78T818-143q-9 9-22.22 9-13.22 0-21.78-9L533-384q-30 26-69.96 40.5Q423.08-329 378-329Zm-1-60q81.25 0 138.13-57.5Q572-504 572-585t-56.87-138.5Q458.25-781 377-781q-82.08 0-139.54 57.5Q180-666 180-585t57.46 138.5Q294.92-389 377-389Z",
  notifications: "M190-200q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h50v-304q0-84 49.5-150.5T420-798v-22q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v22q81 17 130.5 83.5T720-564v304h50q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H190Zm290-302Zm0 422q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM300-260h360v-304q0-75-52.5-127.5T480-744q-75 0-127.5 52.5T300-564v304Z",
  help: "M511-258.03q11-11.03 11-27T510.97-312q-11.03-11-27-11T457-311.97q-11 11.03-11 27T457.03-258q11.03 11 27 11T511-258.03ZM480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Zm2.77-180Q513-660 536-641.5q23 18.5 23 47.2 0 26.3-15.65 45.73Q527.7-529.14 508-512q-23 19-40 42.38-17 23.39-17 52.62 0 11 8.4 17.5T479-393q12 0 19.88-8 7.87-8 10.12-20 3-21 16-38t30.23-30.78Q580-510 596-537q16-27 16-58.61 0-50.39-37.5-83.89T485.55-713Q450-713 417-698t-54 44q-7 10-6.5 21.5t9.47 18.5q11.41 8 23.65 5 12.23-3 20.38-14 12.75-17.9 31.88-27.45Q461-660 482.77-660Z",
  accountCircle: "M222-255q63-44 125-67.5T480-346q71 0 133.5 23.5T739-255q44-54 62.5-109T820-480q0-145-97.5-242.5T480-820q-145 0-242.5 97.5T140-480q0 61 19 116t63 109Zm160.5-234.5Q343-529 343-587t39.5-97.5Q422-724 480-724t97.5 39.5Q617-645 617-587t-39.5 97.5Q538-450 480-450t-97.5-39.5ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm107.5-76Q640-172 691-212q-51-36-104-55t-107-19q-54 0-107 19t-104 55q51 40 103.5 56T480-140q55 0 107.5-16Zm-52-375.5Q557-553 557-587t-21.5-55.5Q514-664 480-664t-55.5 21.5Q403-621 403-587t21.5 55.5Q446-510 480-510t55.5-21.5ZM480-587Zm0 374Z",
} as const;

function MIcon({ path, size = 16, color = "currentColor", className = "" }: { path: string; size?: number; color?: string; className?: string }) {
  return (
    <svg viewBox="0 -960 960 960" width={size} height={size} className={className} aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d={path} fill={color} />
    </svg>
  );
}

// ── Nav data ─────────────────────────────────────────────────────────────────
export const NAV_ITEMS = [
  { id: "author", label: "Author", dropdown: true },
  { id: "deliver", label: "Deliver", dropdown: true },
  { id: "monitor", label: "Monitor", dropdown: true },
  { id: "chat", label: "Chat" },
  { id: "grade", label: "Grade" },
  { id: "report", label: "Report" },
  { id: "originality", label: "Originality checking", dropdown: true, badge: "New" },
  { id: "admin", label: "Admin", dropdown: true },
];

export type NavSubmenuItem = { id: string; label: string; icon?: React.ReactNode; isSectionHeader?: boolean };

// Colored bank tile used by some Author submenu entries
function BankIcon({ color }: { color: string }) {
  return (
    <svg fill="none" viewBox="0 0 14 14" className="size-[16px]">
      <rect width="14" height="14" rx="2" fill={color} />
      <path d="M7 2.5L11.5 5H2.5L7 2.5Z" fill="white" />
      <rect x="3" y="5.5" width="1.4" height="3.5" fill="white" />
      <rect x="6.3" y="5.5" width="1.4" height="3.5" fill="white" />
      <rect x="9.6" y="5.5" width="1.4" height="3.5" fill="white" />
      <rect x="2" y="9.5" width="10" height="1.5" rx="0.4" fill="white" />
    </svg>
  );
}

export const DELIVER_SUBMENU: NavSubmenuItem[] = [
  { id: "deliver-tests", label: "Tests", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[14px]"><rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M4 5h6M4 7.5h6M4 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg> },
  { id: "deliver-templates", label: "Templates", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[14px]"><rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M1 5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg> },
];

export const MONITOR_SUBMENU: NavSubmenuItem[] = [
  { id: "monitor-inspera", label: "Inspera Assessment", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[14px]"><rect x="2" y="1" width="10" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.3" /><path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg> },
  { id: "monitor-ioa", label: "Interactive assessment dashboard", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[14px]"><rect x="5" y="1.5" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M3 7a4 4 0 0 0 8 0M7 11v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg> },
];

export const AUTHOR_SUBMENU: NavSubmenuItem[] = [
  { id: "author-question-sets", label: "Question Sets", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><path d="M7 11V3.5M7 3.5C6 3 4 3 2.5 3.5v7c1.5-.4 3.5-.4 4.5 0M7 3.5C8 3 10 3 11.5 3.5v7c-1.5-.4-3.5-.4-4.5 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { id: "author-question-set-templates", label: "Question Set Templates", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><rect x="3.5" y="1" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1.5" y="3" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" fill="white"/><path d="M4 7.5h3.5M4 9.5h2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
  { id: "author-questions", label: "Questions", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><rect x="2.5" y="1.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5 5h4M5 7.5h4M5 10h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { id: "author-question-templates", label: "Question Templates", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><rect x="1.5" y="1.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 5.5h11M1.5 9h11M6 5.5v6" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { id: "author-content-block-templates", label: "Content Block Templates", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><rect x="1.5" y="1.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="3" y="3.5" width="3" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><rect x="8" y="3.5" width="3" height="2.5" rx="0.5" stroke="currentColor" strokeWidth="1.1"/><path d="M3 8.5h8M3 10.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { id: "author-sections", label: "Sections", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><rect x="1.5" y="1.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 5h11M1.5 8.5h11M5.5 1.5v11" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { id: "author-assets", label: "Assets", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><rect x="1.5" y="2" width="11" height="10" rx="1" stroke="currentColor" strokeWidth="1.2"/><circle cx="4.5" cy="5" r="1" stroke="currentColor" strokeWidth="1.1"/><path d="M1.5 10l3.5-3.5L7.5 9l2-2 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: "author-css-content-styles", label: "CSS content styles", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><rect x="2.5" y="1.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 5.5L4 7l1.5 1.5M8.5 5.5L10 7l-1.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 10.5l1-6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
  { id: "author-answer-key-configs", label: "Answer Key Configs", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><rect x="2.5" y="1.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="6.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/><path d="M7 8.3V10M6 10h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { id: "author-answer-key-types", label: "Answer Key Types", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><rect x="2.5" y="1.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="5.5" r="1.8" stroke="currentColor" strokeWidth="1.1"/><path d="M4 10.5h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M5.5 8.5l1.5 2 1.5-2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: "author-rubrics", label: "Rubrics", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><rect x="1.5" y="1.5" width="11" height="11" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 5.5h11M1.5 9h11M5.5 1.5v11" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 3.5h3M7.5 7h3M7.5 10.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
  { id: "author-section-bank", label: "Select bank", isSectionHeader: true },
  { id: "author-bank-all", label: "All content", icon: <svg fill="none" viewBox="0 0 14 14" className="size-[16px]"><path d="M7 1.5L12.5 4.5H1.5L7 1.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><rect x="2.5" y="5" width="1.5" height="4" stroke="currentColor" strokeWidth="1.1"/><rect x="6.25" y="5" width="1.5" height="4" stroke="currentColor" strokeWidth="1.1"/><rect x="10" y="5" width="1.5" height="4" stroke="currentColor" strokeWidth="1.1"/><path d="M1.5 9.5h11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
  { id: "author-bank-arvindh", label: "0.Arvindh Item Bank (Don't Touch)", icon: <BankIcon color="#c0392b" /> },
  { id: "author-bank-199", label: "199", icon: <BankIcon color="#27ae60" /> },
  { id: "author-bank-255", label: "255 Question set test", icon: <BankIcon color="#7b241c" /> },
  { id: "author-bank-aaarajesh", label: "AAAaRajesh", icon: <BankIcon color="#2ecc71" /> },
  { id: "author-bank-aarohi", label: "Aarohi new test bank", icon: <BankIcon color="#5d4037" /> },
];

export const NAV_SUBMENU_HEADERS: Record<string, { title: string; subtitle: string }> = {
  author: { title: "Unbanked space", subtitle: "Unbanked content" },
};
export const NAV_SUBMENUS: Record<string, NavSubmenuItem[]> = { author: AUTHOR_SUBMENU, deliver: DELIVER_SUBMENU, monitor: MONITOR_SUBMENU };

export function navSubmenuLabel(id: string): string | undefined {
  return AUTHOR_SUBMENU.find((n) => n.id === id)?.label ?? DELIVER_SUBMENU.find((n) => n.id === id)?.label ?? MONITOR_SUBMENU.find((n) => n.id === id)?.label ?? NAV_ITEMS.find((n) => n.id === id)?.label;
}

// ── Optional global nav interception (e.g. a router hook) ──────────────────────
const GLOBAL_NAV_IDS = new Set(["deliver-tests", "monitor-ioa", "author-question-sets"]);
let globalNavHandler: ((id: string) => void) | null = null;
export function setGlobalNavHandler(fn: ((id: string) => void) | null) { globalNavHandler = fn; }
function tryGlobalNav(id: string): boolean {
  if (GLOBAL_NAV_IDS.has(id) && globalNavHandler) { globalNavHandler(id); return true; }
  return false;
}

// ── Notification bell data ─────────────────────────────────────────────────────
export const ASSESSOR_NOTIFICATIONS = [
  { title: "New assignment: Advanced Communication Skills", body: "5 candidates · declare availability by 11 Jul", when: "2h ago", unread: true },
  { title: "Availability deadline approaching", body: "Clinical Psychology Oral Defense - due 9 Jul", when: "1d ago", unread: true },
  { title: "Candidate joined your waiting room", body: "Alex Thompson is ready for the 09:00 session", when: "3d ago", unread: false },
];

// ── The nav ────────────────────────────────────────────────────────────────────
export function AssessorNav({ onHome, activeId = "monitor", onNavigate }: { onHome: () => void; activeId?: string | null; onNavigate?: (id: string) => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  function handleNavClick(id: string, label?: string) {
    if (tryGlobalNav(id)) return;
    if (onNavigate) onNavigate(id);
    else console.info(`${label ?? NAV_ITEMS.find((n) => n.id === id)?.label} - coming soon`);
  }
  const unread = ASSESSOR_NOTIFICATIONS.filter((n) => n.unread).length;
  useEffect(() => {
    if (!notifOpen) return;
    const close = () => setNotifOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [notifOpen]);
  return (
    <nav aria-label="Assessor" className="sticky top-0 z-50 bg-[#002e5c] w-full flex items-center h-[55px] px-[16px] flex-shrink-0">
      <div className="flex items-center flex-shrink-0 mr-[8px]">
        <button onClick={onHome} aria-label="Home" className="flex items-center justify-center size-[32px] hover:bg-white/10 rounded cursor-pointer mr-[16px]">
          <MIcon path={MSY.home} size={20} color="white" className="opacity-80" />
        </button>
        <div className="flex items-center h-[32px] rounded-[4px] overflow-hidden">
          <button className="bg-[#004080] flex items-center px-[12px] h-full border-r border-white/20 hover:bg-[#003366] cursor-pointer">
            <span className="font-['Inter',sans-serif] font-medium text-[14px] text-white tracking-[-0.15px]">New test</span>
          </button>
          <button aria-label="More new-test options" className="bg-[#004080] flex items-center px-[8px] h-full hover:bg-[#003366] cursor-pointer">
            <svg fill="none" viewBox="0 0 16 16" className="size-[16px]"><path d="M4 6L8 10L12 6" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
          </button>
        </div>
      </div>
      <div className="flex items-center flex-1 justify-center">
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const submenu = NAV_SUBMENUS[item.id];
          return (
            <div
              key={item.id}
              className="relative flex-shrink-0"
              onMouseEnter={() => submenu && setOpenSubmenu(item.id)}
              onMouseLeave={() => setOpenSubmenu((cur) => (cur === item.id ? null : cur))}
            >
              <button
                onClick={() => (submenu ? setOpenSubmenu((cur) => (cur === item.id ? null : item.id)) : handleNavClick(item.id))}
                aria-current={isActive ? "page" : undefined}
                aria-expanded={submenu ? openSubmenu === item.id : undefined}
                aria-haspopup={submenu ? "menu" : undefined}
                className={`flex items-center gap-[4px] px-[16px] h-[55px] cursor-pointer transition-colors ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <span className={`font-['Inter',sans-serif] font-medium text-[13px] tracking-[-0.08px] ${isActive ? "text-white" : "text-white/70"}`}>{item.label}</span>
                {item.badge && <span className="bg-[#89239a] text-white font-['Inter',sans-serif] font-bold text-[12px] px-[6px] py-[1px] rounded-[4px] tracking-[0.12px] ml-[2px]">{item.badge}</span>}
                {item.dropdown && <svg fill="none" viewBox="0 0 14 14" className={`size-[14px] flex-shrink-0 transition-transform ${submenu && openSubmenu === item.id ? "rotate-180" : ""}`}><path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.17" /></svg>}
              </button>
              {isActive && <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-white rounded-t-[2px]" />}
              {submenu && openSubmenu === item.id && (
                <div role="menu" aria-label={`${item.label} menu`} className={`absolute left-0 top-full bg-white rounded-[8px] shadow-[0px_8px_24px_rgba(0,0,0,0.22)] border border-[#e0e0e0] z-[60] overflow-hidden font-['Inter',sans-serif] ${item.id === "author" ? "w-[300px]" : "w-[220px]"}`}>
                  {NAV_SUBMENU_HEADERS[item.id] && (
                    <div className="bg-[#002e5c] px-[16px] pt-[16px] pb-[14px] text-center">
                      <p className="font-bold text-[14px] text-white leading-[1.3]">{NAV_SUBMENU_HEADERS[item.id].title}</p>
                      <p className="font-normal text-[13px] text-white/75 leading-[1.3] mt-[4px]">{NAV_SUBMENU_HEADERS[item.id].subtitle}</p>
                    </div>
                  )}
                  <div className={`${NAV_SUBMENU_HEADERS[item.id] ? "max-h-[360px] overflow-y-auto" : ""}`}>
                    {submenu.map((sub) =>
                      sub.isSectionHeader ? (
                        <div key={sub.id} className="bg-[#4a6fa5] px-[16px] py-[10px] text-center">
                          <span className="font-semibold text-[13px] text-white">{sub.label}</span>
                        </div>
                      ) : (
                        <button
                          key={sub.id}
                          role="menuitem"
                          onClick={() => { setOpenSubmenu(null); handleNavClick(sub.id, sub.label); }}
                          className={`group w-full flex items-center gap-[12px] px-[16px] py-[14px] text-left cursor-pointer transition-colors ${item.id === "author" ? "hover:bg-[#3a5896]" : "hover:bg-[#f7f7f7]"}`}
                        >
                          <span className={`flex-shrink-0 ${item.id === "author" ? "text-[#444] group-hover:text-white" : "text-[#595959]"}`}>{sub.icon}</span>
                          <span className={`font-normal text-[14px] leading-[1.4] ${item.id === "author" ? "text-[#1a1a1a] group-hover:text-white" : "text-[#272727]"}`}>{sub.label}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center flex-shrink-0">
        <button aria-label="Search" className="flex items-center justify-center size-[40px] hover:bg-white/10 rounded cursor-pointer">
          <MIcon path={MSY.search} size={20} color="white" className="opacity-80" />
        </button>
        <div className="relative">
          <button aria-label="Notifications" aria-expanded={notifOpen} onClick={(e) => { e.stopPropagation(); setNotifOpen((o) => !o); }} className="relative flex items-center justify-center size-[40px] hover:bg-white/10 rounded cursor-pointer">
            <MIcon path={MSY.notifications} size={20} color="white" className="opacity-80" />
            {unread > 0 && <div className="absolute top-[6px] right-[7px] size-[8px] bg-[#d32f2f] rounded-full border border-[#002e5c]" />}
          </button>
          {notifOpen && (
            <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-[calc(100%+6px)] w-[320px] bg-white rounded-[8px] shadow-[0px_8px_24px_rgba(0,0,0,0.2)] border border-[#e5e7eb] z-[60] overflow-hidden font-['Inter',sans-serif]">
              <div className="px-[16px] py-[12px] border-b border-[#ededed] flex items-center justify-between">
                <span className="font-semibold text-[14px] text-[#272727]">Notifications</span>
                <span className="font-medium text-[12px] text-[#004080]">{unread} new</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {ASSESSOR_NOTIFICATIONS.map((n, i) => (
                  <div key={i} className={`px-[16px] py-[12px] border-b border-[#f0f0f0] last:border-0 ${n.unread ? "bg-[#f0f7ff]" : ""}`}>
                    <div className="flex items-start gap-[8px]">
                      {n.unread && <div className="size-[7px] rounded-full bg-[#004080] mt-[5px] flex-shrink-0" />}
                      <div className={n.unread ? "" : "pl-[15px]"}>
                        <p className="font-medium text-[13px] text-[#272727] leading-[1.4]">{n.title}</p>
                        <p className="font-normal text-[12px] text-[#595959] leading-[1.4] mt-[1px]">{n.body}</p>
                        <p className="font-normal text-[12px] text-[#949494] mt-[3px]">{n.when}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <button aria-label="Help" className="flex items-center justify-center size-[40px] hover:bg-white/10 rounded cursor-pointer">
          <MIcon path={MSY.help} size={20} color="white" className="opacity-80" />
        </button>
        <button aria-label="Account" className="flex items-center justify-center size-[40px] hover:bg-white/10 rounded cursor-pointer">
          <MIcon path={MSY.accountCircle} size={20} color="white" className="opacity-80" />
        </button>
      </div>
    </nav>
  );
}
