# CW_5 — JS Form Validation

CSC 4370 · Web Programming · CW-05

A small "Add a user" form (ID, First Name, Last Name) validated with plain JavaScript.

| File | What it holds |
| --- | --- |
| `index.html` | The form and the empty result area |
| `script.js` | All validation and display logic (no inline handlers) |
| `style.css` | Layout, red error state, success panel |

## How it meets the requirements

1. **Form**: ID, First Name, Last Name text fields and an **Add** button.
2. **Alert box**: every problem is pushed into an array, then a loop numbers them into one alert.
3. **Red text**: written above each bad field with `innerHTML`; the input also gets a red border.
4. **Smart warnings**: each field is checked on its own, so only wrong fields are flagged, and a field that is fixed loses its old warning.
5. **Success**: values are shown below the form and the form is cleared.
6. **Last entry only**: the result area is emptied before each new entry is built, so repeated Adds replace it.

## Extras

- Whitespace-only input counts as missing.
- ID must be digits; names allow letters, spaces, hyphens and apostrophes.
- Errors update live while typing once a field has been flagged, and format is checked when leaving a field.
- After a failed Add, focus moves to the first bad field.
- The result is built with `createElement` + `textContent`, so typed text is never run as HTML (no XSS). Error messages use `innerHTML` because they are fixed strings from the script.
- `aria-invalid`, `aria-describedby` and `aria-live` so screen readers announce errors.
- Each error message says how to fix it ("ID is missing. Enter numbers only, like 896647.").
- Skip link and visible keyboard focus.

## Design

Styled like a printed paper form: off-white paper, black ink, one serif typeface (no web fonts),
numbered fields drawn as lines to write on, and a plain black Add button. Red is used only for
errors. The saved entry appears under a dashed line like a tear-off stub. On phones the line
drops under its label and the button is full width.
