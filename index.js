import {
  FORUM_TOPIC,
  FORUM_CATEGORY,
  FORUM_AVATARS,
  FORUM_API,
} from "./constants.js";

import { supportedTopicCategories } from "./helpers.js";

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
  topicList
    .filter((topic) => topic["category_id"] in supportedTopicCategories)
    .forEach(displayTopic);
};

const displayTopic = (topic) => {
  const category = supportedTopicCategories[topic["category_id"]];
  let post = `<tr> 
    <td>
      <span>
        <a class='post-title' href='${FORUM_TOPIC}/${topic.slug}' target='_blank'>
          ${topic.title}
        </a>
      </span>
      <div class='post-category'>
        <a class='${category.name}' href='${FORUM_CATEGORY}/${category.name}' target='_blank'>
          ${category.longName}
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
