// Grabbing the calender, date, day and prev and next angles

const calender = document.querySelector(".calender"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventSubmit = document.querySelector(".add-event-btn");

//creating a present day object
let today = new Date();
// dont know what this is yet
let activeDay;
// extracting the month from the today instance
let month = today.getMonth();
console.log(month); // 8
// extracting the year from the today instance
let year = today.getFullYear();
console.log(year); // 2023

// an array of months
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// sample events array
// const eventArr = [
//   {
//     day: 9,
//     month: 10,
//     year: 2023,
//     events: [
//       {
//         title: "Event 1",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   },
//   {
//     day: 22,
//     month: 9,
//     year: 2023,
//     events: [
//       {
//         title: "Event 1",
//         time: "10:00 AM",
//       },
//     ],
//   },
// ];

// the actual one
let eventArr = [];

// if there was any preDefined events, retrieve them and save them in the eventArr
getEventsFromStorage();

// function which adds days
function initCalender() {
  // to get prev month days and current month all days and rem next month days

  // In the Date object constructor new Date(year, month, 1), the 1 specifies the day of the month for the date being created
  const firstDay = new Date(year, month, 1);

  // In the new Date(year, month + 1, 0) expression, the 0 is a special parameter for the day of the month. When you set it to 0, JavaScript gives you the last day of the previous month. In this case, month + 1 moves you to the next month, and setting the day to 0 takes you back one day to the last day of the original month you were interested in.

  // if year is 2023 and month is 0 (January), then new Date(year, month + 1, 0) would give you January 31, 2023. It moves to February and then steps back to the last day of January.
  const lastDay = new Date(year, month + 1, 0);

  // Does similar work but now it retrieves the actual previous months last day
  const prevLastDay = new Date(year, month, 0);

  const prevDays = prevLastDay.getDate(); // 31 (august)
  const lastDate = lastDay.getDate(); // 30 (sept)

  //Grabbing the day of first date
  const day = firstDay.getDay(); // 5 (friday)

  // this retrieves how many days we need from next month to fill the calender grid, in our calender september ends with saturday, since we are making this project on september 2023 and the last day of the month is a saturday, we dont need to fill the grid with any more days from the next month.
  // Calculation, lastDay.getDay() returns the last day of the current month as integer, starts from 0 - 6. adding 1 to it balances everything
  const NUMBER_OF_DAYS_IN_A_WEEK = 7;
  const nextDays = NUMBER_OF_DAYS_IN_A_WEEK - (lastDay.getDay() + 1);

  // update date top of the calender
  date.innerHTML = months[month] + " " + year;

  // adding days on dom
  let days = "";

  // Adding days from the previous month in the grid
  days += fillGridWithPrevDays(day, prevDays);
  // Adding the today and rest of the days in the grid
  days += returnToday(year, month, lastDate);
  // Adding days from next month in the grid
  days += fillTheGridWithNextDays(nextDays);
  daysContainer.innerHTML = days;
  addListener();
}

function returnToday(year, month, lastDate) {
  let daysOfTheMonth = "";
  // current month days
  for (let i = 1; i <= lastDate; i++) {
    // check if event present on current day
    let event = false;
    eventArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        // if event found
        event = true;
      }
    });

    // if i matches todays date we dynamically add the class today in the div
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);

      if (event) {
        daysOfTheMonth += `<div class="day today event active">${i}</div>`;
      } else {
        daysOfTheMonth += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        daysOfTheMonth += `<div class="day event">${i}</div>`;
      } else {
        daysOfTheMonth += `<div class="day">${i}</div>`;
      }
    }
  }
  return daysOfTheMonth;
}

initCalender();
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

//* Helper Functions
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalender();
}
function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalender();
}
function fillGridWithPrevDays(firstDay, lastDayOfPrevMonth) {
  let accumulateAllPrevDays = "";
  // Loop to populate the empty slots at the beginning of the current month's calendar grid.
  // These slots will be filled with the last few dates of the previous month.
  // The loop starts with 'x' equal to the day index of the first day of the current month
  // (e.g., if the first day is a Friday, 'x' starts at 5).
  // It decrements 'x' until it reaches 0.
  for (let x = firstDay; x > 0; x--) {
    // The formula 'prevDays - x + 1' calculates the correct date from the previous month to fill the empty slot.
    // 'prevDays' is the last date of the previous month.
    // 'x' is the current loop index, representing how many empty slots there are.
    // The '+ 1' ensures that we start from the correct day from the previous month to maintain a logical flow. if previous month page ends on 26, in the current month's page we want to start from 27th
    accumulateAllPrevDays += `<div class="day prev-date">${
      lastDayOfPrevMonth - x + 1
    }</div>`;
  }
  return accumulateAllPrevDays;
}
function fillTheGridWithNextDays(nextDays) {
  let accumulateNextDays = "";
  for (let j = 1; j <= nextDays; j++) {
    accumulateNextDays += `<div class="day next-date">${j}</div>`;
  }
  return accumulateNextDays;
}

todayBtn.addEventListener("click", () => {
  //I have a today var at the top updating it have a new Date in it
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalender();
});

dateInput.addEventListener("input", (e) => {
  // The first parameter was keyup before later changed to input

  //keyup fires when a keyboard key is released and is specific to keyboard interactions.
  // input fires immediately after an <input> element's value changes, capturing all types of changes, including mouse, copy paste and programmatic events.
  // With keyup, the character briefly appears in the input before any modification, since it fires after the key is released.
  // In contrast, input allows immediate sanitization of the input value, often preventing unwanted characters from being rendered visibly.

  // ---------------------------------------------------

  // the regex expression below allow only numbers remove anything else

  // [...]: Square brackets in a regular expression define a character set. A character set matches any single character that is in the set.
  // 0-9: This is a range that includes all the numbers from 0 to 9.
  // ^: When this symbol appears at the start of a character set ([^...]), it negates the set. This means that the set will now match any character that is not in the specified set.
  // .replace() is a string method that replaces a specified substring or pattern in a string with another substring. in this case since its negeating because of ^ sybol, any charcater that is not in the set will be replaced with the empty string

  // Basically the intention here is, if the user enters any non number or not /, it will be replaced with "" empty string.
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");

  // Add an automatic slash if two numbers ar entered
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  // Dont allow more than 7 characters
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }

  // Here is whats happening in the below code
  //You type 12, triggering the input event, and the code adds a / making it 12/.
  // You press backspace. The / is initially deleted, making the value 12.
  // The input event is triggered again. Because the value has a length of 2 (12), the / is automatically added back, making it 12/ again.
  // At this point, the if (e.inputType === "deleteContentBackward") {...} block of code checks if the last operation was a backspace (deleteContentBackward) and if the current length is 3 (12/).
  // If both conditions are met, it slices off the last character (the /), leaving just 12.
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

// function to goto entered date

function gotoDate() {
  const dateArr = dateInput.value.split("/");

  // Date validations
  if (dateInput.value === "") {
    alert("No date entered! \nPlease enter a valid date and try again!");
    return;
  }
  if (dateArr.length === 2) {
    // Checking if the month field's value is > 0 and < 13, and the year fields value is 4,
    // if true then we set the global month variable to 1 less than entered value because the date object counts the month as 0 - 11.
    // if the year's length is 4 we we set the global year variable to the entered value
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalender();
    } else {
      alert("Invalid date!");
    }
  } else {
    alert("Incomplete date!");
  }
}

const addEventBtn = document.querySelector(".add-event"),
  addEventContainer = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to");

addEventBtn.addEventListener("click", () => {
  // Testing
  console.log("Code 3");
  addEventContainer.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventContainer.classList.remove("active");
});

// e.target refers to the actual element that was directly clicked on

// "e.target !== addEventBtn" checks if the clicked element is not the addEventBtn.

// "!addEventContainer".contains(e.target) checks if the clicked element is not inside the addEventContainer (or isn't the container itself).

// If both conditions are true (i.e., the user clicked outside both the addEventBtn and the addEventContainer), then the class "active" is removed from addEventContainer, which likely hides it.

document.addEventListener("click", (e) => {
  // Testing
  console.log(e.target, "Code 1");
  if (e.target !== addEventBtn && !addEventContainer.contains(e.target)) {
    // Testing
    console.log(e.target, "Code 2");
    addEventContainer.classList.remove("active");
  }
});

// Event validation
// Allow only 50 chars in title
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 50);
});

// time format in event
// Any string sharacter will be removed
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");

  // When two number is entered a : is added
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }

  // Only characters are allowed
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");

  // When two number is entered a : is added
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }

  // Only 5 characters are allowed
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

// This function when called adds click event to all the day elements
function addListener() {
  // Saves a nodelist of all day element
  const days = document.querySelectorAll(".day"); //A node list of all days

  console.log("listener added");

  // Each days is recieveing an event
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      // in the activeDay variable we are saving the date number, current day's date is saved in the activeDay variable, meaning when we click a date grid its innerText content (the date) is saved to the activeDay variable
      activeDay = Number(e.target.innerHTML);
      console.log(activeDay, "<--");

      {
        //! This part of the code might be deleted, pending status
        // Call active the function getActiveDay after each click in the dates
        // getActiveDay(e.target.innerHTML);
        // updateEvents(Number(e.target.innerHTML));
      }

      // remove active from an already active day
      days.forEach((day) => {
        // The classList.remove("active") method will attempt to remove the "active" class from the element. If the class is present, it will be removed; if it's not present, nothing will happen, and there won't be any errors.
        day.classList.remove("active");

        //* it's perfectly okay to iterate over the same collection multiple times, even within an iteration of that same collection.
      });

      // if a date from previous month is clicked then goto prev month and add active class
      // At first we check if the clicked div has the prev-date class, if clicked on a previous month's date, then it will have prev-date class.
      // The first thing we do we call the prevMonth function which initializes the calender gird with previous month's dates and since initCalnder calls the addListener() function (which is this very function), all the dates from the previous month get evenListeners aswell

      //  inside the setTimeout we select all the dates in the current grid, and we check if a date does not have the prev-date class thats not all we also check which date contains the previous month date that was clicked on the original grid, when found we just add the active class in that date, and it glows
      // Same functionality occurs when clicked on a prvious date again, since the event listeners were added to each grid when prevMonth function was called
      if (e.target.classList.contains("prev-date")) {
        prevMonth();

        // Send the dates to getActiveDay and updateEvents methods
        getActiveDay(e.target.innerHTML);
        updateEvents(Number(e.target.innerHTML));

        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
        // Same with next month days
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        getActiveDay(e.target.innerHTML);
        updateEvents(Number(e.target.innerHTML));
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
        getActiveDay(e.target.innerHTML);
        updateEvents(Number(e.target.innerHTML));
      }
    });
  });
}

// Lets show active day events and date at the top
function getActiveDay(date) {
  console.log("Called");
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

// function to show events of that day
// date parameter has the passed in date value
function updateEvents(date) {
  // Defining a blank events variable, which will hold the event's HTML for each event
  let events = "";
  // eventArr contains all the events, their dates, month, year
  eventArr.forEach((event) => {
    // When a day is clicked, and if it has event(s), each event is shown
    // For each event in the array we add a block of html code, and fill the necessary property with event's value
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      // Then show event on eventContainer
      event.events.forEach((event) => {
        events += `
        <div class="event">
        <div class="title">
          <i class="fas fa-circle"></i>
          <h3 class="event-title">${event.title}</h3>
        </div>
        <div class="event-time">
          <span class="event-time">${event.time}</span>
        </div>
      </div>
        `;
      });
    }
  });
  // If there are no events inside the array, we just add the no-event class inside the div
  if (events === "") {
    events = `<div class="no-event">
              <h3>No Events on ${months[month].slice(0, 3)} ${date}</h3>
              </div>`;
  }
  // Finally wheather the events variable defined in the top has any event or not, we simply add it to the eventContainer
  eventsContainer.innerHTML = events;

  // lets save all the events inside the localStorage
  saveEventsInStorage();
}

// Lets create function to add event
addEventSubmit.addEventListener("click", () => {
  console.log("hi");
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  console.log(eventTitle);
  // necessary validation
  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Please fillup the fields!");
    return;
  }

  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");

  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Invalid Time Format!");
  }

  // At first we are formating out from time so that it will have hh:mm Am/Pm
  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  // Next we are creating new event object with title property set to eventTitle and time property set to timeFrom + " - " + timeTo
  const newEvent = {
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
  };

  // eventAdded variable is set to false
  let eventAdded = false;

  // check if current activeDay already has any event in it, or is it empty
  if (eventArr.length > 0) {
    // check if selected day has any event, if so than just push current event in the tail
    eventArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        console.log(`already have: ` + item.events.length);
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  // if there were no event for the selected date, then we need to create a event object which will have day, month, year, and events array with current event added, after that if we want to add more events in the events array for the selected date, the above block of caode will be used, since then the selected day will have atleast one event
  if (!eventAdded) {
    eventArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  // remove active class so the, event window closes
  addEventContainer.classList.remove("active");

  // clear the fields
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";

  // Show current added event
  updateEvents(activeDay);

  // also add event class to newly added day if not already
  // Grbbing the day that is currently active
  const activeDayElem = document.querySelector(".day.active");
  if (!activeDayElem.classList.contains("event")) {
    activeDayElem.classList.add("event");
  }
});

function convertTime(time) {
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  // If timeHour is 12 or greater we add PM if less than than AM
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  // Here for the given value of timeHour we are performing a modulus operation if the reminder is 0 we take 12, since 0 is a falsy value, if not 0, we take the actual remainder.
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

eventsContainer.addEventListener("click", (e) => {
  // if clicked in an event inside the event container
  if (e.target.classList.contains("event")) {
    // when clicked in a specific event, the e.target is the div that caontains both the title div and the time div, the title div(children[0]) has an i element and an h3 element inside it, and we are trying to retrieve the h3 element which is the title name
    const eventTitle = e.target.children[0].children[1].innerHTML;

    //after getting the title of event search in array by title and delete
    eventArr.forEach((event) => {
      // if when clicked the event date month and year matches
      if (event.day === activeDay && event.month === month + 1 && event.year) {
        // then we loop throught all the events in that event object
        event.events.forEach((item, index) => {
          // then if the event's title matches with the eventTitle variable we saved before
          if (item.title === eventTitle) {
            // then we delete that event
            event.events.splice(index, 1);
          }
        });
        // Now if the event is now empty as in no events are left, we remove this whole event object
        if (event.events.length === 0) {
          eventArr.splice(eventArr.indexOf(event), 1);
          // after removing the event we remove the active class from that day as well, since this day no longer has any event

          //Without a space: .day.active
          // This selector targets a single element that has both the class day and the class active simultaneously.
          const activeDayElem = document.querySelector(".day.active");
          if (activeDayElem.classList.contains("event")) {
            activeDayElem.classList.remove("event");
          }
        }
      }
    });
    updateEvents(activeDay);
  }
});

// localStorage is a web storage solution that allows websites to store key-value pairs in a web browser with no expiration time

// Key Characteristics of localStorage:

// It stores data with no expiration time.

// The maximum storage space is typically 5-10MB depending on the browser.

// Data is stored as strings. This means if you want to store objects or arrays, you have to convert them into strings using JSON.stringify(), and to retrieve them, you would parse them back using JSON.parse().

// the setItem method takes a key and a value just like a map DS
// In this case key is "events", and value is the eventsArr with its content converted into string

function saveEventsInStorage() {
  localStorage.setItem("events", JSON.stringify(eventArr));
}

// Now to retrieve the events we are first cheking if there are any events currently in the local storage,
// if there are then we just push the array elements inside our original eventArr

// remember that
// JSON.parse() deciphers whether the given string is an array or an object based on the structure of the JSON string:

// If the string starts and ends with square brackets [...], it's recognized as an array.
// If the string starts and ends with curly braces {...}, it's recognized as an object.

function getEventsFromStorage() {
  if (localStorage.getItem("events") !== "[]") {
    eventArr.push(...JSON.parse(localStorage.getItem("events")));
  } else {
    return;
  }
}

//! Finally Very Important Note: each user's events will be saved in their own localStorage, making it dynamic for each user. It won't mix up data between users
