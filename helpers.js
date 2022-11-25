export const supportedTopicCategories = {
  299: { longName: "Career Advice", name: "career" },
  409: { longName: "Project Feedback", name: "feedback" },
  417: { longName: "freeCodeCamp Support", name: "support" },
  421: { longName: "JavaScript", name: "javascript" },
  423: { longName: "HTML-CSS", name: "html-css" },
  424: { longName: "Python", name: "python" },
  432: { longName: "You Can Do This!", name: "motivation" },
  560: { longName: "Backend Development", name: "backend-development" },
  1: { longName: "General", name: "general" },
  3: { longName: "Contributors", name: "contributors" },
};

export const formatDateDiff = (recent, old) => {
  old = new Date(old);
  recent = new Date(recent);
  const timeDifference = recent - old;
  const seconds = timeDifference / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (seconds < 60) return "1m";
  if (minutes < 60) return Math.round(minutes) + "m";
  if (hours < 24) return Math.round(hours) + "h";
  if (days < 30) return Math.round(days) + "d";
  if (old.getFullYear() != new Date(Date.now()).getFullYear()) {
    const formattedDate = new Intl.DateTimeFormat("default", {
      month: "short",
      year: "2-digit",
    }).format(old.getTime());
    return formattedDate.substring(0, 3) + " '" + formattedDate.substring(4, 6);
  }
  return new Intl.DateTimeFormat("default", {
    month: "short",
    day: "numeric",
  }).format(old.getTime()); // ex: Nov 15
};

export function formatLargeNumber(n) {
  let postfix = "", s = "";
  if (n > 999 && n < 1000000) {
      n = n / 1000
      postfix = "k";
  } else if (n >= 1000000) {
      n = n / 1000000
      postfix = "M";
  }
  let temp = String(n).split(".");
  s += temp[0];
  if (temp.length > 1 && temp[1][0] !== "0") {
      s += "." + temp[1][0];
  }
  s += postfix;
  return s;
}