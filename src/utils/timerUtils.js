async function checkDate(day, month, year, time) {
  try {
    // Adjust month for JavaScript Date object (0-indexed)
    const adjustedMonth = month - 1;

    return new Date(year, adjustedMonth, day, time, 0);
  } catch (error) {
    console.log("There was an error checking the date:", error);
    return false;
  }
}

async function createTimer(duration, callback) {
  try {
    if (duration > 0) {
      const timer = setTimeout(() => {
        callback();

        client.timerArray = client.timerArray.filter((t) => t.id !== timer);
      }, duration);

      client.timerArray.push({ id: timer, ...timerInfo });

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error occurred while setting up the timer:", error);
    return false;
  }
}

async function getTimeoutDuration(futureDate) {
  try {
    const now = new Date();

    const duration = futureDate.getTime() - now.getTime();

    return duration > 0 ? duration : 0;
  } catch (err) {
    console.log("There was an error getting the timeout duration:", error);
    return false;
  }
}

async function stopTimer(client, timerInfo) {
  const timer = client.timerArray.find(
    (t) => t.someProperty === timerInfo.someProperty
  );
  if (timer) {
    clearTimeout(timer.id);
    client.timerArray = client.timerArray.filter((t) => t.id !== timer.id);
    return true;
  }
  return false;
}

module.exports = {
  checkDate,
  createTimer,
  getTimeoutDuration,
  stopTimer,
};
