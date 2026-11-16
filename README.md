# Wobble Play

A web app of short play activities that help children aged 3 to 12 practise focus, patience, impulse control, coping with frustration, switching between tasks, and calming down.

## What is in it

- **Onboarding quiz** that builds a four-week plan from a parent's answers
- **Today**: a daily plan sized to 5, 10 or 15 minutes, with swappable activities
- **Activities**: 56 parent-and-child games with steps, materials, and easier/harder versions
- **Games**: 7 on-screen games for the child (memory pairs, go/no-go, sequence memory, odd one out, waiting, breathing, freeze)
- **Progress**: streak, minutes, practice by skill, best scores

## Running it

It is a static site with no build step. Serve the folder with any static server, for example:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Files

- `index.html`: page shell and styles
- `data.js`: activity library, on-screen game list, and the daily-plan logic
- `app.js`: quiz, views, on-screen games, progress

## Not built yet

- Accounts and sync: progress is stored in the browser's localStorage only
- Payments
- Expert review: the activities are common, well-known play formats written for this app, and have not been reviewed by a child-development specialist. Wobble is play, not therapy or a diagnosis.
