import { useTranslation } from "react-i18next";

const eveningKeys = [
  { time: "17:00", key: "welcome" },
  { time: "17:30", key: "session1" },
  { time: "20:00", key: "presentations" },
];

const fullDayMorningKeys = [
  { time: "09:00", key: "team.welcome" },
  { time: "10:00", key: "team.session1" },
  { time: "12:00", key: "team.lunch" },
];

const fullDayAfternoonKeys = [
  { time: "13:00", key: "team.nextLevel" },
  { time: "13:30", key: "team.session2" },
  { time: "15:30", key: "team.presentations" },
  { time: "16:15", key: "team.future" },
  { time: "16:30", key: "team.qa" },
];

interface AgendaItemProps {
  time: string;
  title: string;
  description: string;
  isLast?: boolean;
}

const AgendaItem = ({ time, title, description, isLast }: AgendaItemProps) => (
  <div className="flex gap-4 group">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-display font-bold text-xs shadow-lg shrink-0">
        {time}
      </div>
      {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-primary/10 mt-1" />}
    </div>
    <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm flex-1 group-hover:shadow-md transition-shadow mb-3">
      <h3 className="font-display font-semibold text-base sm:text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

interface AgendaSectionProps {
  activeTab?: "you" | "company";
}

const AgendaSection = ({ activeTab = "you" }: AgendaSectionProps) => {
  const { t } = useTranslation();
  const isCompany = activeTab === "company";

  return (
    <section id="agenda" className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-14">
          {t("agenda.titlePre")}<span className="gradient-text">{t("agenda.titleHighlight")}</span>{t("agenda.titlePost")}
        </h2>
        {isCompany ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="font-display font-bold text-xl mb-6 text-center md:text-left">
                {t("agenda.teamMorning")}
              </h3>
              <div>
                {fullDayMorningKeys.map((item, i) => (
                  <AgendaItem
                    key={item.time}
                    time={item.time}
                    title={t(`agenda.items.${item.key}.title`)}
                    description={t(`agenda.items.${item.key}.description`)}
                    isLast={i === fullDayMorningKeys.length - 1}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl mb-6 text-center md:text-left">
                {t("agenda.teamAfternoon")}
              </h3>
              <div>
                {fullDayAfternoonKeys.map((item, i) => (
                  <AgendaItem
                    key={item.time}
                    time={item.time}
                    title={t(`agenda.items.${item.key}.title`)}
                    description={t(`agenda.items.${item.key}.description`)}
                    isLast={i === fullDayAfternoonKeys.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {t("agenda.morning") && (
              <h3 className="font-display font-bold text-xl mb-6 text-center">
                {t("agenda.morning")}
              </h3>
            )}
            <div>
              {eveningKeys.map((item, i) => (
                <AgendaItem
                  key={item.time}
                  time={item.time}
                  title={t(`agenda.items.${item.key}.title`)}
                  description={t(`agenda.items.${item.key}.description`)}
                  isLast={i === eveningKeys.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AgendaSection;
