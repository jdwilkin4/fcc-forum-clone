import {
  FORUM_TOPIC,
  FORUM_CATEGORY,
  FORUM_AVATARS,
  FORUM_API,
  FORUM_USER,
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
    const users = forumData["users"];
    displayTopicList(topics, users);
  })
  .catch((error) => {
    isError = true;
    console.log(error);
  })
  .finally(() => {
    isLoading = false;
  });

const displayTopicList = (topicList, users) => {
  topicList
    .filter((topic) => topic["category_id"] in supportedTopicCategories)
    .forEach((topic) => displayTopic(topic, users));
};

const displayTopic = (topic, users) => {
  const category = supportedTopicCategories[topic["category_id"]];
  const posters = topic.posters.map(({ user_id: userId }) => userId);

  let postersAvatars = "";
  const displayPosterAvatar = (posterId) => {
    const poster = users.find((user) => user.id == posterId);
    const avatarTemplate = poster["avatar_template"].replace("{size}", "25");
    const posterAvatar = avatarTemplate.startsWith("/")
      ? `${FORUM_AVATARS}/${avatarTemplate}`
      : avatarTemplate;
    postersAvatars += `
      <a href="${FORUM_USER}/${poster.username}" target="_blank">
        <img src="${posterAvatar}" title="${poster.username}"/>
      </a>
    `;
  };
  posters.forEach(displayPosterAvatar);

  const ifSummaryDisplay = () => {
    let summary = "";
    if (topic["has_summary"]) {
      summary = `
      <p class='post-summary'>
        ${topic.excerpt}
        <a class='post-read-more' href='${FORUM_TOPIC}/${topic.slug}' target='_blank'>read more</a>
      </p>
      `;
    }
    return summary;
  };

  let post = `
  <tr> 
    <td>
      <span>
        <a class='post-title' href='${FORUM_TOPIC}/${
    topic.slug
  }' target='_blank'>
          ${topic.title}
        </a>
      </span>
      <div class='post-category'>
        <a class='${category.name}' href='${FORUM_CATEGORY}/${
    category.name
  }' target='_blank'>
          ${category.longName}
        </a>
      </div>
      ${ifSummaryDisplay()}
    </td>
    <td class="posters">
      <div class="postersAvatars">${postersAvatars}</div>
    </td>
    <td class="replies"></td>
    <td class="views"></td>
    <td class="activity"></td>
  </tr>`;
  postsContainer.innerHTML += post;
};

copyright.innerText = new Date().getFullYear();
