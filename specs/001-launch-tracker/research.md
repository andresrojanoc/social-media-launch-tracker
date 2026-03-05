# Research: Launch Tracking Dashboard

## Tech Stack Choices

### Backend Framework
- **Decision**: Django (Python)
- **Rationale**: User explicitly requested Django to manage the API, data models, and integrations with external APIs (X, LinkedIn, Crunchbase). Django REST Framework (DRF) provides excellent tools for building APIs quickly and securely.
- **Alternatives considered**: FastAPI, Node.js/Express (rejected based on user constraint).

### Frontend Framework
- **Decision**: React
- **Rationale**: User explicitly requested React to build the interactive dashboard, separated clearly from the backend.
- **Alternatives considered**: Vue, Svelte, Django Templates (rejected based on user constraint).

### Styling
- **Decision**: Standard HTML, CSS, and modern JavaScript (ES6+). No heavy UI frameworks.
- **Rationale**: User explicitly requested avoiding Tailwind or Material UI unless absolutely necessary, and to stick to custom CSS for styling to keep the DOM structure clean.
- **Alternatives considered**: Tailwind CSS, Material UI (rejected based on user constraint).

### Architecture
- **Decision**: Clean separation of concerns between Django API and React frontend.
- **Rationale**: Ensures scalability, independent testing, and clear project structure. React will handle UI state and rendering, while Django will serve as an API and data integration layer.
