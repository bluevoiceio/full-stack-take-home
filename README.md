# Full Stack take-home: shift swaps

Thanks for taking the time to do this. This repo has a small working app and a feature for you to build on top of it.

## The scenario

A department works around the clock in shifts. A supervisor builds the schedule and assigns officers to shifts. When an officer can't work one of their shifts, they ask a colleague to take it. The supervisor approves or denies the swap. When a swap is approved, the shift moves to the colleague.

## What's here

| Folder    | Built with           | Used by        | Starts with                                              |
| --------- | -------------------- | -------------- | -------------------------------------------------------- |
| `api/`    | FastAPI, Pydantic    | Both apps      | The department, six officers and two weeks of shifts     |
| `web/`    | React, Vite          | The supervisor | A table of every shift                                   |
| `mobile/` | React Native, Expo   | Officers       | Pick an officer, then see their shifts                   |

The API keeps its data in memory, so it resets when the server restarts. There's no login: picking an officer in the mobile app stands in for signing in.

## Running it

You'll need Python 3.11+ and Node 22.13+. For the mobile app, use an iOS simulator, an Android emulator, or the Expo Go app on your phone.

### API

With [uv](https://docs.astral.sh/uv/):

```sh
cd api
uv run fastapi dev app/main.py      # http://localhost:8000, docs at /docs
uv run --extra dev pytest
```

Or with pip:

```sh
cd api
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
fastapi dev app/main.py
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
npx expo start                      # then press i for iOS or a for Android
```

The iOS simulator reaches the API at `localhost` and the Android emulator at `10.0.2.2`. On a physical phone, start the API with `--host 0.0.0.0` and point the app at your computer's address on the local network:

```sh
EXPO_PUBLIC_API_URL=http://192.168.1.20:8000 npx expo start
```

## What to build

1. **Request a swap.** In the mobile app, an officer asks a colleague to take one of their shifts. They can't ask themselves, and a shift has at most one pending request at a time.
2. **Decide a swap.** In the web app, the supervisor sees pending requests and approves or denies each one. A request can only be decided once.
3. **Move the shift.** When a swap is approved, the shift belongs to the colleague, and both apps show it.

The API is the source of truth. Whatever rules you decide on are enforced there, not only in the UI.

The schedule has rules of its own. We won't spell them out, but keep these in mind:

- Nobody can be in two places at once.
- Some shifts need a certain rank.
- A schedule can change between a swap request and the supervisor's answer.

Decide what the rules are, enforce them, and tell us what you decided.

You can change anything in the starter: the data model, the endpoints, the libraries, the storage, the structure.

## Time

Plan on about 4 hours; we'd rather see a smaller thing done well.

## AI tools

Use whatever tools you normally work with, AI included. In the follow-up call you'll run the project, walk us through the code, make a small change live, and talk about how the design would grow. Be ready to explain every decision, whoever or whatever wrote the code.

## Your README

Replace this file with your own README. Cover:

- How to run each part from a fresh clone
- The decisions and trade-offs you made, and why
- What's unfinished, or what you'd do next
- Which AI tools you used and for what

## What we look at

- The decisions you made and why
- How the three parts fit together
- Whether the rules hold up in edge cases
- Details: edge cases, empty and error states, look and feel
- Code another engineer could pick up

## Submitting

1. Click **Use this template**, then **Create a new repository**. Make it **private**.
2. Commit as you go.
3. When you're done, add [@Ninkuk](https://github.com/Ninkuk) and [@Eralyne](https://github.com/Eralyne) as collaborators, and reply to your invitation email with the link.

Please send it back within 7 days of receiving it.

## Questions

Email [ninad@bluevoice.io](mailto:ninad@bluevoice.io) and [amy@bluevoice.io](mailto:amy@bluevoice.io).
