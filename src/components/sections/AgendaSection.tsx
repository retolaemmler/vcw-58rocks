import { useTranslation } from "react-i18next";

const morningKeys = [
  { time: "17:00", key: "welcome" },
  { time: "17:15", key: "session1" },
];

const afternoonKeys = [
  { time: "20:00", key: "presentations" },
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

const AgendaSection = () => {
  const { t } = useTranslation();
  return (
    <section id="agenda" className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-14">
          {t("agenda.titlePre")}<span className="gradient-text">{t("agenda.titleHighlight")}</span>{t("agenda.titlePost")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Morning */}
          <div>
            {t("agenda.morning") && (
              <h3 className="font-display font-bold text-xl mb-6 text-center md:text-left">
                {t("agenda.morning")}
              </h3>
            )}
            <div>
              {morningKeys.map((item, i) => (
                <AgendaItem
                  key={item.time}
                  time={item.time}
                  title={t(`agenda.items.${item.key}.title`)}
                  description={t(`agenda.items.${item.key}.description`)}
                  isLast={i === morningKeys.length - 1}
                />
              ))}
            </div>
          </div>
          {/* Afternoon */}
          <div>
            <h3 className="font-display font-bold text-xl mb-6 text-center md:text-left">
              {t("agenda.afternoon")}
            </h3>
            <div>
              {afternoonKeys.map((item, i) => (
                <AgendaItem
                  key={item.time}
                  time={item.time}
                  title={t(`agenda.items.${item.key}.title`)}
                  description={t(`agenda.items.${item.key}.description`)}
                  isLast={i === afternoonKeys.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
