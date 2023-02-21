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
      displayPostList();
      displayCategories();
      displayUsers();
      displayFooter();
      activateSortBtns();
      activeCollapsableUserList();
    })
    .catch((error) => {
      isError = true;
      console.log(error);
    })
    .finally(() => {
      isLoading = false;
    });
});

// AUXILIARY FUNCTIONS
function displayPostList() {
  forumData["topic_list"].topics
    .filter((post) => post["category_id"] in supportedTopicCategories)
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

//handles the collapsing/expanding transitions
function activeCollapsableUserList() {
  let mouseOverTimeout;
  let mouseLeaveTimeout;
  userListContainer.addEventListener("mouseover", handleExpand);
  userListContainer.addEventListener("mouseleave", handleCollapse);

  function handleExpand() {
    //makes sure that it doesnt create multiple timeouts (because of the mouseover event)
    if (!mouseOverTimeout) {
      mouseOverTimeout = setTimeout(
        () => userListContainer.classList.remove("collapsed"),
        1000
      );
    }
    //clear the mouseover timeout as well as the reference to skip the animation
    clearTimeout(mouseLeaveTimeout);
    mouseLeaveTimeout = null;
  }

  function handleCollapse() {
    mouseLeaveTimeout = setTimeout(
      () => userListContainer.classList.add("collapsed"),
      1000
    );
    //clear the mouseover timeout as well as the reference to skip the animation
    clearTimeout(mouseOverTimeout);
    mouseOverTimeout = null;
  }
}

function displayFooter() {
  document.getElementById("footer").style.display = "block";
  document.getElementById("copyright").innerText = new Date().getFullYear();
}

function activateSortBtns() {
  sortBtns.forEach((btn) => btn.addEventListener("click", handleSortBtnClick));

  function handleSortBtnClick(e) {
    console.log(e.target.value);
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
