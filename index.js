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
    const posts = forumData["topic_list"].topics;
    displayPostList(posts);
  })
  .catch((error) => {
    isError = true;
    console.log(error);
  })
  .finally(() => {
    isLoading = false;
  });
console.log(forumData);

const displayPostList = (postList) => {
  postList
    .filter((post) => post["category_id"] in supportedTopicCategories)
    .forEach(displayPost);
};

const displayPost = (post) => {
  const category = supportedTopicCategories[post["category_id"]];

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

  const displayRecentActivity = () => {
    const bumpedAt = new Date(post.bumped_at);
    const timeDifference = Date.now() - bumpedAt.getTime();
    const seconds = timeDifference / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (seconds < 60) return "1m";
    if (minutes < 60) return Math.round(minutes) + "m";
    if (hours < 24) return Math.round(hours) + "h";
    if (days < 30) return Math.round(days) + "d";
    return new Intl.DateTimeFormat("default", {
      month: "short",
      day: "numeric",
    }).format(bumpedAt.getTime()); // ex: Nov 15
  };

  let postRow = `
  <tr> 
    <td>
      <span>
        <a class='post-title' href='${FORUM_TOPIC}/${
    post.slug
  }' target='_blank'>
          ${post.title}
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
    <td class='post-statistic'></td>
    <td class='post-statistic'></td>
    <td class='post-statistic'>${displayRecentActivity()}</td>
  </tr>`;
  postsContainer.innerHTML += postRow;
};

copyright.innerText = new Date().getFullYear();
