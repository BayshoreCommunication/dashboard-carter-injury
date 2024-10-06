export const getFormattedDate = (date) => {
  const inputDate = new Date(date);

  const formattedDate = inputDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
};
