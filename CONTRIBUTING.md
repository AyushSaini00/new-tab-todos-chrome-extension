# Contributing to new-tab-todos-chrome-extension

Thanks for your interest in contributing! This guide explains how to set up your environment, and submit pull requests (PRs) in a way that’s easy to review and merge.

## Ways to contribute

- Report bugs and suggest features (open an issue)
- Improve documentation (README, this guide, comments)
- Tackle open issues (bugs, UI/UX refinements, performance)
- Add tests
- Refactor code or improve accessibility

---

## Getting started

- [Fork](https://github.com/AyushSaini00/new-tab-todos-chrome-extension/fork) the repository and clone your fork
- Install dependencies: `yarn install`
- Start the project locally: `yarn run dev`

## Load the extension in Chrome:

- `yarn build` to build the dist folder
- Open `chrome://extensions`
- Enable “Developer mode” (top-right)
- Click “Load unpacked” and select the build output i.e., `dist/`

---

## Submitting a pull request

1. Ensure your branch is up to date with `main`
2. Add screenshots/GIFs for UI changes (before/after preferred)
3. Open a PR:
   - Describe what changed and why
   - Link related issues (e.g., “Closes #5”)

Draft PRs are welcome for early feedback.
