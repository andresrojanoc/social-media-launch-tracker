# Tasks: Launch Tracking Dashboard

**Input**: Design documents from `/specs/001-launch-tracker/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Django project and `api` app in `backend/`
- [x] T002 Initialize React project (Vite or CRA) in `frontend/`
- [x] T003 [P] Configure Python environment and install Django/DRF dependencies
- [x] T004 [P] Configure Node environment and install frontend dependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Setup PostgreSQL database connection in `backend/config/settings.py`
- [x] T006 Configure Django REST Framework and CORS headers in `backend/config/settings.py`
- [x] T007 [P] Create base API utility client in `frontend/src/utils/api.js`
- [x] T008 [P] Setup global custom CSS layout in `frontend/src/css/index.css`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Unified Launch & Fundraise Dashboard (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to see a unified dashboard of recent company launches and fundraises so that I can track market activity in one place.

**Independent Test**: Can be tested by loading the dashboard with mocked data and verifying that raised amounts and X/LinkedIn likes are correctly displayed for each company.

### Implementation for User Story 1

- [x] T009 [P] [US1] Create `Company` model in `backend/api/models.py`
- [x] T010 [P] [US1] Create `LaunchEvent` model in `backend/api/models.py`
- [x] T011 [US1] Create serializers for Company and LaunchEvent in `backend/api/serializers.py`
- [x] T012 [US1] Implement `GET /api/companies/` endpoint in `backend/api/views.py` and `urls.py`
- [x] T013 [P] [US1] Create `Dashboard` page component in `frontend/src/components/Dashboard.jsx`
- [x] T014 [P] [US1] Create `CompanyCard` and metric display components in `frontend/src/components/`
- [x] T015 [US1] Integrate `Dashboard` with `GET /api/companies/` using `api.js`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Access Enriched Contact Information (Priority: P1)

**Goal**: As a user, I want to see enriched contact information for each company so that I can easily reach out to them.

**Independent Test**: Can be tested by selecting an arbitrary company data point and verifying the contact box renders all available contact methods (email, phone, LinkedIn, X).

### Implementation for User Story 2

- [x] T016 [P] [US2] Create `ContactInfo` model in `backend/api/models.py`
- [x] T017 [US2] Update serializers in `backend/api/serializers.py` to embed `ContactInfo` in Company response
- [x] T018 [P] [US2] Create `ContactBox` UI component in `frontend/src/components/ContactBox.jsx`
- [x] T019 [US2] Integrate `ContactBox` into `CompanyCard` to display the contact data

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Draft DMs to Poorly Performing Launches (Priority: P2)

**Goal**: As a user, I want the system to automatically provide drafted DMs for companies whose launches had low engagement so that I can efficiently offer my services.

**Independent Test**: Can be tested by providing a launch with below-threshold likes to the system and verifying a contextual DM is generated.

### Implementation for User Story 3

- [x] T020 [P] [US3] Create `DM_Draft` model in `backend/api/models.py`
- [x] T021 [US3] Implement logic to determine "poor performance" threshold in `backend/api/services.py`
- [x] T022 [US3] Implement `POST /api/companies/{id}/draft_dm/` endpoint in `backend/api/views.py`
- [x] T023 [P] [US3] Create `DMDraftPrompt` UI component in `frontend/src/components/DMDraftPrompt.jsx`
- [x] T024 [US3] Integrate `DMDraftPrompt` to trigger the POST endpoint and display the copy-paste text

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T025 [P] Comprehensive UI styling improvements in `frontend/src/css/`
- [x] T026 [P] Add error boundaries and loading states in React components
- [ ] T027 Update README.md with run instructions based on `quickstart.md`
- [ ] T028 Verify all manual testing scenarios pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Sequential priority order: US1 → US2 → US3
- **Polish (Final Phase)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Extends US1 models and UI; wait for US1 baseline to establish Company components.
- **User Story 3 (P2)**: Depends on US1/US2 for Company context and display layout.

### Within Each User Story

- Models before views/serializers
- Backend endpoints before frontend integration
- Core implementation before UI polish

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently. The dashboard should load and display companies and launch metrics.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently
3. Add User Story 2 → Test contact info box rendering
4. Add User Story 3 → Test DM drafting functionality
5. Polish styling and documentation
---

## Phase 7: Universal DM Draft & Responsiveness (User Request - Step 549)

**Purpose**: Make DM drafting available for all companies, add a dummy send button, and ensure responsive design.

- [x] T029 [B] Remove "poor performance" check in `backend/api/views.py`
- [x] T030 [F] Remove conditional rendering of `DMDraftPrompt` in `CompanyCard.jsx`
- [x] T031 [F] Add dummy "Send DM" button in `DMDraftPrompt.jsx`
- [x] T032 [F] Apply responsive grid layout in `Dashboard.css`
- [x] T033 [F] Ensure centered content and mobile-friendly styles in CSS files
- [x] T034 [F] Update `DMDraftPrompt.jsx` subtitle and button behavior
- [x] T035 [B] Make `seed_data.py` parametrizable with `--count` argument

---

## Phase 8: Repository Pattern (User Request - Step 632)

**Purpose**: Decouple data access from Django ORM using the Repository pattern.

- [x] T036 [B] Create `api/repositories.py` with interfaces and Django implementations
- [x] T037 [B] Refactor `api/views.py` to use repositories
- [x] T038 [B] Verify data access still works correctly across the app

---

## Phase 9: Unified Code Review & Decoupling (User Request - Step 691)

**Purpose**: Formalize architecture with Service Layers and further decouple logic from framework concerns.

- [x] T039 [B] Introduce Application Service Layer in `api/services.py`
- [x] T040 [B] Refactor `views.py` to use Service Layer exclusively for business logic
- [x] T041 [B] Extract ORM-specific logic from views into Repositories
- [x] T042 [F] Create Frontend Service Layer for API calls
- [x] T043 [F] Refactor components to use Frontend Services

---

## Phase 10: Robust Error Handling (User Request - Step 865)

**Purpose**: Implement consistent error reporting and graceful degradation across backend and frontend.

- [x] T044 [B] Implement custom DRF exception handler in `api/exceptions.py`
- [x] T045 [B] Register exception handler in `settings.py`
- [x] T046 [F] Enhance `api.js` to handle non-200 responses and network errors
- [x] T047 [F] Create `ErrorDisplay` common component
- [x] T048 [F] Integrate error handling into `Dashboard` and `DMDraftPrompt`
