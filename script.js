const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateElement = document.getElementById('date-picker');

const countdownElement = document.getElementById('countdown');
const countdownElementTitle = document.getElementById('countdown-title');
const countdownButton = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeElement = document.getElementById('complete');
const completeElementInfo = document.getElementById('complete-info');
const completeButton = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set date input min with today's date
const today = new Date().toISOString().split('T')[0];
dateElement.setAttribute('min', today);

// populate countdown / complete UI
function updateDOM() {
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;
    
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);
    
        // hide input
        inputContainer.hidden = true;

        // if countdown has ended, show complete
        if (distance < 0) {
            countdownElement.hidden = true;
            clearInterval(countdownActive);
            completeElementInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeElement.hidden = false;
        } else {
            //Else, show the countdown in progress:

            // populating countdown
            countdownElementTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;

            completeElement.hidden = true;
            countdownElement.hidden = false;
        }
    }, second);
}

// take values from form input
function updateCountdown(e) {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));
    // check for valid date
    if (countdownDate === '') {
        alert('Select a date for the countdown');
    } else {
        // get number version of current date, updateDOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}

// reset all values
function reset() {
    // hide countdowns, show input
    countdownElement.hidden = true;
    completeElement.hidden = true;
    inputContainer.hidden = false;
    // stop the countdown
    clearInterval(countdownActive);
    // reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // get countdown title and date from local storage if available
    if(localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}


// event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownButton.addEventListener('click', reset);
completeButton.addEventListener('click', reset);

// on load, check localstorage
restorePreviousCountdown();