# CustomEMR — Demo Preparation Plan

## Demo Narrative
**"From Jira ticket to production in under 10 minutes, fully automated by Claude Code."**

---

## Demo Flow
```
Jira Ticket → /pick-ticket → Build Feature → /ship (includes code review) → PR → /deploy → Vercel → /close-ticket → Jira Updated
```

---

## PREPARATION STEPS (Execute in Order)

### Step 1: Build the Backend
**Goal:** Make the platform feel real with MongoDB + working APIs

**Must have working CRUD with real MongoDB data:**

| Module | What to Build | Priority |
|--------|---------------|----------|
| **Auth** | Login/logout with JWT + httpOnly cookies | P0 |
| **Patients** | Full CRUD + search + pagination against MongoDB | P0 |
| **Appointments/Scheduling** | Full CRUD + filter by date/provider | P0 |
| **Dashboard** | Read-only aggregates from patients + appointments | P0 |

**Can stay mock/placeholder (not needed for demo):**

| Module | Reason |
|--------|--------|
| CPOE (Prescriptions) | Placeholder, complex domain |
| Billing | Placeholder, complex claim workflows |
| Reports | Mock data fine, not core |
| Settings | Config UI, no BE needed |
| AI Agents | Dashboard with charts, mock fine |
| Communications | All "coming soon" placeholder pages |
| Referral | Low priority |

**Dummy data to seed in MongoDB:**
- ~150-200 patients (realistic names, DOBs, MRNs, tags, portal statuses)
- ~50-80 appointments (past week + next week, mixed statuses)
- ~20 unsigned encounters (for dashboard widget)
- ~10-15 messages, tasks, notifications (for dashboard)
- All cross-referenced (appointments reference real patient IDs)
- Data should feel lived-in, not empty or shallow

**Tech stack for BE:**
- MongoDB Atlas cluster (free tier is fine)
- Mongoose for ODM
- JWT for auth (httpOnly cookies)
- Next.js API routes (already scaffolded at src/app/api/)
- bcrypt for password hashing

---

### Step 2: Demo Feature Selection

Need **1 BE ticket** and **1 FE ticket** that are:
- Scoped enough to build in ~2-3 minutes via Claude
- Visible enough to demo live
- Currently placeholder/missing in the project

**CHOSEN FEATURES:**

#### BE Ticket: "Add Patient Allergies API" (EMR-101)
- New MongoDB collection: `allergies`
  - Fields: patientId, allergen, severity (Mild/Moderate/Severe), reaction, dateRecorded
- Endpoints:
  - `GET /api/patients/[id]/allergies` — list allergies for a patient
  - `POST /api/patients/[id]/allergies` — add an allergy
  - `DELETE /api/patients/[id]/allergies/[allergyId]` — remove
- Seed 2-3 allergies per patient in the DB
- Why: Clean, small API — one collection, three endpoints, obvious healthcare relevance

#### FE Ticket: "Patient Allergies Panel in Patient Detail View" (EMR-102)
- Clicking a patient row → opens side panel or modal with patient details
- "Allergies" tab/section showing allergy cards
- Color-coded severity badges (Mild = green, Moderate = amber, Severe = red)
- "Add Allergy" button with a form modal
- Connects to the BE API built in EMR-101
- Why: Visible UI, uses existing patterns (Modal, Badge, StatCard), natural extension

---

### Step 3: Jira Ticket Content
- Prepare full ticket text for both EMR-101 and EMR-102
- Each ticket includes: Title, Description, Acceptance Criteria, Story Points, Labels
- Technical details: endpoints, schemas, component structure
- **Manual step:** I (the user) add Figma screenshots to tickets after creation
- Labels: `backend`, `frontend`, `sprint-1`, `emr`, etc.

---

### Step 4: Create Claude Commands

**4 commands total — NO `/project:` prefix:**

| # | Command | What It Does |
|---|---------|-------------|
| 1 | `/pick-ticket "PROJ-123"` | Jira MCP → fetch ticket → read KB → create branch → build feature |
| 2 | `/ship "PROJ-123"` | **Code review subagent** → stage → commit (with ticket #) → push → create PR via `gh` |
| 3 | `/deploy` | Run Vercel CLI → wait → return deployed URL |
| 4 | `/close-ticket "PROJ-123"` | Update Jira: PR link, deployed URL, QA notes, transition status |

#### Command 1: `/pick-ticket "PROJ-123"`
1. Connect to Jira via Atlassian MCP
2. Fetch ticket: title, description, acceptance criteria, attachments
3. Read project KB (docs/knowledge-base/)
4. Detect if FE or BE from ticket labels
5. Create feature branch: `feat/PROJ-123-short-description`
6. Build the feature (write code)
7. Save to Claude memory: ticket number, branch name, what was built

#### Command 2: `/ship "PROJ-123"`
1. **Run Code Reviewer subagent BEFORE committing:**
   - Subagent reads all changed files (`git diff`)
   - Checks for: security issues, missing error handling, pattern violations, unused imports
   - Reports findings with severity (critical / warning / info)
   - If critical issues found → fix them automatically before proceeding
   - If only warnings/info → note them in PR description and proceed
2. **Verify git identity BEFORE committing:**
   - Run `git config user.name` and `git config user.email`
   - Display the name and email to the user
   - Ask user to confirm these credentials are correct
   - Only proceed if user confirms; abort if they decline
3. Stage changes
4. Generate conventional commit: `feat(PROJ-123): description`
5. Push branch to remote
6. Create PR via `gh pr create`:
   - Title linked to ticket
   - Summary of changes
   - Code review findings (from subagent)
   - Test plan
   - Link back to Jira ticket
7. Save PR URL to memory

#### Command 3: `/deploy`
1. Run `vercel --prod` (or preview deploy)
2. Monitor deployment status
3. Return deployed URL
4. Save URL to memory

#### Command 4: `/close-ticket "PROJ-123"`
1. Read PR URL and deployed URL from memory
2. Add Jira comment:
   ```
   Implementation complete.
   PR: https://github.com/...
   Deployed: https://custom-emr.vercel.app

   QA Notes:
   - Navigate to Patients → click any patient → Allergies tab
   - Verify allergy cards display with severity badges
   - Test "Add Allergy" form
   ```
3. Transition ticket status to "In Review" or "QA"

---

### Step 5: Code Reviewer Subagent, Memory & Skills Showcase

**Subagent — "Code Reviewer" (runs inside `/ship` command):**
- **IMPORTANT: The Code Reviewer agent file must be created BEFORE the `/ship` command can use it**
  - Create agent definition at `.claude/agents/code-reviewer.md` (project-level)
  - The `/ship` command invokes this agent via the Task tool
  - Agent must be created and tested as a prerequisite before `/ship` works
- Invoked automatically as part of `/ship` before any commit
- Reads all changed files via `git diff`
- Performs adversarial code review:
  - Security: injection, XSS, exposed secrets
  - Patterns: matches project conventions from KB
  - Quality: error handling, edge cases, naming
  - Healthcare: HIPAA considerations if applicable
- Output: structured findings with severity levels
- Critical findings → auto-fixed before commit
- Warnings → included as notes in the PR description
- **How it works:** `/ship` command prompt instructs Claude to use the Task tool to spawn the `code-reviewer` agent → agent reviews the diff → returns findings → `/ship` continues with git config check, commit, push, PR
- **Demo narrative:** "Before shipping, Claude automatically reviews its own code for issues"

**Memory usage across commands:**
- After `/pick-ticket` → save: ticket number, branch, what was built
- After `/ship` → save: PR URL, commit hash, review findings
- After `/deploy` → save: deployed URL
- `/close-ticket` reads ALL of this from memory to compose the Jira update
- **Demo narrative:** "Claude remembers the full context across commands"

**Skills composition:**
- `/pick-ticket` internally uses KB reading + feature building
- `/ship` internally invokes the Code Reviewer subagent
- Shows the skill/subagent ecosystem working together

---

## DEMO SCRIPT (Live Execution)

### Opening (30 sec)
"I have two Jira tickets — one backend, one frontend. Let me show you how Claude Code takes a ticket from Jira all the way to deployment."

### Act 1 — Backend Ticket (~3 min)
```
/pick-ticket "EMR-101"
```
→ Claude fetches ticket, builds allergies API, shows progress
→ "The entire API — model, routes, seed data — built from the ticket spec."

### Act 2 — Ship Backend (~1-2 min)
```
/ship "EMR-101"
```
→ Code Reviewer subagent runs first, reviews the code
→ Fixes any critical issues, then commits, pushes, creates PR
→ Show the PR on GitHub — note the review findings in the PR description

### Act 3 — Frontend Ticket (~3 min)
```
/pick-ticket "EMR-102"
```
→ Claude fetches ticket, builds allergies UI panel
→ "It connected to the API from the previous ticket automatically."

### Act 4 — Ship + Deploy (~2 min)
```
/ship "EMR-102"
/deploy
```
→ Code review runs again, second PR created, then Vercel deployment
→ Open deployed URL live, show the feature working

### Act 5 — Close the Loop (~1 min)
```
/close-ticket "EMR-101"
/close-ticket "EMR-102"
```
→ Show Jira updated with PR links, deployed URL, QA notes

### Closing
"From ticket to production in under 10 minutes, fully automated."

---

## EXECUTION ORDER (What to Build When)

| # | Task | Status |
|---|------|--------|
| 1 | Build backend (MongoDB, auth, patients, appointments, dashboard APIs) | PENDING |
| 2 | Seed MongoDB with 200+ realistic records | PENDING |
| 3 | Connect frontend pages to real API routes | PENDING |
| 4 | Verify platform works end-to-end (login → dashboard → patients → scheduling) | PENDING |
| 5 | Write Jira ticket content (EMR-101 BE, EMR-102 FE) | PENDING |
| 6 | Create Code Reviewer agent file (`.claude/agents/code-reviewer.md`) — MUST be done before `/ship` command | PENDING |
| 7 | Create 4 Claude commands (pick-ticket, ship, deploy, close-ticket) — `/ship` uses the agent from step 6 via Task tool | PENDING |
| 8 | Set up Vercel project + environment variables | PENDING |
| 9 | Set up GitHub repo + `gh` CLI auth | PENDING |
| 10 | Dry run full demo flow end-to-end | PENDING |
| 11 | Fix rough edges from dry run | PENDING |

---

## REQUIREMENTS / PREREQUISITES

- [ ] MongoDB Atlas cluster URL
- [ ] GitHub repo created for custom-emr-next
- [ ] `gh` CLI authenticated (`gh auth login`)
- [ ] Vercel account + project linked (`vercel link`)
- [ ] Jira project with EMR prefix (or chosen prefix)
- [ ] Atlassian MCP configured in `.mcp.json`
- [ ] Figma screenshots for both tickets (manual step)

---

## NOTES
- The demo features (allergies) are deliberately NOT built yet — they will be built LIVE by Claude during the demo
- The backend + seed data must be ready BEFORE the demo
- The commands must be tested in a dry run BEFORE the demo
- Keep the demo under 12 minutes total including talking
- Commands do NOT have /project: prefix — just /pick-ticket, /ship, /deploy, /close-ticket
- Code Reviewer subagent runs INSIDE /ship, not as a separate command
