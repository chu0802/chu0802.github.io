let countdownInterval;

const eventTable = {
    "submission": "Submission Due",
    "review": "Review Release Date",
    "rebuttal": "Rebuttal Due",
    "decision": "Decision Release",
    "trip": "Coming Trip"
};

document.addEventListener('DOMContentLoaded', function() {
  const menu = document.getElementById('menu');
  const trigger = document.getElementById('trigger');

  trigger.addEventListener('mouseenter', function() {
      menu.style.left = '0px';
  });

  menu.addEventListener('mouseleave', function() {
      menu.style.left = '-250px';
  });

  fetch('assests/deadline.json')
  .then(response => response.json())
  .then(data => {
      const eventList = {
        "submission": document.getElementById('submissionList'),
        "review": document.getElementById('reviewList'),
        "rebuttal": document.getElementById('rebuttalList'),
        "decision": document.getElementById('decisionList'),
        "trip": document.getElementById('tripList')
      }

      const now = new Date();
      let closestEvent = null;
      let closestTime = Infinity;

      data.events.forEach(event => {
          const li = document.createElement('li');
          li.textContent = event.name;
          li.style.padding = '10px';
          li.style.paddingLeft = '20px';
          li.style.color = 'white';
          li.style.cursor = 'pointer';
          li.addEventListener('click', () => selectEvent(event));

          let closestDeadline = Infinity;
          let closestType = null;

          let eventDeadlines = new Map(Object.entries(event.deadline));

          eventDeadlines.forEach((value, key) => {
              let deadline = new Date(value + ' ' + event.timezone);
              if (deadline < closestDeadline && deadline > now) {
                closestDeadline = deadline;
                closestType = key;
              }
          });
          
          // Update the logic to handle the case when closestType is null
          if (closestType && closestDeadline < closestTime && closestType === "submission") {
            closestEvent = event;
            closestTime = closestDeadline;
          }

          if (closestType) {
            eventList[closestType]?.appendChild(li);

            event.closestDeadline = closestDeadline;
            event.closestType = closestType;
          }
      });

      data.events.forEach(event => {
        console.log(event);
      });
      // Automatically select the closest coming event
      if (closestEvent) {
          selectEvent(closestEvent);
      }
  })
  .catch(error => console.log('Error loading the events: ', error));
});

function selectEvent(event) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    const eventName = document.getElementById('eventName');
    const eventDate = document.getElementById('eventDate');
    const eventType = document.getElementById('eventType');
    const countdownElement = document.getElementById('countdown');
    const hourHand = document.querySelector('.hand.hour');
    const minuteHand = document.querySelector('.hand.minute');
    const secondHand = document.querySelector('.hand.second');
    const body = document.querySelector('body');

    // Change the background image
    body.style.backgroundImage = `url('${event.image_path}')`;
    eventName.textContent = event.name;
    eventType.textContent = eventTable[event.closestType];

    // Create a Date object using the event's deadline
    let eventTime = event.closestDeadline;
    // Format the date and time
    const options = { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit'};
    const formattedDate = eventTime.toLocaleString('en-US', options) + ` UTC+8 @ ${event.city}, ${event.country}`;
    eventDate.textContent = formattedDate;

    const specialDay = eventTime.getTime();


  countdownInterval = setInterval(function() { // Store the interval ID
      const now = new Date().getTime();
      const distance = specialDay - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.innerHTML = `${days} days ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} left`;
      
      const totalSeconds = hours * 3600 + minutes * 60 + (distance % (1000 * 60)) / 1000 - 0.5;
      
      hourHand.style.setProperty('--hour-rotation', totalSeconds / 3600);
      minuteHand.style.setProperty('--minute-rotation', totalSeconds / 60);
      secondHand.style.setProperty('--second-rotation', totalSeconds % 60);
  }, 10);
}
