## Project Structure

/components/tabs/ → All UI tab views (Project, Patterns, Diagram)
ProjectTab.tsx
ArchitectureDiagramTab.tsx
PatternsTab.tsx

/context/
LandingZoneContext.tsx → Provides global config context

/types/
patterns.ts → Contains all type definitions

/pages/
LandingZonePage.tsx → Root entry point with tab navigation


## Run the App

Make sure all components are in place and used in the correct import paths:

```bash
npm run dev

---
