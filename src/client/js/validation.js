//Validate URL
function isUrlValid(userInput) {
  var res = userInput.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  if (res == null) return false;
  else return true;
}

//Validate Date24, 121)24, 121)24, 121)24, 121)
function isDateValid(userInput) {
  var res = userInput.match(
    /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/g
  );
  if (res == null) return false;
  else return true;
}

export { isUrlValid, isDateValid };
