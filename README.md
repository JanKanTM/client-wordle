
# Wortel – Wordle-Clone mit Vue 3, TypeScript & Vite

**Entwickler:** Jan Hildmann  
**Repository:** [client-wordle](https://github.com/JanKanTM/client-wordle)  
**Lizenz:** MIT


## Projektbeschreibung

Wortel ist ein moderner Wordle-Clone, entwickelt mit Vue 3, TypeScript und Vite. Das Projekt entstand im Rahmen einer Aufgabe in der Berufsschule und bietet eine authentifizierte Spielumgebung, ein ansprechendes Design und eine einfache Erweiterbarkeit. Nutzer können sich registrieren, einloggen und das beliebte Wortratespiel spielen. Die Anwendung verwendet Axios für die Kommunikation mit einem Backend.

## Features

- **Login & Registrierung** mit Passwort-Hashing (SHA-256, clientseitig)
- **Authentifizierung** und User-Session-Handling
- **Wordle-Spiel** mit Timer, Score und Highscore
- **Responsive UI** mit TailwindCSS
- **Vue Router** für Navigation zwischen Hub und Spiel
- **Modulare Komponentenstruktur** (GameHeader, GameFooter, LoginForm, WordleGame, Instructions)
- **Anleitung & Highscore-Ansicht** (Platzhalter)
- **TypeScript** für Typensicherheit

## Projektstruktur

```
client-wordle/
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
├── src/
│   ├── App.vue
│   ├── main.ts
│   ├── vite-env.d.ts
│   ├── api/
│   │   └── user.ts
│   ├── assets/
│   │   └── logo/
│   │       └── Logo.png
│   ├── components/
│   │   ├── GameFooter.vue
│   │   ├── GameHeader.vue
│   │   ├── Instructions.vue
│   │   ├── LoginForm.vue
│   │   └── WordleGame.vue
│   ├── pages/
│   │   ├── GameHub.vue
│   │   └── GameView.vue
│   ├── router/
│   │   └── index.ts
│   ├── service/
│   │   └── useAuth.ts
│   ├── styles/
│   │   ├── LoginForm.css
│   │   ├── style.css
│   │   └── WordleGame.css
```

## Installation

### Voraussetzungen

- Node.js (empfohlen: >=18.x)
- npm (empfohlen: >=9.x)

### Schritte

1. **Repository klonen**
	```bash
	git clone https://github.com/JanKanTM/client-wordle.git
	cd client-wordle
	```

2. **Abhängigkeiten installieren**
	```bash
	npm install
	```

3. **Entwicklungsserver starten**
	```bash
	npm run dev
	```
	Die App ist dann unter [http://localhost:5173](http://localhost:5173) erreichbar.

4. **Build für Produktion**
	```bash
	npm run build
	```

5. **Preview des Builds**
	```bash
	npm run preview
	```

## Konfiguration

- **Backend-URL:** Die API-URL ist aktuell auf `http://localhost:8080/api` gesetzt (`src/api/user.ts`). Passe dies ggf. an dein Backend an.
- **TailwindCSS:** Ist bereits integriert und kann in den CSS-Dateien verwendet werden.
- **Umgebungsvariablen:** Für fortgeschrittene Konfiguration siehe Vite-Dokumentation.

## Entwicklung

- **Komponenten:** Alle UI-Komponenten liegen unter `src/components/`
- **Seiten:** Die Hauptseiten sind unter `src/pages/` zu finden
- **Routing:** Die Navigation wird über `src/router/index.ts` gesteuert
- **Authentifizierung:** Die Logik liegt in `src/service/useAuth.ts`
- **API:** Die Schnittstellen und Typen sind in `src/api/user.ts` definiert

## Mitwirken

Pull Requests und Issues sind willkommen! Bitte stelle sicher, dass dein Code den Styleguides entspricht und alle relevanten Tests bestanden werden.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz.
