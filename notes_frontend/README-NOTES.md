Notes Frontend

Setup
1) Copy .env.example to .env and set:
   - NOTES_API_BASE_URL
   - SITE_URL
   - SESSION_SECRET
2) Install dependencies: npm install
3) Run in dev: npm run dev
4) Build: npm run build
5) Start: npm start

Features
- User authentication (login/register) with cookie session
- Create, edit, delete notes
- List and search notes in sidebar
- Responsive light theme UI with header + sidebar + main editor
- REST API integration using NOTES_API_BASE_URL

Environment
- Do not hard-code configuration. Use .env only.
- Values are accessed on server via process.env and shared to client via window.ENV
