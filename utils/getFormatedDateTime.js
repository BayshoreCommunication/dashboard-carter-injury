export const getFormatedDateTime = (date) => {
  const inputDate = new Date(date);

  const formattedDateTime = inputDate.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formattedDateTime;
};
