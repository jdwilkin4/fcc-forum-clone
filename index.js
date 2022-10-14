import {
  FORUM_TOPIC,
  FORUM_CATEGORY,
  FORUM_AVATARS,
  FORUM_API,
} from "./constants.js";

import { forumCategoriesObj } from "./helpers.js";

const copyright = document.getElementById("copyright");

copyright.innerText = new Date().getFullYear();
const postsContainer = document.getElementById("posts-container");
