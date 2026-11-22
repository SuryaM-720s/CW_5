/*
 * CW-05 · JS Form Validation
 * CSC 4370 · Web Programming
 *
 * What this file does:
 *   1. On "Add", checks every field and collects ALL problems into an array.
 *   2. Loops through that array and shows the problems, numbered, in one alert box.
 *   3. Writes red text above each bad field with innerHTML, and only for the
 *      fields that are actually wrong (correct fields stay clean).
 *   4. If everything is valid, builds the result below the form with DOM
 *      operations (createElement / textContent), replaces any older result,
 *      and clears the form.
 *
 * innerHTML vs. DOM operations:
 *   - Error messages are fixed strings written by this script, so innerHTML is
 *     safe and simple for them.
 *   - The result shows text the USER typed. Putting that into innerHTML would let
 *     someone type markup like <img src=x onerror=...> and run script (XSS).
 *     createElement + textContent always treats it as plain text.
 */
(function () {
  "use strict";

  // One entry per form field. Adding a field later only means adding a line here.
  var FIELDS = [
    {
      id: "userId",
      label: "ID",
      outputLabel: "UserID",
      // digits only, 1 to 10 of them
      pattern: /^\d{1,10}$/,
      hint: "numbers only, like 896647",
      formatMsg: "ID can only be numbers, like 896647."
    },
    {
      id: "firstName",
      label: "First Name",
      outputLabel: "First Name",
      // letters (any language), with single spaces, hyphens or apostrophes between parts:
      // "Robert", "Mary Ann", "Jean-Luc", "O'Neil", "José"
      pattern: /^\p{L}+(?:[ '\-]\p{L}+)*$/u,
      hint: "letters only, like Robert",
      formatMsg: "First Name can only use letters, spaces, hyphens and apostrophes."
    },
    {
      id: "lastName",
      label: "Last Name",
      outputLabel: "Last Name",
      pattern: /^\p{L}+(?:[ '\-]\p{L}+)*$/u,
      hint: "letters only, like Reed",
      formatMsg: "Last Name can only use letters, spaces, hyphens and apostrophes."
    }
  ];

  var form = document.getElementById("userForm");
  var result = document.getElementById("result");

  // ---------- helpers ----------

  function inputOf(field) {
    return document.getElementById(field.id);
  }

  function errorBoxOf(field) {
    return document.getElementById(field.id + "Err");
  }

  // Trim so a value of only spaces counts as missing.
  function valueOf(field) {
    return inputOf(field).value.trim();
  }

  // Returns "" when the field is fine, otherwise the problem in words.
  function checkField(field) {
    var value = valueOf(field);

    if (value.length === 0) {
      // says what is wrong AND how to fix it
      return field.label + " is missing. Enter " + field.hint + ".";
    }
    if (!field.pattern.test(value)) {
      return field.formatMsg;
    }
    return "";
  }

  // Red text above the field (innerHTML) + red border on the input (DOM class/attribute).
  function showError(field, message) {
    errorBoxOf(field).innerHTML = message;
    inputOf(field).classList.add("invalid");
    inputOf(field).setAttribute("aria-invalid", "true");
  }

  function clearError(field) {
    errorBoxOf(field).innerHTML = "";
    inputOf(field).classList.remove("invalid");
    inputOf(field).removeAttribute("aria-invalid");
  }

  // Same idea as the sample's reportErrors(): loop the array and number each problem.
  function reportErrors(errors) {
    var msg = "Please fix the following before adding:\n";
    for (var i = 0; i < errors.length; i++) {
      msg += "\n" + (i + 1) + ". " + errors[i];
    }
    alert(msg);
  }

  // Shows ONLY the latest entry: the old content is removed before the new one is built,
  // so pressing Add again replaces the result instead of stacking a new one under it.
  function showResult(values) {
    while (result.firstChild) {
      result.removeChild(result.firstChild);
    }

    var heading = document.createElement("h2");
    heading.textContent = "Entered";
    result.appendChild(heading);

    var list = document.createElement("dl");
    for (var i = 0; i < FIELDS.length; i++) {
      // each label/value pair sits in its own <div> so the CSS can lay them out in columns
      var item = document.createElement("div");
      item.className = "item";

      var term = document.createElement("dt");
      term.textContent = FIELDS[i].outputLabel;

      var detail = document.createElement("dd");
      detail.textContent = values[FIELDS[i].id]; // textContent: user text is never parsed as HTML

      item.appendChild(term);
      item.appendChild(detail);
      list.appendChild(item);
    }
    result.appendChild(list);

    result.hidden = false;
  }

  // ---------- main validation on "Add" ----------

  function handleAdd(event) {
    event.preventDefault(); // stay on this page; JavaScript shows the result

    var errors = [];
    var firstBad = null;
    var values = {};

    // Check every field, not just until the first error.
    for (var i = 0; i < FIELDS.length; i++) {
      var field = FIELDS[i];
      var problem = checkField(field);

      if (problem) {
        errors.push(problem);
        showError(field, problem);
        if (!firstBad) {
          firstBad = inputOf(field);
        }
      } else {
        clearError(field); // a field that is now correct loses its old warning
        values[field.id] = valueOf(field);
      }
    }

    if (errors.length > 0) {
      reportErrors(errors);
      firstBad.focus(); // after the alert closes, the cursor waits in the first bad field
      return;
    }

    showResult(values);
    form.reset();
    inputOf(FIELDS[0]).focus(); // ready for the next entry
  }

  // ---------- live feedback while typing ----------

  // A field only gets re-checked live once it has already been flagged, so the user
  // is not nagged while typing for the first time. As soon as it becomes valid the
  // red text disappears; if it is still wrong, the message updates.
  function handleInput(event) {
    var field = fieldFor(event.target);
    if (!field || !event.target.classList.contains("invalid")) {
      return;
    }
    var problem = checkField(field);
    if (problem) {
      showError(field, problem);
    } else {
      clearError(field);
    }
  }

  // Leaving a field with something typed in it checks the format right away.
  // An empty field is left alone until Add is pressed.
  function handleBlur(event) {
    var field = fieldFor(event.target);
    if (!field || valueOf(field) === "") {
      return;
    }
    var problem = checkField(field);
    if (problem) {
      showError(field, problem);
    } else {
      clearError(field);
    }
  }

  function fieldFor(element) {
    for (var i = 0; i < FIELDS.length; i++) {
      if (FIELDS[i].id === element.id) {
        return FIELDS[i];
      }
    }
    return null;
  }

  // ---------- wire up events (no inline onclick in the HTML) ----------

  form.addEventListener("submit", handleAdd); // Add button and the Enter key
  form.addEventListener("input", handleInput);
  form.addEventListener("focusout", handleBlur); // focusout bubbles up to the form; blur does not
})();
