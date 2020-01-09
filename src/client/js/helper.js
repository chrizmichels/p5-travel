//Validate URL
function isUrlValid(userInput) {
  var res = userInput.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  if (res == null) return false;
  else return true;
}

function plg(data) {
  return {
    polarity: "resp.polarity",
    confidence: "resp.polarity_confidence",
    text: "resp.text",
    url: "analyseURL"
  };
}

export { isUrlValid, plg };
