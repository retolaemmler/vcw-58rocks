# Zugerberg Prep Survey — Insight-Slides

Eine neue Slides-Seite in der App, die die Antworten aus dem Zugerberg Prep Survey live auswertet und als Deck für den Workshop-Start (Kickoff, auf Deutsch) präsentiert werden kann. Aktuell liegen 29 Antworten vor.

## Route

`/zugerberg/slides` — Vollbild-Präsentationsmodus, Navigation per Pfeiltasten, Klick und sichtbaren Pfeilen, Foliennummer unten. Die Folien laden die Daten direkt aus dem Backend, sind also beim Öffnen immer aktuell.

## Foliensequenz

1. **Titel** — "Willkommen im Vibe Coding Workshop", Zugerberg Finanz, Datum des jeweiligen Tages, Anzahl Teilnehmende.
2. **Wer ist im Raum** — Grosse Kennzahlen: Anzahl Antworten, Aufteilung auf die beiden Workshop-Tage (20. August / 8. September), Anteil mit konkreter App-Idee.
3. **Erfahrungslevel** — Balkendiagramm "AI Coding Erfahrung" und "Lovable Erfahrung" nebeneinander, mit einer Kernaussage darunter (z.B. wie viele komplett neu einsteigen).
4. **Eure Ziele** — Top-Nennungen aus "workshop_goals" als Ranking-Balken.
5. **Woran wir Erfolg messen** — Top-Nennungen aus "success_criteria", gleiche Darstellung.
6. **Eure App-Ideen** — 3-4 anonymisierte Idee-Zitate als Karten (gekürzt auf je 2-3 Zeilen), plus Hinweis, wie viele noch offen sind.
7. **Was ihr bauen wollt** — "building_blocks" als Ranking (Datenbank, Datei-Uploads, Login, KI-Funktionen, API-Integrationen ...) — zeigt, welche Bausteine wir im Workshop abdecken.
8. **Abschluss / Los geht's** — Agenda-Ausblick und Call to Action.

Alle Diagramme nutzen die bestehende Recharts-Bibliothek und die Projektfarben (Teal als Primärfarbe, Violett/Cyan als Sekundärtöne), passend zum restlichen Auftritt.

## Umgang mit den Daten

- Mehrfachnennungen (Ziele, Erfolgskriterien, Building Blocks) sind kommasepariert gespeichert und werden pro Nennung gezählt.
- Es werden keine Namen oder E-Mail-Adressen auf den Folien gezeigt — Ideen erscheinen anonym.
- Optionaler Tagesfilter (Alle / 20. August / 8. September) oben rechts, damit dasselbe Deck an beiden Tagen passend gezeigt werden kann.
- Es werden ausschliesslich echte Antwortwerte dargestellt, keine erfundenen Zahlen.

## Technisches

- Neue Datei `src/pages/ZugerbergSlides.tsx` plus Folienkomponenten unter `src/components/zugerberg-slides/`, Route in `src/App.tsx`.
- Fixe 1920x1080-Bühne, per `transform: scale()` an den Viewport angepasst, damit Text auch beim Beamen gross und lesbar bleibt.
- Datenabruf wie in `ZugerbergSurveyAdmin.tsx`: Token mit `kind = 'zugerberg_prep'` holen, dann die zugehörigen `survey_responses`.
- Die Seite ist unverlinkt (nicht in der Navigation), nur über die direkte URL erreichbar.
