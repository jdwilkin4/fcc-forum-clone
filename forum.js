export class Forum {
  postsUrl = "https://forum-proxy.freecodecamp.rocks/latest";
  isLoading = false;
  postsPerPage = 30;
  posts = Array(this.postsPerPage).fill(null);
  users = Array(10).fill(null);

  postsEl = document.querySelector("#fcc-table-body");
  usersEl = document.querySelector("#fcc-users");
  topicsEl = document.querySelector("#fcc-topics");

  async init() {
    console.log("\n~~~ freeCodeCamp forum clone initialised ~~~\n");
    // update data
    await this.update();
    // render table
    this.render();
  }

  render() {
    this.generatePosts();
    this.generateUsers();
    this.generateTopics();
  }

  async update() {
    let apiData = await this.fetchData();
    this.posts = apiData?.topic_list?.topics;
    this.users = apiData?.users;
  }

  generateTopics() {}

  generateUsers() {
    this.users.forEach((user) => {
      this.usersEl.append(this.generateAvatar(user));
    });
  }

  generateAvatar(userObj) {
    let { id, username, avatar_template } = userObj;

    let usersUrl = "https://forum.freecodecamp.org/u/";
    let imgSize = 50; // the number of pixels
    // as the name suggests, it's an url template
    // it is almost complete url but it includes /{size}/
    // which needs to be replaces with integer
    // representing image's size in pixels
    avatar_template = avatar_template.replace("{size}", imgSize);
    // there are two possible image's source urls
    // 1. image's source = avatar_template
    let imageSrc = avatar_template;
    // 2. when avatar_template includes 'discourse'
    // source = discourse cdn url + avatar_template
    if (!avatar_template.includes("discourse")) {
      imageSrc =
        "https://sea1.discourse-cdn.com/freecodecamp" + avatar_template;
    }

    let avatar = document.createElement("a");
    let image = document.createElement("img");

    avatar.href = usersUrl + id;
    avatar.title = username;

    image.src = imageSrc;
    image.loading = "lazy";
    image.width = 25;
    image.height = 25;

    avatar.append(image);

    return avatar;
  }

  generatePosts() {
    this.posts.forEach((post) => {
      // get post details
      const {
        id,
        title,
        views, // view count
        category_id,
        reply_count,
        posts_count,
        posters, // list of participants
        bumped_at, // last edit
      } = post;

      // create table elements
      let postRow = document.createElement("tr");
      let postTopic = document.createElement("td");
      let postPosters = document.createElement("td");
      let postReplies = document.createElement("td");
      let postViews = document.createElement("td");
      let postActivity = document.createElement("td");

      postRow.id = `fcc-post-${id}`;

      postTopic.textContent = title;
      // This is only a placeholder now
      // We want to display images
      let posters_avatars = posters.slice(0, 6).map((poster) => {
        let user = this.users.find((user) => poster.user_id === user.id);
        if (user) {
          return this.generateAvatar(user);
        }
      });
      postPosters.append(...posters_avatars);
      postReplies.textContent = reply_count;
      postViews.textContent = views;
      // The activity displays how many minutes past since last edit
      // so we have to get the difference between current time and post's last edit.
      // The difference of subtracting Date objects is in milisecons, but we need minutes
      // so we divide it with the following
      // 1 minute = 60 seconds = 60 000 milisecons => 1000 * 60
      // Finally, get rid of the decimal part by calling parseInt()
      postActivity.textContent = Number.parseInt(
        (Date.now() - new Date(bumped_at)) / (1000 * 60)
      );
      // Append cells to the row
      postRow.append(postTopic, postPosters, postViews, postActivity);
      // Append the row to the table's body
      this.postsEl.append(postRow);
    });
  }

  async fetchData() {
    return new Promise(async (res, rej) => {
      let jsonData,
        url = this.postsUrl;

      try {
        let response = await fetch(url);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        jsonData = await response.json();
      } catch (error) {
        rej({
          msg: "Requesting data from " + url + " failed.",
          err: String(error),
        });
      }
      res(jsonData);
    });
  }
}
