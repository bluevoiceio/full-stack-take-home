# Full Stack take-home: scheduling

Thanks for taking the time to do this. This repo is a small, working slice of a product for police departments: an API, an admin panel and an officer app. Your job is to add scheduling to it.

## The scenario

A department works around the clock in shifts. A supervisor builds the schedule and assigns people to shifts. Officers check when they work. When an officer can't work a shift, they ask a colleague to take it, and a supervisor approves or denies the swap.

None of that exists here yet. What does exist is the department it happens in.

## What's here

| Folder    | Built with                            | Used by     | Already does                                                    |
| --------- | ------------------------------------- | ----------- | --------------------------------------------------------------- |
| `api/`    | FastAPI, SQLModel, SQLite             | Both apps   | Department, units, users, groups, notifications                 |
| `web/`    | React, Vite, Tailwind, TanStack Query | Supervisors | Home dashboard, users, groups with members, notifications       |
| `mobile/` | Expo, Expo Router, TanStack Query     | Officers    | Home, alerts with unread badge, settings, light and dark themes |

A few things to know before you read the code:

- **Users are not in the database.** They live in a separate identity provider, which `UserService` stands in for. Tables hold a bare `user_id`.
- **Sign-in is a stand-in.** Both apps let you pick an account, and the token is just the user's ID. Leave it that way.
- **Admins are the supervisors.** A user's role (`admin` or `officer`) decides what they may do. Their title (Sergeant, Corporal, …) is their rank.
- **Timestamps from the API are UTC with no offset.** Both apps already handle this for the data that exists.
- The database is a local SQLite file, seeded on first start. Delete `api/takehome.db` to reset it.

## Running it

You'll need Python 3.11+ and Node 22.13+. For the mobile app, use an iOS simulator, an Android emulator, the Expo Go app on your phone, or a browser.

### API

With [uv](https://docs.astral.sh/uv/):

```sh
cd api
uv run fastapi dev src/main.py      # http://localhost:8000, docs at /docs
uv run --extra dev pytest
```

Or with pip:

```sh
cd api
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
fastapi dev src/main.py
pytest
```

### Web

```sh
cd web
npm install
npm run dev                         # http://localhost:5173
```

The app calls `http://localhost:8000` by default. Set `VITE_API_URL` to change it.

### Mobile

```sh
cd mobile
npm install
npx expo start                      # then press i for iOS, a for Android or w for web
```

The iOS simulator reaches the API at `localhost` and the Android emulator at `10.0.2.2`. On a physical phone, start the API with `--host 0.0.0.0` and point the app at your computer's address on the local network:

```sh
EXPO_PUBLIC_API_URL=http://192.168.1.20:8000 npx expo start
```

## What to build

Add scheduling to this product, so the scenario above works for the supervisor in the admin panel and for the officer in the app.

How a schedule is modelled, how it's shown, and how far it goes are yours to decide. Build it the way you'd want it built if you were going to own it.

Real schedules have rules. Work out which ones matter for this department, enforce them, and tell us what you chose.

## Ground rules

- **The API is the source of truth.** Rules are enforced there, not only in the UI.
- **Build on what's here.** Scheduling should read as part of this product: same layering in the API, same patterns and look in the apps. If you think a pattern is wrong for the job, change it and tell us why.
- **Leave sign-in alone.** It is deliberately fake, and we're not grading it.
- **Keep the checks green.** `pytest`, `npm run typecheck` in `web/` and `mobile/`, and `npm run lint` in `web/`.
- Everything else is open: the data model, endpoints, libraries, storage.

## Time

Plan on about 4 to 6 hours. We'd rather see a smaller thing done well than a larger thing half-working, and we'd rather read about what you chose to leave out than find it missing.

## AI tools

Use whatever tools you normally work with, AI included. We'd like to see how you work with them, so please send us your session transcripts with your submission. In Claude Code, `/export` writes one. For other tools, use their export or copy the conversation into a file. They don't need to be tidy, and you can remove anything private.

In the follow-up call you'll run the project, walk us through the code, make a small change live, and talk about how the design would grow. Be ready to explain every decision, whoever or whatever wrote the code.

## Your README

Replace this file with your own README. Cover:

- How to run each part from a fresh clone
- The decisions and trade-offs you made, and why
- The scheduling rules you chose to enforce
- What's unfinished, or what you'd do next
- Which AI tools you used and for what

## What we look at

- The decisions you made and why
- How your work fits into what was already here
- Whether the rules hold up in edge cases
- Details: empty and error states, look and feel
- Code another engineer could pick up

## Submitting

1. Click **Use this template**, then **Create a new repository**. Make it **private**.
2. Commit as you go.
3. When you're done, add [@Ninkuk](https://github.com/Ninkuk) and [@Eralyne](https://github.com/Eralyne) as collaborators, and reply to your invitation email with the repo link, a short video walking us through your app, and your AI session transcripts.

Please send it back within 24 hours of receiving it.

## Questions

Email [ninad@bluevoice.io](mailto:ninad@bluevoice.io) and [amy@bluevoice.io](mailto:amy@bluevoice.io). You can also make a judgment call and note it in your README.
