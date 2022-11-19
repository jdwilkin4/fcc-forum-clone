import {
  FORUM_TOPIC,
  FORUM_CATEGORY,
  FORUM_AVATARS,
  FORUM_API,
  FORUM_USER,
} from "./constants.js";

import { supportedTopicCategories, formatDateDiff } from "./helpers.js";

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
    displayPostList();
  })
  .catch((error) => {
    isError = true;
    console.log(error);
  })
  .finally(() => {
    isLoading = false;
  });
console.log(forumData);

const displayPostList = () => {
  forumData["topic_list"].topics
    .filter((post) => post["category_id"] in supportedTopicCategories)
    .forEach(displayPost);
};

const displayPost = (post) => {
  const category = supportedTopicCategories[post["category_id"]];
  const posters = post.posters.map(({ user_id: userId }) => userId);
  const users = forumData["users"];
  
  const postsCount = forumData["topic_list"]["topics"];
 
 // solution 1
  const getVal = postsCount.map(x => ({posts_count: x["posts_count"]}));
  const getRes = getVal.map(Object.values)

 // solution 2
  function select(show){
    const {title, posts_count} = show;
    return {title, posts_count}
  }
  const newEpi = postsCount.map(select)

  
  console.log(newEpi)

  let postersAvatars = "";
  const displayPosterAvatar = (posterId) => {
    const poster = users.find((user) => user.id == posterId);
    const avatarTemplate = poster["avatar_template"].replace("{size}", "25");
    const posterAvatar = avatarTemplate.startsWith("/")
      ? `${FORUM_AVATARS}/${avatarTemplate}`
      : avatarTemplate;
    postersAvatars += `
      <a href="${FORUM_USER}/${poster.username}" target="_blank">
        <img src="${posterAvatar}" title="${poster.username}" alt="Open ${poster.username}'s profile" width="25" height="25" />
      </a>
    `;
  };
  posters.forEach(displayPosterAvatar);

  const ifSummaryDisplay = () => {
    let summary = "";
    if (post["has_summary"]) {
      summary = `
      <p class='post-summary'>
        ${post.excerpt}
        <a class='post-read-more' href='${FORUM_TOPIC}/${post.slug}' target='_blank'>read more</a>
      </p>
      `;
    }
    return summary;
  };

  let postRow = `
  <tr> 
    <td class="post-topic">
      <span>
        <a class='post-title'
           href='${FORUM_TOPIC}/${post.slug}'
           target='_blank'>
          ${post.title}
        </a>
      </span>
      <div class='post-category'>
        <a 
          class='${category.name}'
          href='${FORUM_CATEGORY}/${category.name}'
          target='_blank'>
          ${category.longName}
        </a>
      </div>
      ${ifSummaryDisplay()}
    </td>
    <td class="post-posters">
      <div class="postersAvatars">${postersAvatars}</div>
    </td>
    <td class="post-replies">${getRes}</td>
    <td class="post-views"></td>
    <td class="post-activity">${formatDateDiff(Date.now(), post.bumped_at)}</td>
  </tr>`;
  postsContainer.innerHTML += postRow;
};

copyright.innerText = new Date().getFullYear();
