# PVS Demo - INTER Versicherungsgruppe

Statische HTML/CSS/JavaScript-Demo mit der INTER-Oberflaeche.
Kein Backend und keine echte Authentifizierung; alle Fachdaten sind Beispieldaten.

## Starten

`index.html` im Browser oeffnen oder lokal bereitstellen:

```sh
python -m http.server 8080
```

Danach `http://localhost:8080/` aufrufen.

## Anmeldung und Navigation

- Ein beliebiger, nicht leerer Benutzername und ein Passwort starten die Demo.
- Ohne Anmeldung fuehrt `dashboard.html` zur Login-Seite.
- Standardmaessig gilt die Demo-Sitzung fuer den aktuellen Browser-Tab.
- Mit **Angemeldet bleiben** bleibt der Demo-Zugang im lokalen Browser gespeichert.
- **Abmelden** entfernt beide Demo-Sitzungsmarker und fuehrt zur Login-Seite zurueck.
- Passwoerter werden weder gespeichert noch uebertragen.
- Navigation, Browser-Zurueck/Vorwaerts und Neuladen erhalten die aktuelle Ansicht ueber den URL-Hash.
- Suche und Typ-Filter durchsuchen die Demo-Geschaeftsvorfaelle gemeinsam.
- Die Glocke oeffnet die Hinweise. Das mobile Menue unterstuetzt Escape und Tastaturnavigation.

Browser-Speicher muss fuer den Demo-Zugang verfuegbar sein. Die lokale Demo-Sitzung
ist keine Zugriffssicherung fuer echte Daten.

## Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | Demo-Anmeldung |
| `dashboard.html` | Einzige Dashboard-Version: INTER-Design |
| `css/styles.css` | Gemeinsames Styling fuer Anmeldung und Dashboard |
| `js/main.js` | Demo-Sitzung, Navigation, Suche, Filter und mobiles Menue |

## Gestaltung

Die Farbpalette orientiert sich am [INTER-Webauftritt](https://www.inter.de/):
Marineblau `#001b41`, Gelb `#dedc00`, Weiss und helle Flaechen.
Gelb wird sparsam fuer Aktionen und die aktive Navigation eingesetzt.
Statusfarben bleiben fuer Fehler, Rueckmeldungen und abgeschlossene Vorgaenge erhalten.

## Demo-Grenzen

- Einstellungen zeigen eine Demo-Meldung; sie werden nicht gespeichert.
- Kennzahlen, Hinweise, Vertreter und Aktivitaeten sind feste Beispieldaten.
- Detailbearbeitung, Backend, echte Rollen und Passwort-Wiederherstellung fehlen.
- Antragserfassung und Export sind bewusst nicht Teil des Demo-Umfangs.
