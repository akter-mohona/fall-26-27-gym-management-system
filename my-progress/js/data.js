/*
   data.js  -  Sample data for the whole Gym Management System
   Shared base used by every page (Group 04)
   Every list is an ARRAY OF OBJECTS. Each object keeps related values
   together as  name: value  pairs.
   FRONTEND ONLY: this data lives in the browser's memory. When a page
   reloads, or you open another page, it starts again from these values.
   Later the PHP + MySQL backend will give us this data from the database.
   That is why some records are prepared here in advance, for example
   "Pending" payments, so the Admin has something to verify.
*/


// Users (used by Login, Register, Admin and the dashboards)
// status: "Active"  = can log in
//         "Pending" = signed up, waiting for the Admin to approve (Trainer, Nutritionist)
//         "Blocked" = stopped by the Admin
// Each role also has a few extra properties that only that role needs.
let users = [
  { id: "U-001", name: "Mirza Mohammad Rakib",     username: "admin",        password: "admin1234",  email: "rakib@fithub.com",   phone: "01711000001", role: "Admin",        status: "Active" },

  { id: "U-002", name: "Khondoker Md Asif Jubayer",  username: "trainer",      password: "trainer123", email: "asif@fithub.com",  phone: "01711000002", role: "Trainer",      status: "Active",
    employeeId: "TR-1001", specialization: "Strength", experience: 6, certification: "ACE Certified", shift: "Morning" },
  { id: "U-003", name: "Mohona Akter",    username: "nutritionist", password: "nutri1234",  email: "mohona@fithub.com",  phone: "01711000003", role: "Nutritionist", status: "Active",
    certificateNo: "NUT-1001", specialization: "Weight loss", experience: 4, days: ["Sun", "Tue", "Thu"] },

  { id: "U-004", name: "Tanvir Hossain Bhuiyan",     username: "member",       password: "member123",  email: "tanvir@mail.com",     phone: "01811000004", role: "Member",       status: "Active",
    gender: "Male", memberId: "M-001", dob: "2001-05-14", height: 172, weight: 82, goal: "Lose weight", planId: "P-02",
    targetWeight: 75, miniGoals: ["Come to the gym 3 times", "Sleep 7 hours"] },
  { id: "U-005", name: "Sumaiya Islam",   username: "sumaiya",      password: "sumaiya123", email: "sumaiya@mail.com",   phone: "01811000005", role: "Member",       status: "Active",
    gender: "Female", memberId: "M-002", dob: "1998-11-02", height: 158, weight: 60, goal: "Stay fit",    planId: "P-01" },
  { id: "U-006", name: "Tamim Rahman",    username: "tamim",        password: "tamim1234",  email: "tamim@mail.com",     phone: "01911000006", role: "Member",       status: "Active",
    gender: "Male", memberId: "M-003", dob: "2003-02-20", height: 178, weight: 65, goal: "Gain muscle", planId: "P-04" },
  { id: "U-007", name: "Farzana Akter",   username: "farzana",      password: "farzana123", email: "farzana@mail.com",   phone: "01911000007", role: "Member",       status: "Active",
    gender: "Female", memberId: "M-004", dob: "1995-08-09", height: 162, weight: 70, goal: "Lose weight", planId: "P-03" },
  { id: "U-008", name: "Arif Chowdhury",  username: "arif",         password: "arif12345",  email: "arif@mail.com",      phone: "01611000008", role: "Member",       status: "Blocked",
    gender: "Male", memberId: "M-005", dob: "1990-01-30", height: 175, weight: 90, goal: "Lose weight", planId: "P-01" },

  { id: "U-009", name: "Rafi Uddin",      username: "rafi",         password: "rafi12345",  email: "rafi@mail.com",      phone: "01611000009", role: "Trainer",      status: "Pending",
    employeeId: "TR-1002", specialization: "Cardio", experience: 2, certification: "NASM", shift: "Evening" },
  { id: "U-010", name: "Nabila Sultana",  username: "nabila",       password: "nabila123",  email: "nabila@mail.com",    phone: "01511000010", role: "Nutritionist", status: "Pending",
    certificateNo: "NUT-1002", specialization: "Sports", experience: 1, days: ["Sat", "Mon"] }
];


// Membership plans (CRUD by Admin, shown on the Home page)
let plans = [
  { id: "P-01", name: "Basic Monthly",      price: 1500, months: 1, facilities: ["Gym floor", "Locker"],                         status: "Active" },
  { id: "P-02", name: "Standard Quarterly", price: 4000, months: 3, facilities: ["Gym floor", "Cardio zone", "Locker"],          status: "Active" },
  { id: "P-03", name: "Premium Half-Year",  price: 7500, months: 6, facilities: ["Gym floor", "Cardio zone", "Classes", "Sauna"], status: "Active" },
  { id: "P-04", name: "Student Monthly",    price: 1000, months: 1, facilities: ["Gym floor"],                                   status: "Active" }
];


// Subscriptions: which member has which plan, and until when
// M-002 has EXPIRED (the Trainer's Attendance Desk will refuse check-in).
let subscriptions = [
  { id: "S-001", memberId: "M-001", planId: "P-02", startDate: "2026-10-01", endDate: "2026-12-31" },
  { id: "S-002", memberId: "M-002", planId: "P-01", startDate: "2026-09-01", endDate: "2026-10-01" },
  { id: "S-003", memberId: "M-003", planId: "P-04", startDate: "2026-10-25", endDate: "2026-11-25" },
  { id: "S-004", memberId: "M-004", planId: "P-03", startDate: "2026-09-15", endDate: "2027-03-15" },
  { id: "S-005", memberId: "M-005", planId: "P-01", startDate: "2026-08-01", endDate: "2026-09-01" }
];


// Payments (Member submits, Admin verifies)
// status: "Pending", "Verified" or "Rejected"
let payments = [
  { id: "PAY-001", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   planId: "P-02", amount: 4000, method: "bKash", trxId: "9KD2X7LQ1A", date: "2026-10-01", status: "Verified" },
  { id: "PAY-002", memberId: "M-004", memberName: "Farzana Akter", planId: "P-03", amount: 7500, method: "Nagad", trxId: "NG73HD92KP", date: "2026-09-15", status: "Verified" },
  { id: "PAY-003", memberId: "M-003", memberName: "Tamim Rahman",  planId: "P-04", amount: 1000, method: "bKash", trxId: "BK55TR20ZX", date: "2026-10-25", status: "Pending" },
  { id: "PAY-004", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   planId: "P-02", amount: 4000, method: "Nagad", trxId: "NG11AB22CD", date: "2026-11-01", status: "Pending" },
  { id: "PAY-005", memberId: "M-002", memberName: "Sumaiya Islam", planId: "P-01", amount: 1500, method: "bKash", trxId: "BK00WRONG1", date: "2026-10-02", status: "Rejected" }
];


// Workout plans (CRUD by Trainer)
let workouts = [
  { id: "W-001", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   exercise: "Treadmill run",  sets: 1, reps: 20, days: ["Sun", "Tue", "Thu"], notes: "20 minutes, moderate speed" },
  { id: "W-002", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   exercise: "Bench press",    sets: 4, reps: 10, days: ["Mon", "Wed"],        notes: "Start with 30 kg" },
  { id: "W-003", memberId: "M-003", memberName: "Tamim Rahman",  exercise: "Squat",          sets: 5, reps: 8,  days: ["Sat", "Tue"],        notes: "Keep back straight" },
  { id: "W-004", memberId: "M-004", memberName: "Farzana Akter", exercise: "Cycling",        sets: 1, reps: 30, days: ["Sat", "Mon", "Wed"], notes: "30 minutes" }
];


// Attendance (Trainer's Attendance Desk and Report)
let attendance = [
  { id: "A-001", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   date: "2026-10-04", checkIn: "07:05", checkOut: "08:20" },
  { id: "A-002", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   date: "2026-10-06", checkIn: "07:10", checkOut: "08:15" },
  { id: "A-003", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   date: "2026-10-08", checkIn: "07:00", checkOut: "08:05" },
  { id: "A-004", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   date: "2026-10-11", checkIn: "18:30", checkOut: "19:40" },
  { id: "A-005", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   date: "2026-10-13", checkIn: "07:15", checkOut: "08:25" },
  { id: "A-006", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   date: "2026-10-15", checkIn: "07:00", checkOut: "08:00" },
  { id: "A-007", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   date: "2026-10-18", checkIn: "07:20", checkOut: "08:30" },
  { id: "A-008", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   date: "2026-10-20", checkIn: "07:05", checkOut: "08:10" },
  { id: "A-009", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   date: "2026-10-25", checkIn: "18:00", checkOut: "19:15" },
  { id: "A-010", memberId: "M-004", memberName: "Farzana Akter", date: "2026-10-05", checkIn: "17:00", checkOut: "18:10" },
  { id: "A-011", memberId: "M-004", memberName: "Farzana Akter", date: "2026-10-12", checkIn: "17:10", checkOut: "18:00" },
  { id: "A-012", memberId: "M-004", memberName: "Farzana Akter", date: "2026-10-19", checkIn: "17:05", checkOut: "18:15" },
  { id: "A-013", memberId: "M-004", memberName: "Farzana Akter", date: "2026-10-26", checkIn: "17:00", checkOut: "18:05" },
  { id: "A-014", memberId: "M-004", memberName: "Farzana Akter", date: "2026-10-28", checkIn: "17:20", checkOut: "18:30" },
  { id: "A-015", memberId: "M-003", memberName: "Tamim Rahman",  date: "2026-10-27", checkIn: "06:45", checkOut: "07:50" },
  { id: "A-016", memberId: "M-003", memberName: "Tamim Rahman",  date: "2026-10-29", checkIn: "06:50", checkOut: "08:00" },
  { id: "A-017", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   date: "2026-11-01", checkIn: "07:00", checkOut: "08:10" }
];


// Weekly classes (Trainer's Class Schedule Board, shown to Members)
// booked  = how many people are in the class
// members = the member IDs of our members who booked it (they see it on their dashboard)
let classes = [
  { id: "C-01", name: "Morning Yoga", day: "Saturday",  time: "07:00", booked: 12, members: ["M-004"] },
  { id: "C-02", name: "HIIT Blast",   day: "Sunday",    time: "18:00", booked: 15, members: ["M-001", "M-003"] },
  { id: "C-03", name: "Cardio Mix",   day: "Monday",    time: "07:30", booked: 8,  members: ["M-001"] },
  { id: "C-04", name: "Strength 101", day: "Tuesday",   time: "19:00", booked: 10, members: ["M-003"] },
  { id: "C-05", name: "Morning Yoga", day: "Wednesday", time: "07:00", booked: 6,  members: [] },
  { id: "C-06", name: "HIIT Blast",   day: "Thursday",  time: "18:00", booked: 14, members: ["M-004"] }
];


// Fitness progress log (CRUD by Member)
let progressLogs = [
  { id: "L-001", userId: "U-004", date: "2026-10-01", weight: 84,   bodyFat: 26, workout: "Cardio",   notes: "First day" },
  { id: "L-002", userId: "U-004", date: "2026-10-15", weight: 83,   bodyFat: 25, workout: "Strength", notes: "Felt strong" },
  { id: "L-003", userId: "U-004", date: "2026-11-01", weight: 82,   bodyFat: 0,  workout: "Cardio",   notes: "" },
  { id: "L-004", userId: "U-006", date: "2026-10-27", weight: 65,   bodyFat: 14, workout: "Strength", notes: "" }
];


// Diet plans (CRUD by Nutritionist, shown read-only to the Member)
// mealPlan = the foods the Nutritionist saved from the Meal Planner (can be empty)
let dietPlans = [
  { id: "D-001", memberId: "M-001", memberName: "Tanvir Hossain Bhuiyan",   goal: "Lose",     startDate: "2026-10-05", calories: 1900, meals: 4,
    restrictions: ["No beef"], notes: "Less rice at night, more vegetables.",
    mealPlan: [
      { meal: "Breakfast", name: "Oats (1 bowl)",                 servings: 1, calories: 150, protein: 5 },
      { meal: "Breakfast", name: "Boiled egg (1)",                servings: 2, calories: 156, protein: 12 },
      { meal: "Breakfast", name: "Egg whites (3)",                servings: 1, calories: 51,  protein: 11 },
      { meal: "Lunch",     name: "Rice (1 cup cooked)",           servings: 1, calories: 205, protein: 4 },
      { meal: "Lunch",     name: "Grilled chicken breast (100 g)",servings: 2, calories: 330, protein: 62 },
      { meal: "Lunch",     name: "Dal (1 bowl)",                  servings: 1, calories: 150, protein: 9 },
      { meal: "Lunch",     name: "Mixed vegetables (1 cup)",      servings: 1, calories: 80,  protein: 3 },
      { meal: "Snack",     name: "Yogurt / Doi (1 cup)",          servings: 1, calories: 150, protein: 8 },
      { meal: "Snack",     name: "Apple (1)",                     servings: 1, calories: 95,  protein: 0 },
      { meal: "Dinner",    name: "Roti (1 piece)",                servings: 2, calories: 240, protein: 6 },
      { meal: "Dinner",    name: "Fish curry (1 piece)",          servings: 1, calories: 180, protein: 22 },
      { meal: "Dinner",    name: "Egg whites (3)",                servings: 1, calories: 51,  protein: 11 },
      { meal: "Dinner",    name: "Salad (1 plate)",               servings: 1, calories: 50,  protein: 2 }
    ] },
  { id: "D-002", memberId: "M-003", memberName: "Tamim Rahman",  goal: "Gain",     startDate: "2026-10-28", calories: 2900, meals: 5,
    restrictions: [], notes: "Add eggs and milk after workout.", mealPlan: [] },
  { id: "D-003", memberId: "M-004", memberName: "Farzana Akter", goal: "Lose",     startDate: "2026-09-20", calories: 1600, meals: 4,
    restrictions: ["Lactose-free"], notes: "", mealPlan: [] }
];


// Local foods (Nutritionist's Meal Planner)
// calories and protein (grams) for ONE serving
let foods = [
  { name: "Rice (1 cup cooked)",     calories: 205, protein: 4 },
  { name: "Roti (1 piece)",          calories: 120, protein: 3 },
  { name: "Dal (1 bowl)",            calories: 150, protein: 9 },
  { name: "Boiled egg (1)",          calories: 78,  protein: 6 },
  { name: "Chicken curry (1 bowl)",  calories: 250, protein: 25 },
  { name: "Fish curry (1 piece)",    calories: 180, protein: 22 },
  { name: "Mixed vegetables (1 cup)",calories: 80,  protein: 3 },
  { name: "Banana (1)",              calories: 105, protein: 1 },
  { name: "Apple (1)",               calories: 95,  protein: 0 },
  { name: "Milk (1 glass)",          calories: 120, protein: 8 },
  { name: "Yogurt / Doi (1 cup)",    calories: 150, protein: 8 },
  { name: "Oats (1 bowl)",           calories: 150, protein: 5 },
  { name: "Peanuts (1 handful)",     calories: 160, protein: 7 },
  { name: "Chickpeas / Chola (1 cup)", calories: 210, protein: 11 },
  { name: "Beef curry (1 bowl)",     calories: 300, protein: 26 },
  { name: "Salad (1 plate)",         calories: 50,  protein: 2 },
  { name: "Grilled chicken breast (100 g)", calories: 165, protein: 31 },
  { name: "Egg whites (3)",          calories: 51,  protein: 11 }
];


// Gym opening hours (Home page)
// index 0 = Sunday, the same numbering as Date's getDay()
let gymHours = [
  { day: "Sunday",    open: "06:00", close: "22:00" },
  { day: "Monday",    open: "06:00", close: "22:00" },
  { day: "Tuesday",   open: "06:00", close: "22:00" },
  { day: "Wednesday", open: "06:00", close: "22:00" },
  { day: "Thursday",  open: "06:00", close: "22:00" },
  { day: "Friday",    open: "15:00", close: "22:00" },
  { day: "Saturday",  open: "06:00", close: "22:00" }
];
