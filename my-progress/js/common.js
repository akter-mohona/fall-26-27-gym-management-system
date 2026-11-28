/*
   common.js  -  Helper functions shared by every page
   Shared base used by every page (Group 04)
   Loaded after data.js and before each page's own script:
   <script src="js/data.js"></script>
   <script src="js/common.js"></script>
   <script src="js/admin.js"></script>
*/


/*
   1. SHOW ONE SECTION AT A TIME (dashboards)
   Each dashboard script declares an array called "sections" with the ids
   of its sections. A sidebar button calls showSection("id").
*/
function showSection(sectionId) {
  for (let i = 0; i < sections.length; i++) {
    let section = document.getElementById(sections[i]);
    let navButton = document.getElementById("nav-" + sections[i]);

    if (sections[i] === sectionId) {
      section.style.display = "block";
      navButton.className = "active";
    } else {
      section.style.display = "none";
      navButton.className = "";
    }
  }
}


/*
   2. SHOWING AND CLEARING ERRORS
   Every field has <span class="error" id="fieldIdError"></span> next to it.
   We write the message with innerHTML and make the border red.
*/
function showError(fieldId, message) {
  document.getElementById(fieldId + "Error").innerHTML = message;

  // radio and checkbox groups have no single element with this id
  let field = document.getElementById(fieldId);
  if (field != null) {
    field.style.border = "2px solid #dc2626";
  }
}

function clearError(fieldId) {
  document.getElementById(fieldId + "Error").innerHTML = "";

  let field = document.getElementById(fieldId);
  if (field != null) {
    field.style.border = "";      // "" gives the border back to the CSS file
  }
}

// clears the errors of many fields; fieldIds is an array of ids
function clearErrors(fieldIds) {
  for (let i = 0; i < fieldIds.length; i++) {
    clearError(fieldIds[i]);
  }
}


/* 3. Message boxes (type is "success", "error" or "info") */
function showMessage(boxId, text, type) {
  let box = document.getElementById(boxId);
  box.innerHTML = text;
  box.className = "message " + type;
  box.style.display = "block";
}

function hideMessage(boxId) {
  document.getElementById(boxId).style.display = "none";
}


/* 4. Small validation helpers (each returns true or false) */
function isEmpty(value) {
  return value.trim() === "";
}

// something@something.something
function isValidEmail(email) {
  let atPosition = email.indexOf("@");
  let dotPosition = email.indexOf(".", atPosition);

  if (atPosition < 1) {
    return false;
  }
  if (dotPosition < atPosition + 2) {
    return false;
  }
  if (dotPosition === email.length - 1) {
    return false;
  }
  return true;
}

// true when every character is a digit 0-9
function isDigitsOnly(text) {
  if (text.length === 0) {
    return false;
  }
  let digits = "0123456789";
  for (let i = 0; i < text.length; i++) {
    if (digits.indexOf(text[i]) === -1) {
      return false;
    }
  }
  return true;
}

// true when every character is a letter A-Z or a digit (used for trx IDs)
function isLettersAndDigits(text) {
  let allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < text.length; i++) {
    if (allowed.indexOf(text[i].toUpperCase()) === -1) {
      return false;
    }
  }
  return text.length > 0;
}

// Bangladeshi mobile number: 11 digits starting with 01
function isValidPhone(phone) {
  return isDigitsOnly(phone) && phone.length === 11 && phone.slice(0, 2) === "01";
}

// value of the ticked radio button in a group, or "" if none
function getRadioValue(groupName) {
  let radios = document.getElementsByName(groupName);
  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return "";
}

// ticks the radio button whose value matches (used when editing)
function setRadioValue(groupName, value) {
  let radios = document.getElementsByName(groupName);
  for (let i = 0; i < radios.length; i++) {
    radios[i].checked = (radios[i].value === value);
  }
}

// array with the values of all ticked checkboxes in a group
function getCheckedValues(groupName) {
  let boxes = document.getElementsByName(groupName);
  let values = [];
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      values.push(boxes[i].value);
    }
  }
  return values;
}

// ticks the checkboxes whose values are in the array (used when editing)
function setCheckedValues(groupName, values) {
  let boxes = document.getElementsByName(groupName);
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].checked = (values.indexOf(boxes[i].value) !== -1);
  }
}


/* 5. Search helper: true when text contains keyword (any case) */
function containsText(text, keyword) {
  return String(text).toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
}


/* 6. Array helpers */

// position of the object whose id matches, or -1
function findIndexById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return i;
    }
  }
  return -1;
}

// a NEW array without the element at "index" (slice + concat)
function removeAt(list, index) {
  return list.slice(0, index).concat(list.slice(index + 1));
}

// next id, e.g. nextId("W", workouts) gives "W-005"
function nextId(prefix, list) {
  let biggest = 0;
  let digits = 3;
  for (let i = 0; i < list.length; i++) {
    let numberText = list[i].id.slice(prefix.length + 1);
    digits = numberText.length;
    if (Number(numberText) > biggest) {
      biggest = Number(numberText);
    }
  }
  let newNumber = String(biggest + 1);
  while (newNumber.length < digits) {
    newNumber = "0" + newNumber;
  }
  return prefix + "-" + newNumber;
}

// the plan object with this id, or null
function findPlan(planId) {
  for (const plan of plans) {
    if (plan.id === planId) {
      return plan;
    }
  }
  return null;
}

// the user object of a member (by member id "M-001"), or null
function findMember(memberId) {
  for (const user of users) {
    if (user.role === "Member" && user.memberId === memberId) {
      return user;
    }
  }
  return null;
}

// the subscription of a member, or null
function findSubscription(memberId) {
  for (const sub of subscriptions) {
    if (sub.memberId === memberId) {
      return sub;
    }
  }
  return null;
}

// Builds the <option>s of a member drop-down with createElement + appendChild.
// Only Active members are listed. Used by Trainer and Nutritionist forms.
function fillMemberSelect(selectId) {
  let select = document.getElementById(selectId);
  select.innerHTML = "";

  let first = document.createElement("option");
  first.value = "";
  first.innerHTML = "-- Select member --";
  select.appendChild(first);

  for (const user of users) {
    if (user.role === "Member" && user.status === "Active") {
      let option = document.createElement("option");
      option.value = user.memberId;
      option.innerHTML = user.memberId + " - " + user.name;
      select.appendChild(option);
    }
  }
}


// One line about a member, built from the SHARED arrays of every role:
// goal and height (sign-up), latest weight (Member's log), membership (Admin),
// diet plan (Nutritionist) and workouts (Trainer). Used by Trainer and Nutritionist.
function memberSummary(memberId) {
  let member = findMember(memberId);
  if (member === null) {
    return "";
  }

  // latest weight from the member's own progress log
  let weight = member.weight;
  let latestDate = "";
  for (const log of progressLogs) {
    if (log.userId === member.id && log.date > latestDate) {
      latestDate = log.date;
      weight = log.weight;
    }
  }

  // membership set by the admin
  let membership = "<span class='badge red'>No active membership</span>";
  let sub = findSubscription(memberId);
  if (sub !== null && daysBetween(todayString(), sub.endDate) >= 0) {
    membership = "<span class='badge green'>Active until " + sub.endDate + "</span>";
  } else if (sub !== null) {
    membership = "<span class='badge red'>Expired on " + sub.endDate + "</span>";
  }

  // diet plan from the nutritionist and workouts from the trainer
  let diet = "none";
  for (const plan of dietPlans) {
    if (plan.memberId === memberId) {
      diet = plan.goal + ", " + plan.calories + " kcal";
    }
  }
  let workoutCount = 0;
  for (const w of workouts) {
    if (w.memberId === memberId) {
      workoutCount++;
    }
  }

  return "<strong>" + member.name + "</strong> &middot; Goal: " + member.goal + " &middot; " + member.height +
         " cm, " + weight + " kg &middot; " + membership + "<br>Diet plan: " + diet +
         " &middot; Workouts: " + workoutCount;
}


/* 7. Date helpers (dates are text "YYYY-MM-DD", like <input type="date">) */
function twoDigits(number) {
  if (number < 10) {
    return "0" + number;
  }
  return String(number);
}

// today as "YYYY-MM-DD"
function todayString() {
  let now = new Date();
  return now.getFullYear() + "-" + twoDigits(now.getMonth() + 1) + "-" + twoDigits(now.getDate());
}

// the time now as "HH:MM"
function timeNowString() {
  let now = new Date();
  return twoDigits(now.getHours()) + ":" + twoDigits(now.getMinutes());
}

// adds days to a date text, e.g. addDays("2026-11-02", 30) gives "2026-12-02"
function addDays(dateText, days) {
  let date = new Date(dateText + "T00:00");   // T00:00 = midnight, local time
  date.setDate(date.getDate() + days);
  return date.getFullYear() + "-" + twoDigits(date.getMonth() + 1) + "-" + twoDigits(date.getDate());
}

// number of days from firstDate to secondDate (negative if secondDate is earlier)
function daysBetween(firstDate, secondDate) {
  let oneDay = 1000 * 60 * 60 * 24;
  let difference = new Date(secondDate + "T00:00") - new Date(firstDate + "T00:00");
  return Math.round(difference / oneDay);
}
