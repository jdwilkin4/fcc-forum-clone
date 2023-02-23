import {
  FORUM_TOPIC,
  FORUM_CATEGORY,
  FORUM_AVATARS,
  FORUM_API,
  FORUM_USER,
} from "./constants.js";

import {
  supportedTopicCategories,
  formatDateDiff,
  formatLargeNumber,
  parseActivityValueForSorting,
} from "./helpers.js";

// GLOBALS
const postsContainer = document.getElementById("posts-container");
const sortBtns = document.getElementsByName("sort");
const categoryBtns = document.getElementById("filter-btns");
const title = document.querySelector("main > h1");
const userListContainer = document.getElementById("online-user-list");

let isLoading = true;
let isError = false;
let forumData = null;
let categories = new Map();
// sorting flags will be null when page first rendered and user hasn't sorted anything
let sortingBy = null;
let sortingOrder = null;

// MAIN
document.addEventListener("DOMContentLoaded", () => {
  // DOMContentLoaded event fires when the HTML document has been completely parsed

  setLoadingState();
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
      // *****testing - clean up before sumbit
      console.log(forumData.topic_list.topics);
      // accessing sorting factor for replies
      // for (let obj of forumData.topic_list.topics) {
      //   console.log(obj.posts_count);
      // }
      // accessing sorting factor for views
      // for (let obj of forumData.topic_list.topics) {
      // console.log(obj.views);
      // }
      // accessing sorting factor for activity
      for (let obj of forumData.topic_list.topics) {
        console.log(typeof formatDateDiff(Date.now(), obj.bumped_at));
      }
      // ^****testing - clean up before submit
      displayPostList();
      displayCategories();
      displayUsers();
      displayFooter();
      activateSortBtns();
    })
    .catch((error) => {
      isError = true;
      console.log(error);
    })
    .finally(() => {
      isLoading = false;
    });
  // console.log(sortBtns);
});

// AUXILIARY FUNCTIONS
function displayPostList() {
  forumData["topic_list"].topics
    .filter((post) => post["category_id"] in supportedTopicCategories)
    // testing block - delete before submit
    // .sort(
    //   (prevPost, nextPost) =>
    //     parseActivityValueForSorting(
    //       formatDateDiff(Date.now(), prevPost.bumped_at)
    //     ) -
    //     parseActivityValueForSorting(
    //       formatDateDiff(Date.now(), nextPost.bumped_at)
    //     )
    // )
    // testing block - delete before submit
    .forEach(displayPost);

  function displayPost(post) {
    const category = supportedTopicCategories[post["category_id"]];
    const posters = post.posters.map(({ user_id: userId }) => userId);

    let postersAvatars = "";
    posters.forEach((userId) => {
      postersAvatars += getUserAvatarComponent(userId);
    });

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
        <td class="post-replies">${post.posts_count - 1}</td>
        <td class="post-views">${formatLargeNumber(post.views)}</td>
        <td class="post-activity">${formatDateDiff(
          Date.now(),
          post.bumped_at
        )}</td>
      </tr>`;
    postsContainer.innerHTML += postRow;
  }
}

function displayCategories() {
  // get categories and their counts
  forumData.topic_list.topics.forEach((topic) => {
    if (categories.has(topic.category_id)) {
      categories.set(topic.category_id, categories.get(topic.category_id) + 1);
      // make sure it only adds those categories we support
    } else if (topic.category_id in supportedTopicCategories) {
      categories.set(topic.category_id, 1);
    }
  });
  // create the buttons
  categories.forEach((value, key) => {
    categoryBtns.innerHTML += `
    <button
         name="filter-button" 
         value=${key}
         class=${supportedTopicCategories[key].name}
         >
         ${supportedTopicCategories[key].longName} (${value})
    </button>`;
  });
}

function displayUsers() {
  const users = forumData["users"];
  const ids = users.map((user) => user.id);

  let onlineUsersAvatars = `<span>Online (${ids.length}):</span>`;
  ids.forEach((id) => {
    onlineUsersAvatars += getUserAvatarComponent(id);
  });

  userListContainer.innerHTML = onlineUsersAvatars;
}

function displayFooter() {
  document.getElementById("footer").style.display = "block";
  document.getElementById("copyright").innerText = new Date().getFullYear();
}

function activateSortBtns() {
  sortBtns.forEach((btn) => btn.addEventListener("click", handleSortBtnClick));

  function handleSortBtnClick(e) {
    // testing block
    console.log("flags BEFORE click");
    console.log("sortingBy ", sortingBy);
    console.log("sortingOrder", sortingOrder);
    // end of testing block
    if (sortingBy !== e.target.value) {
      console.log("CASE button clicked NOT second time in a row");
      sortingBy = e.target.value;
      sortingOrder = "descending";
    } else {
      console.log("CASE button clicked second time in a row or more");
      sortingOrder === null || sortingOrder === "descending"
        ? (sortingOrder = "ascending")
        : (sortingOrder = "descending");
    }
    // testing block
    console.log("flags AFTER click");
    console.log("sortingBy ", sortingBy);
    console.log("sortingOrder", sortingOrder);
    // end of testing block
  }
}

function setLoadingState() {
  // let's make sure this code does not execute
  // when the state is not set to isLoading = true
  if (!isLoading) return;

  let titleText = "Loading";
  let titleUpdateInterval = null;
  let dots = [];

  title.innerHTML = titleText;
  titleUpdateInterval = setInterval(updateTitle, 150);

  function updateTitle() {
    if (!isLoading || isError) {
      // display appropriate title
      if (isError) {
        title.innerHTML = "Something went wrong :(";
      } else {
        title.innerHTML = "Latest topics";
      }

      // stop the title from changing to "Loading...""
      clearInterval(titleUpdateInterval);
      return;
    }

    if (dots.length < 3) {
      dots.push(".");
    } else {
      dots = [];
    }

    title.innerHTML = titleText + dots.join("");
  }
}

function getUserAvatarComponent(userId) {
  const users = forumData["users"];
  const user = users.find((user) => user.id == userId);
  let userAvatar = "";
  if (!user) return userAvatar;
  const avatarTemplate = user["avatar_template"].replace("{size}", "25");
  const userAvatarURL = avatarTemplate.startsWith("/")
    ? `${FORUM_AVATARS}/${avatarTemplate}`
    : avatarTemplate;
  userAvatar += `
    <a href="${FORUM_USER}/${user.username}" target="_blank">
      <img src="${userAvatarURL}" title="${user.username}" alt="Open ${user.username}'s profile" width="25" height="25" />
    </a>
  `;
  return userAvatar;
}
