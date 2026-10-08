# OctoFit Tracker frontend

The React presentation tier uses Vite, React Router, and Bootstrap. When the API
is hosted in a Codespace, define `VITE_CODESPACE_NAME` with that Codespace's
name so the client can request
`https://<codespace-name>-8000.app.github.dev`. You can set it in
`octofit-tracker/frontend/.env.local`, or Vite automatically uses the
Codespaces `CODESPACE_NAME` value. If neither value is set, the API client
safely falls back to `http://localhost:8000`.

If the API is hosted in a Codespace and Vite is not running inside that same
Codespace, create `octofit-tracker/frontend/.env.local` with:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Restart Vite after changing environment values. To optionally use a custom API
origin, set `VITE_API_BASE_URL`; this takes precedence over the Codespaces and
localhost defaults.

From the repository root:

```bash
npm run dev --prefix octofit-tracker/frontend
npm run build --prefix octofit-tracker/frontend
npm run lint --prefix octofit-tracker/frontend
npm test --prefix octofit-tracker/frontend
npm test --prefix octofit-tracker/backend
```

Resource views accept plain array responses as well as paginated responses with
an array in `results`, `data`, or `items`. The frontend tests cover response
normalization and rendered API resource states. Backend integration tests require
MongoDB on `localhost:27017` and use a temporary `octofit_test_<process-id>`
database that is removed when the tests finish.
