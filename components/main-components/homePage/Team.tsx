import Image from "next/image";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  imagePosition: string;
}

const team: TeamMember[] = [
  {
    name: "Sofia Little",
    role: "Creative Lead",
    image: "/team_1.avif",
    imagePosition: "center 24%",
  },
  {
    name: "James Cohen",
    role: "Founder & CEO",
    image: "/team_2.avif",
    imagePosition: "center 18%",
  },
  {
    name: "Maya Rodriguez",
    role: "Growth Specialist",
    image: "/team_3.avif",
    imagePosition: "center 20%",
  },
];

export default function Team() {
  return (
    <section
      style={{
        backgroundColor: "var(--color-100)",
        fontFamily: "var(--font-main)",
      }}
      className="w-full px-6 md:px-16 py-20"
    >
      <p
        style={{ color: "var(--color-500)" }}
        className="text-xs uppercase tracking-widest font-medium mb-4"
      >
        Our team
      </p>
      <h2
        style={{ color: "var(--color-200)" }}
        className="text-3xl md:text-4xl font-bold tracking-tight leading-snug max-w-md mb-14"
      >
        Meet the team behind your success.
      </h2>

      {/* Team grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {team.map((member) => (
          <div key={member.name} className="flex flex-col gap-4">
            {/* Avatar card */}
            <div
              style={{ backgroundColor: "var(--color-300)" }}
              className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                style={{ objectPosition: member.imagePosition }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </div>
            <div>
              <p
                style={{ color: "var(--color-200)" }}
                className="text-sm font-semibold"
              >
                {member.name}
              </p>
              <p
                style={{ color: "var(--color-500)" }}
                className="text-xs mt-0.5"
              >
                {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Join CTA banner */}
      <div
        style={{ backgroundColor: "var(--color-300)" }}
        className="rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div>
          <p
            style={{ color: "var(--color-200)" }}
            className="text-base font-semibold mb-1"
          >
            Want to be part of the team?
          </p>
          <p
            style={{ color: "var(--color-500)" }}
            className="text-sm max-w-md leading-relaxed"
          >
            We&apos;re always looking for talented strategists and growth
            experts to join our mission of helping brands go viral.
          </p>
        </div>
        <a
          href="mailto:hello@viral.co"
          style={{
            backgroundColor: "var(--color-200)",
            color: "var(--color-100)",
          }}
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold hover:opacity-75 transition-opacity"
        >
          Apply now
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7h10M7 2l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
