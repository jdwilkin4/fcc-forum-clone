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
    const topics = forumData["topic_list"].topics;
    displayTopicList(topics);
  })
  .catch((error) => {
    isError = true;
    console.log(error);
  })
  .finally(() => {
    isLoading = false;
  });

const displayTopicList = (topicList) => {
  for (const topic of topicList) {
    const categoryId = topic["category_id"];
    if (!(categoryId in forumCategoriesObj)) {
      continue;
    }
    const category = forumCategoriesObj[categoryId].className;
    const categoryText = forumCategoriesObj[categoryId].category;
    displayTopic(topic, category, categoryText);
  }
};

const displayTopic = (topic, category, categoryText) => {
  let post = `<tr> 
    <td>
      <span id='post-title'>
        <a href='${FORUM_TOPIC}/${topic.slug}' target='_blank'>
          ${topic.title}
        </a>
      </span>
      <div id='post-category'>
        <a class='${category}' href='${FORUM_CATEGORY}/${category}' target='_blank'>
          ${categoryText}
        </a>
      </div>
    </td>
    <td></td>
    <td></td>
    <td></td>
  </tr>`;
  postsContainer.innerHTML += post;
};

copyright.innerText = new Date().getFullYear();
