import { requireUser } from "@/lib/permissions";
import { PageShell } from "@/components/PageShell";
import { MembershipShell } from "@/components/membership/MembershipShell";
import type { Rank } from "@/lib/rank";

export default async function MembershipLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();
  return (
    <PageShell accent="cyan">
      <MembershipShell
        name={session.user.name || session.user.email || "Rancher"}
        rank={session.user.rank as Rank}
        points={session.user.points}
      >
        {children}
      </MembershipShell>
    </PageShell>
  );
}
