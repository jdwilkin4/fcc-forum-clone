import {
  FORUM_TOPIC,
  FORUM_CATEGORY,
  FORUM_AVATARS,
  FORUM_API,
} from "./constants.js";
import { Forum } from "./forum.js";
import { forumCategoriesObj } from "./helpers.js";

const copyright = document.getElementById("copyright");
const forum = new Forum();

document.addEventListener("DOMContentLoaded", () => {
  forum.init();
});

copyright.innerText = new Date().getFullYear();
