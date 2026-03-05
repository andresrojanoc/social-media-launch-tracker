# Feature Specification: Launch Tracking Dashboard

**Feature Branch**: `001-launch-tracker`  
**Created**: 2026-03-05  
**Status**: Draft  
**Input**: User description: "Build a custom dashboard to pull launch videos from platforms like X, LinkedIn, as well as fundraise announcements from Google, crunchbase, and other company fundraise databases or incubators (ie YCombinator). Map out in the dashboard how much each company has raised, how many likes their launch got on X and LinkedIn. For each new data point in the dashboard, add in an enriched contact methods box that includes email, phone number, linkedin, and X. Add in functionality that drafts DMs to launches that did poorly."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Unified Launch & Fundraise Dashboard (Priority: P1)

As a user, I want to see a unified dashboard of recent company launches and fundraises so that I can track market activity in one place.

**Why this priority**: Core value proposition. Visualizing the aggregated metric data is the foundation of the dashboard.

**Independent Test**: Can be tested by loading the dashboard with mocked data and verifying that raised amounts and X/LinkedIn likes are correctly displayed for each company.

**Acceptance Scenarios**:

1. **Given** the dashboard is open, **When** launch data is successfully loaded, **Then** I see a list of companies with their raised amount and launch engagement metrics (likes on X and LinkedIn).
2. **Given** the dashboard is open, **When** a company does not have a fundraise amount listed, **Then** it should display a clear "N/A" rather than breaking the UI.

---

### User Story 2 - Access Enriched Contact Information (Priority: P1)

As a user, I want to see enriched contact information for each company so that I can easily reach out to them.

**Why this priority**: Directly enables the actionability of the dashboard and sets up the DM drafting feature.

**Independent Test**: Can be tested by selecting an arbitrary company data point and verifying the contact box renders all available contact methods (email, phone, LinkedIn, X).

**Acceptance Scenarios**:

1. **Given** I am viewing a specific company's entry, **When** I look at the enriched contact methods box, **Then** I see their email, phone number, LinkedIn, and X profiles if available.
2. **Given** a company is missing a specific contact method (e.g., no phone number), **When** I view their contact box, **Then** the missing method is gracefully omitted or marked as unavailable.

---

### User Story 3 - Draft DMs to Poorly Performing Launches (Priority: P2)

As a user, I want the system to automatically provide drafted DMs for companies whose launches had low engagement so that I can efficiently offer my services.

**Why this priority**: A high-leverage workflow enhancement, but depends on the dashboard and contact information existing first.

**Independent Test**: Can be tested by providing a launch with below-threshold likes to the system and verifying a contextual DM is generated.

**Acceptance Scenarios**:

1. **Given** a launch has engagement metrics below the defined threshold, **When** I view the company, **Then** I see a suggested, contextual DM draft that I can use to contact them.
2. **Given** a launch had high engagement, **When** I view the company, **Then** the DM drafting prompt is hidden or states that the launch was successful.

### Edge Cases

- What happens when an external platform (like X or LinkedIn) changes its data layout or API, causing the data pull to fail?
- How does system handle a company that has multiple conflicting fundraise announcements?
- How does system handle a user attempting to generate a DM when the company has no associated X/LinkedIn contact handle?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST aggregate and display company fundraise announcements and launch videos by building specific API integrations (e.g., Crunchbase API, X API, LinkedIn API) rather than scraping.
- **FR-002**: System MUST display launch video engagement metrics, specifically the number of likes on X and LinkedIn.
- **FR-003**: System MUST display the total amount raised by each company.
- **FR-004**: System MUST provide an enriched contact methods box per company, displaying email, phone, LinkedIn, and X profiles.
- **FR-005**: System MUST identify "poorly performing" launches based on engagement metrics, with the threshold configurable by the user within the dashboard settings.
- **FR-006**: System MUST automatically generate draft Direct Messages (DMs) for poorly performing launches, displaying them as copy-paste text in the dashboard for the user to manually send.

### Non-Functional Requirements (Constitution Alignment)

- **NFR-001** (Scalability): The data aggregation layer MUST be designed to periodically pull updates without blocking the UI rendering of the dashboard.
- **NFR-002** (Testability): Data ingestion logic MUST be cleanly separated from UI components to allow mock-based unit testing of dashboard layouts.
- **NFR-003** (User Experience): Data tables and cards MUST be responsive and handle missing data gracefully.
- **NFR-004** (Consistency): API endpoints (internal or external) MUST standardize payload schemas regardless of the origin source (X vs LinkedIn vs Crunchbase).

### Key Entities

- **Company Data Point**: Represents the unified record of a company, containing the `AmountRaised` and links/references to underlying events.
- **Launch Event**: Contains `Platform` (X/LinkedIn), `VideoUrl`, and `EngagementMetrics` (Likes).
- **Enriched ContactBox**: Contains `Email`, `PhoneNumber`, `LinkedInHandle`, and `XHandle`.
- **Engagement Draft**: Contains `TargetPlatform`, `DraftText`, and `GeneratedContext`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view aggregated launch and fundraise metrics (likes and raised amounts) in a single dashboard view without manual compilation.
- **SC-002**: Contact information boxes correctly assemble and display 100% of the contact data points provided by the backend.
- **SC-003**: The system generates relevant DM drafts for 100% of the launches that fall under the "poor performance" metric threshold.
- **SC-004**: The system processes and surfaces new data points accurately without breaking the UI layout when partial data is missing (e.g., missing phone number or null fundraise amount).
