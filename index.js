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
let forumData = null;
let categories = new Map();
let topicsToRender;
let refreshedPage = false;
let oldTopics;
let refreshedTopics;
let users;
let updatedUsers;
let sortBy = { state: "", order: 0 };
let filterBy = "";

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
      users = forumData.users;
      console.log(users.length);
      oldTopics = forumData.topic_list.topics;
      topicsToRender = forumData.topic_list.topics;
      displayPostList(topicsToRender);
      displayCategories();
      activateCategoryBtns();
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
});

refreshPage();

// AUXILIARY FUNCTIONS
function displayPostList(posts) {
  posts = filterTopics(posts, filterBy);
  posts = sortTopics(posts, sortBy.state);

  posts
    .filter((post) => post.category_id in supportedTopicCategories)
    .forEach(displayPost);

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

function filterTopics(topics, filterBy) {
  let filteredTopics = [...topics];
  if (filterBy !== "") {
    filteredTopics = topics.filter(
      (topic) => topic.category_id === parseInt(filterBy)
    );
  } else {
    filteredTopics = [...topics];
  }
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

function displayUsers() {
  const users = forumData.users;
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

function sortTopics(topics, key) {
  let sortedTopics = [...topics];

  if (sortBy.state !== "") {
    console.log(sortBy);
    if (sortBy.order === 1) {
      if (sortBy.state !== "activity") {
        sortedTopics.sort((prev, next) => next[key] - prev[key]);
      } else {
        sortedTopics.sort(
          (prev, next) => new Date(next[key]) - new Date(prev[key])
        );
      }
    } else {
      if (sortBy.state !== "activity") {
        sortedTopics.sort((prev, next) => prev[key] - next[key]);
      } else {
        sortedTopics.sort(
          (prev, next) => new Date(prev[key]) - new Date(next[key])
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

  function handleSortBtnClick(e) {
    let key =
      e.target.value === "replies"
        ? "posts_count"
        : e.target.value === "views"
        ? "views"
        : "bumped_at";

    if (key !== sortBy.state) {
      sortBy.order = 1;
    } else {
      sortBy.order = sortBy.order === 0 ? 1 : 0;
    }

    sortBy.state = key;
    let sortedTopics = sortTopics(topicsToRender, key);
    postsContainer.innerHTML = "";
    displayPostList(sortedTopics);
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
  setInterval(() => {
    //refreshedPage = true;
    isLoading = false;
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
        updatedUsers = data.users;
        refreshedTopics = data.topic_list.topics;
        categories = new Map();
        postsContainer.innerHTML = "";
        categoryBtns.innerHTML = "";
        //userListContainer.innerHTML = "";
        //takeNewTopics();
        //takeNewUsers();
        displayCategories();
        activateCategoryBtns();
        displayUsers();
        //activateSortBtns();
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
  }, 30000);

  function takeNewTopics() {
    let saveTopics = [...refreshedTopics];
    let newArr = [];
    let newTopic = "";

    //run through oldTopics and refreshed topics and update all the content
    //of the old topics that exist in refreshedTopics or if there is one new
    //topic, push it in an array to save it
    for (let i = 0; i < oldTopics.length; i++) {
      for (let j = 0; j < saveTopics.length; j++) {
        if (saveTopics[j] !== null && saveTopics[j].id === oldTopics[i].id) {
          oldTopics[i] = saveTopics[j];
          saveTopics[j] = null;
        }
      }

      if (i === 29) {
        for (let v in saveTopics) {
          if (saveTopics[v] !== null) {
            newTopic = saveTopics[v];
            let count1 = 0;
            if (newArr.length === 0) {
              newArr.push(newTopic);
            } else {
              for (let k in newArr) {
                if (newTopic.id === newArr[k].id) {
                  count1++;
                }
              }

              if (count1 === 0) {
                newArr.push(newTopic);
              }
            }
          }
        }
      }
    }

    for (let i in forumData.topic_list.topics) {
      for (let j in oldTopics) {
        if (oldTopics[j].id === forumData.topic_list.topics[i].id) {
          forumData.topic_list.topics[i] = oldTopics[j];
        }
      }
    }

    console.log(newArr);

    //run through the array that saved all new topics
    //if the topics exist already in forumData just update them
    //but if they are not push them
    if (newArr.length > 0) {
      for (let i in newArr) {
        let count = 0;
        for (let j in forumData.topic_list.topics) {
          if (forumData.topic_list.topics[j].id === newArr[i].id) {
            forumData.topic_list.topics[j] = newArr[i];
            count++;
          }
        }
        if (count === 0) {
          forumData.topic_list.topics.push(newArr[i]);
        }
      }
    }

    if (sortBy.state === "" && filterBy === "") {
      forumData.topic_list.topics = forumData.topic_list.topics.sort(
        (prev, next) => new Date(next.bumped_at) - new Date(prev.bumped_at)
      );
      let topic = forumData.topic_list.topics.pop();
      forumData.topic_list.topics.unshift(topic);
    }
    topicsToRender = [...forumData.topic_list.topics];
    oldTopics = [...refreshedTopics];
  }
}

/*function takeNewUsers() {
   for (let i in users) {

      let count = 0;
      for(let j in updatedUsers) {
        if (updatedUsers[j] !== null && updatedUsers[j].id === users[i].id) {
          count++
        }
      }
      
      if(count === 0) {
        console.log(updatedUsers[j])
        forumData.users.push(updatedUsers[j])
      }
   }

   users = [...updatedUsers]
   console.log(forumData.users.length);
   
}*/
