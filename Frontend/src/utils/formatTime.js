function formatTime(rawTime, { detailed=false } = {}) {
  // rawTime can be a Date object or a string like "2026-05-13T11:33:00"
  const date = (typeof rawTime === "string" || typeof rawTime === "number")
  ? new Date(rawTime)
  : rawTime;

  let detailedDateString = detailed && date?.toDateString();
  let hours = date?.getHours();
  let minutes = date?.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 → 12 for midnight
  minutes = minutes.toString().padStart(2, "0");

  return `${detailed ? detailedDateString + ',' : ''} ${hours}:${minutes} ${ampm}`;
}

export default formatTime;