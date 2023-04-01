const sortIcon = document.getElementsByClassName("sortIcon");
export const sortedId = () => {
  const sortId = [];
  for (const icon in sortIcon) {
    sortId.push(sortIcon[icon].id);
  }
  sortId.splice(6);
  return sortId;
};
