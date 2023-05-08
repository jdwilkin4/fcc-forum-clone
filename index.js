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
const categoryButtons = document.getElementsByName("filter-button");

let isLoading = true;
let isError = false;
let forumData = {
  topics: [],
  users: [],
};
let categories = new Map();
let topicsToRender;
let refreshedTopics;
let refreshedUsers;
let usersToRender;
let sortBy = { state: "", order: 0 };
let filterBy = "";

// MAIN
document.addEventListener("DOMContentLoaded", () => {
  // DOMContentLoaded event fires when the HTML document has been completely parsed
  refreshPage();

  setInterval(refreshPage, 30000);
});
// AUXILIARY FUNCTIONS
function displayPostList(posts) {
  posts = filterTopics(posts, filterBy);
  posts = sortTopics(posts, sortBy.state);

  posts.forEach(displayPost);

  function displayPost(post) {
    const category = supportedTopicCategories[post.category_id];
    const posters = post.posters.map(({ user_id: userId }) => userId);

    let postersAvatars = "";
    posters.forEach((userId) => {
      postersAvatars += getUserAvatarComponent(userId);
    });

    const ifSummaryDisplay = () => {
      let summary = "";
      if (post.has_summary) {
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
  forumData.topics.forEach((topic) => {
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

function filterTopics(topics, filterBy) {
  if (!filterBy) return topics;
  let categoryId = parseInt(filterBy);
  let filteredTopics = topics.filter(
    (topic) => topic.category_id === categoryId
  );
  return filteredTopics;
}

function activateCategoryBtns() {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", handleClickFilter);
  });

  function handleClickFilter(e) {
    if (filterBy !== e.target.value) {
      filterBy = e.target.value;
    } else {
      filterBy = "";
    }

    let filteredTopics = filterTopics(topicsToRender, filterBy);
    postsContainer.innerHTML = "";
    displayPostList(filteredTopics);
  }
}

function displayUsers(users) {
  //const users = forumData.users;
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

function sortTopics(topics, toSortBy) {
  let sortedTopics = [...topics];

  if (sortBy.state !== "") {
    if (sortBy.order === 1) {
      if (sortBy.state !== "activity") {
        sortedTopics.sort((prev, next) => next[toSortBy] - prev[toSortBy]);
      } else {
        sortedTopics.sort(
          (prev, next) => new Date(next[toSortBy]) - new Date(prev[toSortBy])
        );
      }
    } else {
      if (sortBy.state !== "activity") {
        sortedTopics.sort((prev, next) => prev[toSortBy] - next[toSortBy]);
      } else {
        sortedTopics.sort(
          (prev, next) => new Date(prev[toSortBy]) - new Date(next[toSortBy])
        );
      }
    }
  }

  return sortedTopics;
}

function activateSortBtns() {
  sortBtns.forEach((btn) => {
    btn.addEventListener("click", handleSortBtnClick);
  });
}

function handleSortBtnClick(e) {
  let toSortBy =
    e.target.value === "replies"
      ? "posts_count"
      : e.target.value === "views"
      ? "views"
      : "bumped_at";

  if (toSortBy !== sortBy.state) {
    sortBy.order = 1;
  } else {
    sortBy.order = sortBy.order === 0 ? 1 : 0;
  }

  sortBy.state = toSortBy;
  let sortedTopics = sortTopics(topicsToRender, toSortBy);
  postsContainer.innerHTML = "";
  displayPostList(sortedTopics);
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
  const users = forumData.users;
  const user = users.find((user) => user.id == userId);
  let userAvatar = "";
  if (!user) return userAvatar;
  const avatarTemplate = user.avatar_template.replace("{size}", "25");
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

function refreshPage() {
  isLoading = true;
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
      refreshedTopics = data.topic_list.topics;
      refreshedUsers = data.users;
      forumData.users = processTopicsOrUsers(forumData.users, refreshedUsers);
      forumData.topics = processTopicsOrUsers(
        forumData.topics,
        refreshedTopics
      );
      topicsToRender = forumData.topics;
      usersToRender = forumData.users;
      categories = new Map();
      userListContainer.innerHTML = "";
      postsContainer.innerHTML = "";
      categoryBtns.innerHTML = "";
      sortBtns.forEach((btn) => {
        btn.removeEventListener("click", handleSortBtnClick);
      });
      displayCategories();
      activateCategoryBtns();
      activateSortBtns();
      displayUsers(usersToRender);
      displayPostList(topicsToRender);
      displayFooter();
    })
    .catch((error) => {
      isError = true;
      console.log(error);
    })
    .finally(() => {
      isLoading = false;
    });

  function processTopicsOrUsers(currArr, newArr) {
    if (!currArr.length) {
      const finalArr = [];
      newArr.forEach((topic) => {
        if (topic.hasOwnProperty("category_id")) {
          if (topic.category_id in supportedTopicCategories) {
            finalArr.push(topic);
          }
        } else {
          finalArr.push(topic);
        }
      });
    }

    const finalArr = [];
    const currMap = new Map();

    currArr.forEach((obj) => {
      if (obj.hasOwnProperty("category_id")) {
        if (obj.category_id in supportedTopicCategories) {
          currMap.set(obj.id, obj);
        }
      } else {
        currMap.set(obj.id, obj);
      }
    });
    for (const obj of newArr) {
      if (obj.hasOwnProperty("category_id")) {
        if (obj.category_id in supportedTopicCategories) {
          finalArr.push(obj);
          currMap.delete(obj.id);
        }
      } else {
        finalArr.push(obj);
        currMap.delete(obj.id);
      }
    }

    currMap.forEach((obj) => finalArr.push(obj));
    return finalArr;
  }
}
