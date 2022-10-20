import {
  FORUM_TOPIC,
  FORUM_CATEGORY,
  FORUM_AVATARS,
  FORUM_API,
} from "./constants.js";

import { forumCategoriesObj } from "./helpers.js";

const copyright = document.getElementById("copyright");
const postsContainer = document.getElementById("posts-container");

let isLoading = true;
let isError = false;
let forumData = null;

// Fetch FCC forum latest data
fetch(FORUM_API)
  .then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    forumData = data;
    console.log("success");
    console.log(forumData);
  })
  .catch((error) => {
    isError = true;
    console.log(error);
  })
  .finally(() => {
    isLoading = false;
  });

copyright.innerText = new Date().getFullYear();
