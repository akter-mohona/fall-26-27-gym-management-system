/*
   member.js  -  Everything a Member can do (member.html)
   Made by: Tanvir Hossain Bhuiyan
   CRUD + Search : Fitness progress log (progressLogs array)
   Unique 1      : BMI Calculator
   Unique 2      : Membership status card + bKash/Nagad fee payment
   Unique 3      : Fitness Goal Tracker (progress bar + mini-goals)
   Also          : Summary cards + My Diet, Workouts & Visits (read only:
   what the Nutritionist and the Trainer made for this member)
   The progress log is the centre: its latest weight is used by the
   summary, the BMI Calculator and the Goal Tracker.
*/

const sections = ["progressSection", "bmiSection", "membershipSection", "goalSection", "myPlanSection"];

const logFields = ["logDate", "logWeight", "logFat", "logWorkout"];
const payFields = ["payPlan", "payMethod", "payTrx", "payAmount"];

// The member who is logged in (later this comes from the PHP session)
const currentUserId = "U-004";
const currentMemberId = "M-001";

let editLogIndex = -1;
let editPayIndex = -1;


/* Progress log: create, read, update, delete, search */

// READ + SEARCH (the loop runs backwards so the newest entry is on top)
function renderLogs() {
  let keyword = document.getElementById("logSearch").value;
  let workoutFilter = document.getElementById("logWorkoutFilter").value;

  let rows = "";
  let shown = 0;
  let mine = 0;

  for (let i = progressLogs.length - 1; i >= 0; i--) {
    let log = progressLogs[i];
    let isMine = (log.userId === currentUserId);   // a member sees only their own entries
    if (isMine) {
      mine++;
    }

    let matchesKeyword = containsText(log.date, keyword) || containsText(log.workout, keyword) ||
                         containsText(log.notes, keyword);
    let matchesWorkout = (workoutFilter === "All" || log.workout === workoutFilter);

    if (isMine && matchesKeyword && matchesWorkout) {
      let fat = "-";
      if (log.bodyFat > 0) {
        fat = log.bodyFat + "%";
      }
      rows += "<tr>" +
                "<td>" + log.date + "</td>" +
                "<td><strong>" + log.weight + " kg</strong></td>" +
                "<td>" + fat + "</td>" +
                "<td>" + log.workout + "</td>" +
                "<td>" + log.notes + "</td>" +
                "<td>" +
                  "<button type='button' class='btn btn-small' onclick='editLog(" + i + ")'>Edit</button>" +
                  "<button type='button' class='btn btn-small btn-danger' onclick='deleteLog(" + i + ")'>Delete</button>" +
                "</td>" +
              "</tr>";
      shown++;
    }
  }

  if (shown === 0) {
    rows = "<tr><td colspan='6' class='empty-row'>No entries match your search.</td></tr>";
  }

  document.getElementById("logTableBody").innerHTML = rows;
  document.getElementById("logCount").innerHTML = "Showing " + shown + " of your " + mine + " entries";
}

// CREATE or UPDATE
function saveLog() {
  let date = document.getElementById("logDate").value;
  let weightText = document.getElementById("logWeight").value;
  let fatText = document.getElementById("logFat").value;
  let workout = document.getElementById("logWorkout").value;
  let notes = document.getElementById("logNotes").value.trim();

  let isValid = true;
  clearErrors(logFields);
  hideMessage("logMessage");

  if (date === "") {
    showError("logDate", "Please choose a date.");
    isValid = false;
  } else if (daysBetween(todayString(), date) > 0) {
    showError("logDate", "The date cannot be in the future.");
    isValid = false;
  }

  if (weightText === "" || Number(weightText) < 25 || Number(weightText) > 250) {
    showError("logWeight", "Weight must be 25 to 250 kg.");
    isValid = false;
  }

  // body fat is optional, but if it is filled it must be 3 to 60
  if (fatText !== "" && (Number(fatText) < 3 || Number(fatText) > 60)) {
    showError("logFat", "Body fat must be 3 to 60%.");
    isValid = false;
  }

  if (workout === "") {
    showError("logWorkout", "Please choose a workout.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  let bodyFat = 0;
  if (fatText !== "") {
    bodyFat = Number(fatText);
  }

  if (editLogIndex === -1) {
    progressLogs.push({
      id: nextId("L", progressLogs), userId: currentUserId, date: date,
      weight: Number(weightText), bodyFat: bodyFat, workout: workout, notes: notes
    });
    showMessage("logMessage", "Entry for " + date + " saved.", "success");
  } else {
    let log = progressLogs[editLogIndex];
    log.date = date;
    log.weight = Number(weightText);
    log.bodyFat = bodyFat;
    log.workout = workout;
    log.notes = notes;
    showMessage("logMessage", "Entry for " + date + " updated.", "success");
  }

  resetLogForm();
  document.getElementById("logForm").reset();
  renderLogs();
  refreshFromLog();
  return false;
}

function editLog(index) {
  let log = progressLogs[index];
  editLogIndex = index;

  document.getElementById("logDate").value = log.date;
  document.getElementById("logWeight").value = log.weight;
  if (log.bodyFat > 0) {
    document.getElementById("logFat").value = log.bodyFat;
  } else {
    document.getElementById("logFat").value = "";
  }
  document.getElementById("logWorkout").value = log.workout;
  document.getElementById("logNotes").value = log.notes;

  document.getElementById("logFormTitle").innerHTML = "Edit Entry (" + log.date + ")";
  document.getElementById("logSaveButton").value = "Update Entry";
  clearErrors(logFields);
}

function deleteLog(index) {
  let log = progressLogs[index];
  progressLogs = removeAt(progressLogs, index);
  showMessage("logMessage", "Entry for " + log.date + " deleted.", "info");
  resetLogForm();
  document.getElementById("logForm").reset();
  renderLogs();
  refreshFromLog();
}

// a new latest weight changes the BMI, the goal and the summary
function refreshFromLog() {
  document.getElementById("bmiWeight").value = latestWeight();
  document.getElementById("bmiResult").style.display = "none";
  drawGoalBar();
  renderSummary();
}

function resetLogForm() {
  editLogIndex = -1;
  clearErrors(logFields);
  document.getElementById("logFormTitle").innerHTML = "New Entry";
  document.getElementById("logSaveButton").value = "Save Entry";
}

// the newest weight in my log (or the weight from sign-up)
function latestWeight() {
  let weight = findMember(currentMemberId).weight;
  let latestDate = "";
  for (const log of progressLogs) {
    if (log.userId === currentUserId && log.date > latestDate) {
      latestDate = log.date;
      weight = log.weight;
    }
  }
  return weight;
}


/* Unique feature 1: BMI calculator */

// BMI with one decimal place
function bmiOf(weight, heightCm) {
  let heightM = heightCm / 100;
  return Math.round(weight / (heightM * heightM) * 10) / 10;
}

// [category, colour, advice] for a BMI value
function bmiInfo(bmi) {
  if (bmi < 18.5) {
    return ["Underweight", "#2563eb", "Eat more protein and do strength training to gain healthy weight."];
  } else if (bmi < 25) {
    return ["Normal", "#16a34a", "Great! Keep your routine to stay in this range."];
  } else if (bmi < 30) {
    return ["Overweight", "#f59e0b", "Add more cardio and follow the diet plan from your nutritionist."];
  }
  return ["Obese", "#dc2626", "Start with walking and light cardio, and follow your trainer's and nutritionist's plans."];
}
function calculateBMI() {
  let heightCm = Number(document.getElementById("bmiHeight").value);
  let weight = Number(document.getElementById("bmiWeight").value);

  let isValid = true;
  clearErrors(["bmiHeight", "bmiWeight"]);

  if (heightCm < 100 || heightCm > 230) {
    showError("bmiHeight", "Height must be 100 to 230 cm.");
    isValid = false;
  }
  if (weight < 25 || weight > 250) {
    showError("bmiWeight", "Weight must be 25 to 250 kg.");
    isValid = false;
  }
  if (isValid === false) {
    document.getElementById("bmiResult").style.display = "none";
    return false;
  }

  let bmi = bmiOf(weight, heightCm);
  let info = bmiInfo(bmi);
  let category = info[0];
  let colour = info[1];
  let advice = info[2];

  document.getElementById("bmiNumber").innerHTML = bmi;
  document.getElementById("bmiNumber").style.color = colour;
  let badge = document.getElementById("bmiCategory");
  badge.innerHTML = category;
  badge.style.backgroundColor = colour;
  document.getElementById("bmiAdvice").innerHTML = advice;
  document.getElementById("bmiResult").style.display = "block";
  return false;
}


/* Unique feature 2: membership status + fee payment */

// the status card: green = more than 30 days, orange = 30 or less, red = expired
function renderStatusCard() {
  let sub = findSubscription(currentMemberId);
  let card = document.getElementById("statusCard");

  if (sub === null) {
    document.getElementById("daysLeft").innerHTML = "No plan";
    document.getElementById("statusText").innerHTML = "Choose a plan and pay to start.";
    return;
  }

  let plan = findPlan(sub.planId);
  let days = daysBetween(todayString(), sub.endDate);

  if (days < 0) {
    card.style.backgroundColor = "#dc2626";
    document.getElementById("daysLeft").innerHTML = "Expired";
    document.getElementById("statusText").innerHTML = plan.name + " ended on " + sub.endDate + ". Please renew.";
  } else if (days <= 30) {
    card.style.backgroundColor = "#f59e0b";
    document.getElementById("daysLeft").innerHTML = days + " days left";
    document.getElementById("statusText").innerHTML = plan.name + " ends on " + sub.endDate + ". Renew soon!";
  } else {
    card.style.backgroundColor = "#16a34a";
    document.getElementById("daysLeft").innerHTML = days + " days left";
    document.getElementById("statusText").innerHTML = plan.name + " is active until " + sub.endDate + ".";
  }
}

// plan drop-down built from the plans array
function fillPayPlans() {
  let select = document.getElementById("payPlan");
  let first = document.createElement("option");
  first.value = "";
  first.innerHTML = "-- Select plan --";
  select.appendChild(first);

  for (const plan of plans) {
    if (plan.status === "Active") {
      let option = document.createElement("option");
      option.value = plan.id;
      option.innerHTML = plan.name + " (" + plan.price + " BDT)";
      select.appendChild(option);
    }
  }
}

function showPlanPrice() {
  let plan = findPlan(document.getElementById("payPlan").value);
  if (plan === null) {
    document.getElementById("planPriceHint").innerHTML = "";
  } else {
    document.getElementById("planPriceHint").innerHTML = "Price of this plan: " + plan.price + " BDT";
  }
}

// READ: my payments
function renderPayments() {
  let rows = "";
  for (let i = payments.length - 1; i >= 0; i--) {
    let pay = payments[i];
    if (pay.memberId === currentMemberId) {

      let badge, actions;
      if (pay.status === "Pending") {
        badge = "<span class='badge orange'>Pending</span>";
        actions = "<button type='button' class='btn btn-small' onclick='editPayment(" + i + ")'>Edit</button>" +
                  "<button type='button' class='btn btn-small btn-danger' onclick='cancelPayment(" + i + ")'>Cancel</button>";
      } else if (pay.status === "Verified") {
        badge = "<span class='badge green'>Verified</span>";
        actions = "<span class='hint'>Locked</span>";
      } else {
        badge = "<span class='badge red'>Rejected</span>";
        actions = "<span class='hint'>Pay again</span>";
      }

      let plan = findPlan(pay.planId);
      rows += "<tr><td>" + pay.id + "</td><td>" + plan.name + "</td><td>" + pay.amount + " BDT</td><td>" +
              pay.method + "</td><td>" + pay.trxId + "</td><td>" + pay.date + "</td><td>" + badge +
              "</td><td>" + actions + "</td></tr>";
    }
  }
  if (rows === "") {
    rows = "<tr><td colspan='8' class='empty-row'>You have not paid yet.</td></tr>";
  }
  document.getElementById("payTableBody").innerHTML = rows;
}

// CREATE or UPDATE a payment
function submitPayment() {
  let planId = document.getElementById("payPlan").value;
  let method = getRadioValue("payMethod");
  let trxId = document.getElementById("payTrx").value.trim().toUpperCase();
  let amountText = document.getElementById("payAmount").value;

  let isValid = true;
  clearErrors(payFields);
  hideMessage("payMessage");

  let plan = findPlan(planId);
  if (plan === null) {
    showError("payPlan", "Please choose a plan.");
    isValid = false;
  }

  if (method === "") {
    showError("payMethod", "Please choose bKash or Nagad.");
    isValid = false;
  }

  if (trxId.length !== 10 || isLettersAndDigits(trxId) === false) {
    showError("payTrx", "Transaction ID must be exactly 10 letters or digits.");
    isValid = false;
  } else {
    // the same transaction ID cannot be used twice
    for (let i = 0; i < payments.length; i++) {
      if (i !== editPayIndex && payments[i].trxId === trxId) {
        showError("payTrx", "This transaction ID was already submitted.");
        isValid = false;
      }
    }
  }

  if (amountText === "") {
    showError("payAmount", "Please enter the amount.");
    isValid = false;
  } else if (plan !== null && Number(amountText) !== plan.price) {
    showError("payAmount", "Amount must be exactly " + plan.price + " BDT for this plan.");
    isValid = false;
  }

  if (isValid === false) {
    return false;
  }

  if (editPayIndex === -1) {
    let member = findMember(currentMemberId);
    payments.push({
      id: nextId("PAY", payments), memberId: currentMemberId, memberName: member.name,
      planId: planId, amount: plan.price, method: method, trxId: trxId,
      date: todayString(), status: "Pending"
    });
    showMessage("payMessage", "Payment submitted. The admin will verify " + trxId + " soon.", "success");
  } else {
    let pay = payments[editPayIndex];
    pay.planId = planId;
    pay.amount = plan.price;
    pay.method = method;
    pay.trxId = trxId;
    showMessage("payMessage", "Payment " + pay.id + " updated.", "success");
  }

  resetPayForm();
  document.getElementById("payForm").reset();
  renderPayments();
  return false;
}

function editPayment(index) {
  let pay = payments[index];
  editPayIndex = index;
  document.getElementById("payPlan").value = pay.planId;
  setRadioValue("payMethod", pay.method);
  document.getElementById("payTrx").value = pay.trxId;
  document.getElementById("payAmount").value = pay.amount;
  showPlanPrice();
  document.getElementById("payFormTitle").innerHTML = "Edit Payment " + pay.id;
  document.getElementById("paySaveButton").value = "Update Payment";
}

function cancelPayment(index) {
  let pay = payments[index];
  payments = removeAt(payments, index);
  showMessage("payMessage", "Payment " + pay.id + " cancelled.", "info");
  resetPayForm();
  document.getElementById("payForm").reset();
  renderPayments();
}

function resetPayForm() {
  editPayIndex = -1;
  clearErrors(payFields);
  document.getElementById("payFormTitle").innerHTML = "Pay Membership Fee";
  document.getElementById("paySaveButton").value = "Submit Payment";
  document.getElementById("planPriceHint").innerHTML = "";
}


/* Unique feature 3: fitness goal tracker */

// how much of the way from the first logged weight to the target is done (0 - 100)
function goalPercent() {
  let me = findMember(currentMemberId);
  let target = me.targetWeight;

  // the first entry in my log is the start weight
  let start = 0;
  let firstDate = "9999-12-31";
  for (const log of progressLogs) {
    if (log.userId === currentUserId && log.date < firstDate) {
      firstDate = log.date;
      start = log.weight;
    }
  }
  let current = latestWeight();
  if (start === 0) {
    start = current;
  }

  let percent = 100;
  if (start !== target) {
    percent = Math.round((start - current) / (start - target) * 100);
  }
  if (percent < 0) {
    percent = 0;
  }
  if (percent > 100) {
    percent = 100;
  }

  document.getElementById("goalText").innerHTML = "Start: " + start + " kg &middot; Now: " + current +
      " kg &middot; Target: " + target + " kg &middot; <strong>" + percent + "% done</strong>";
  return percent;
}

// "Update": save the new target weight on my account, then redraw
function updateGoalProgress() {
  let target = Number(document.getElementById("targetWeight").value);
  clearError("targetWeight");
  if (target < 25 || target > 250) {
    showError("targetWeight", "Target must be 25 to 250 kg.");
    return;
  }
  findMember(currentMemberId).targetWeight = target;
  drawGoalBar();
  renderSummary();
}

function drawGoalBar() {
  let percent = goalPercent();
  let bar = document.getElementById("goalBar");
  bar.style.width = percent + "%";
  if (percent === 100) {
    bar.style.backgroundColor = "#16a34a";
  } else {
    bar.style.backgroundColor = "#f97316";
  }
}

// mini-goals list: push() to add, pop() to remove the last one
function renderMiniGoals() {
  let miniGoals = findMember(currentMemberId).miniGoals;
  let list = document.getElementById("goalList");
  list.innerHTML = "";
  for (let i = 0; i < miniGoals.length; i++) {
    let item = document.createElement("li");
    item.innerHTML = (i + 1) + ". " + miniGoals[i];
    list.appendChild(item);
  }
  if (miniGoals.length === 0) {
    let empty = document.createElement("li");
    empty.className = "hint";
    empty.innerHTML = "No goals yet. Add one!";
    list.appendChild(empty);
  }
}

function addMiniGoal() {
  let text = document.getElementById("miniGoal").value.trim();
  clearError("miniGoal");
  if (text.length < 3) {
    showError("miniGoal", "Write at least 3 characters.");
    return;
  }
  let miniGoals = findMember(currentMemberId).miniGoals;
  if (miniGoals.length >= 7) {
    showError("miniGoal", "7 goals a week is enough!");
    return;
  }
  miniGoals.push(text);
  document.getElementById("miniGoal").value = "";
  renderMiniGoals();
}

function removeLastGoal() {
  findMember(currentMemberId).miniGoals.pop();
  renderMiniGoals();
}


/*
   SUMMARY CARDS (top of the Progress Log)
   one number from each part: log, BMI, membership, visits, goal
*/
function renderSummary() {
  let me = findMember(currentMemberId);
  let weight = latestWeight();

  document.getElementById("sumWeight").innerHTML = weight;

  let bmi = bmiOf(weight, me.height);
  let info = bmiInfo(bmi);
  document.getElementById("sumBmi").innerHTML = bmi;
  document.getElementById("sumBmi").style.color = info[1];
  document.getElementById("sumBmiLabel").innerHTML = "BMI (" + info[0] + ")";

  let sub = findSubscription(currentMemberId);
  let days = 0;
  if (sub !== null && daysBetween(todayString(), sub.endDate) > 0) {
    days = daysBetween(todayString(), sub.endDate);
  }
  document.getElementById("sumDays").innerHTML = days;

  let thisMonth = todayString().slice(0, 7);
  let visits = 0;
  for (const visit of attendance) {
    if (visit.memberId === currentMemberId && visit.date.slice(0, 7) === thisMonth) {
      visits++;
    }
  }
  document.getElementById("sumVisits").innerHTML = visits;

  document.getElementById("sumGoal").innerHTML = goalPercent() + "%";
}


/* My diet, workouts & visits (read only) */
function renderMyPlans() {
  // 1. my diet plan from the Nutritionist
  let myDiet = null;
  for (const plan of dietPlans) {
    if (plan.memberId === currentMemberId) {
      myDiet = plan;
    }
  }

  let info = document.getElementById("myDietInfo");
  let grid = document.getElementById("myMealGrid");
  grid.innerHTML = "";

  if (myDiet === null) {
    info.innerHTML = "<p class='hint'>Your nutritionist has not made a diet plan for you yet.</p>";
    document.getElementById("myMealTotal").innerHTML = "";
  } else {
    let restrictions = "None";
    if (myDiet.restrictions.length > 0) {
      restrictions = myDiet.restrictions.join(", ");
    }
    info.innerHTML = "<p><strong>Goal:</strong> " + myDiet.goal + " weight &middot; <strong>Daily calories:</strong> " +
                     myDiet.calories + " kcal &middot; <strong>Meals a day:</strong> " + myDiet.meals +
                     " &middot; <strong>Start:</strong> " + myDiet.startDate + "</p>" +
                     "<p><strong>Avoid:</strong> " + restrictions + "</p>" +
                     "<p><strong>Advice:</strong> " + (myDiet.notes === "" ? "-" : myDiet.notes) + "</p>";

    // one card per meal, built with createElement
    let mealNames = ["Breakfast", "Lunch", "Snack", "Dinner"];
    let total = 0;
    for (const mealName of mealNames) {
      let card = document.createElement("div");
      card.className = "meal-card";

      let title = document.createElement("h3");
      title.innerHTML = mealName;
      card.appendChild(title);

      let list = document.createElement("ul");
      let count = 0;
      for (const item of myDiet.mealPlan) {
        if (item.meal === mealName) {
          count++;
          let li = document.createElement("li");
          li.innerHTML = item.servings + " x " + item.name + " (" + item.calories + " kcal)";
          list.appendChild(li);
          total += item.calories;
        }
      }
      if (count === 0) {
        let li = document.createElement("li");
        li.className = "hint";
        li.innerHTML = "Nothing planned";
        list.appendChild(li);
      }
      card.appendChild(list);
      grid.appendChild(card);
    }

    let totalText = document.getElementById("myMealTotal");
    if (myDiet.mealPlan.length === 0) {
      totalText.innerHTML = "Your nutritionist has not added meals to your plan yet.";
      totalText.style.color = "";
    } else {
      totalText.innerHTML = "Planned meals: " + total + " of " + myDiet.calories + " kcal";
      totalText.style.color = "#16a34a";
    }
  }

  // 2. my workouts from the Trainer (today's ones are highlighted)
  let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let today = dayNames[new Date().getDay()];
  document.getElementById("todayText").innerHTML = "Today is " + today + ". Today's exercises are highlighted.";

  let rows = "";
  for (const w of workouts) {
    if (w.memberId === currentMemberId) {
      let rowClass = "";
      if (w.days.indexOf(today) !== -1) {
        rowClass = " class='row-green'";
      }
      rows += "<tr" + rowClass + "><td><strong>" + w.exercise + "</strong></td><td>" + w.sets + " x " + w.reps +
              "</td><td>" + w.days.join(", ") + "</td><td>" + w.notes + "</td></tr>";
    }
  }
  if (rows === "") {
    rows = "<tr><td colspan='4' class='empty-row'>Your trainer has not given you workouts yet.</td></tr>";
  }
  document.getElementById("myWorkoutBody").innerHTML = rows;

  // 3. my classes, booked by the Trainer
  let classRows = "";
  for (const item of classes) {
    if (item.members.indexOf(currentMemberId) !== -1) {
      classRows += "<li><span><strong>" + item.name + "</strong> &middot; " + item.day + " at " + item.time + "</span></li>";
    }
  }
  if (classRows === "") {
    classRows = "<li class='hint'>You are not booked into any class yet. Ask your trainer.</li>";
  }
  document.getElementById("myClassList").innerHTML = classRows;

  // 4. my visits, recorded by the Trainer's Attendance Desk (newest first)
  let thisMonth = todayString().slice(0, 7);
  let monthCount = 0;
  let visitRows = "";
  for (let i = attendance.length - 1; i >= 0; i--) {
    let visit = attendance[i];
    if (visit.memberId === currentMemberId) {
      if (visit.date.slice(0, 7) === thisMonth) {
        monthCount++;
      }
      let outTime = visit.checkOut;
      if (outTime === "") {
        outTime = "Still in the gym";
      }
      visitRows += "<tr><td>" + visit.date + "</td><td>" + visit.checkIn + "</td><td>" + outTime + "</td></tr>";
    }
  }
  if (visitRows === "") {
    visitRows = "<tr><td colspan='3' class='empty-row'>No visits yet.</td></tr>";
  }
  document.getElementById("myVisitBody").innerHTML = visitRows;
  document.getElementById("visitSummary").innerHTML = "Visits this month: <strong>" + monthCount +
                                                      "</strong> (target: 12, about 3 a week)";
}


// Run when the page loads
let me = findMember(currentMemberId);
document.getElementById("bmiHeight").value = me.height;
document.getElementById("bmiWeight").value = latestWeight();
document.getElementById("targetWeight").value = me.targetWeight;
renderLogs();
renderStatusCard();
fillPayPlans();
renderPayments();
drawGoalBar();
renderMiniGoals();
renderMyPlans();
renderSummary();
showSection("progressSection");
