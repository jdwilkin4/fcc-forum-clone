export const environment = "DEVELOPMENT";

export const forumCategoriesObj = {
  1: { category: "General", className: "general" },
  3: { category: "Contributors", className: "contributors" },
  299: { category: "Career Advice", className: "career" },
  409: { category: "Project Feedback", className: "feedback" },
  417: { category: "freeCodeCamp Support", className: "support" },
  421: { category: "JavaScript", className: "javascript" },
  423: { category: "HTML - CSS", className: "html-css" },
  424: { category: "Python", className: "python" },
  432: { category: "You Can Do This!", className: "motivation" },
  497: { category: "Guide", className: "guide" },
  560: { category: "Backend Development", className: "backend" },
};

export const log = (message) =>
  environment === "DEVELOPMENT" && console.log(message);
