const posts = [
  "https://www.linkedin.com/embed/feed/update/urn:li:activity:7419422883065688064",
  "https://www.linkedin.com/embed/feed/update/urn:li:activity:7453172833674956800",
];

const CompanyLinkedInPosts = () => (
  <section className="py-20 px-4 bg-section-alt">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">
          What companies say
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
          Real stories from real teams
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hear directly from people who ran a Vibe Code Workshop with their team.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
        {posts.map((src, i) => (
          <iframe
            key={src}
            src={src}
            height={750}
            width={504}
            loading="lazy"
            allowFullScreen
            title={`LinkedIn post ${i + 1}`}
            className="w-full max-w-[504px] rounded-2xl border border-border bg-background shadow-sm"
          />
        ))}
      </div>
    </div>
  </section>
);

export default CompanyLinkedInPosts;