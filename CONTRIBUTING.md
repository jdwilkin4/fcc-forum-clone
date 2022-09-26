# FreeCodeCamp forum clone's contributing guide

## Documentation

Please, make sure to read:

- our [code of conduct](./CODE_OF_CONDUCT.md)
- and [README](./README.md)

## Issues

### Creating issues

Feel free to check out [our codebase](https://github.com/jdwilkin4/fcc-forum-clone). If you think, that something could be added, fixed, improved - make sure, that there is no open issue for that already by going [here](https://github.com/jdwilkin4/fcc-forum-clone/issues).

If you are confident, that your issue won't be a duplicate - go ahead and [create it](https://github.com/jdwilkin4/fcc-forum-clone/issues/new/)!

If you have some ideas about possible changes, but not sure enough, please share your thoughts by creating new thread in [the discussions](https://github.com/jdwilkin4/fcc-forum-clone/discussions).

### Picking up an issue to work on

Browse through [opened issues](https://github.com/jdwilkin4/fcc-forum-clone/issues). Feel to start working on any issue which does not have have assignee yet!

If you are [collaborator](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-personal-account-settings/permission-levels-for-a-personal-account-repository#collaborator-access-for-a-repository-owned-by-a-personal-account) - assign yourself to the issue you want to work on.

If you are not collaborator - would be better to left a comment in the issue thread, so we know that you are working on it.

In any case - make sure to use the issue thread to ask questions about the issue if you need!

## Making changes

If you are experienced with Git workflow, **How to contribute** section of our [README](./README.md) may be enough to work on the issue you picked up!

If you are somewhat new to Git and GitHub - in the below will be couple more tips and useful links about all this!

### Installing git

If you don't have git on your machine, [install it](https://help.github.com/articles/set-up-git/).

### Installing dependencies

Instructions about this can be found in [README](./README.md).

### Forking the repo

Fork this repository by clicking on the fork button on the top of this page.
This will create a copy of this repository in your account.

- Using GitHub Desktop:
  - [Getting started with GitHub Desktop](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/getting-started-with-github-desktop) will guide you through setting up Desktop.
  - Once Desktop is set up, you can use it to [fork the repo](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/cloning-and-forking-repositories-from-github-desktop)!

### Creating local copy of the repo (aka cloning)

Now clone the forked repository to your machine. Go to your GitHub account, open the forked repository, click on the code button and then click the copy to clipboard icon.

Open a terminal and run the following git command:

```
git clone url-you-just-copied
```

where `url-you-just-copied` is the url to this repository (your fork of this project).

### Creating new branch to start dealing with the issue

Change to the contrast ratio repo directory on your computer (if you are not already there):

```
cd contrast-ratio-repo
```

Now create a branch and switch to that new branch using the `git checkout` command. _One way to name a branch would be: `<number-of-issue>-<type-of-changes>-<what-the-issue-is-about>`_

```
git checkout -b your-new-branch-name
```

### Commit changes and pushing them

Commit the changes once you are happy with them.
If you go to the project directory and execute the command `git status`, you'll see there are changes.
Add those changes to the branch you just created using the `git add` command:

```
git add changed-file-name
```

Now commit those changes to your local branch using the `git commit` command. _Try to make commit message descriptive, but not super verbose!_

```
git commit -m "commit message"
```

Push your local branch and create a remote branch on GitHub using the command `git push` :

```
git push -u origin branch-name
```

### Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

- Please follow all instructions in the template so that we can review your PR.
- Don't forget to [link PR to issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
  Once you submit your PR, a team member will review your proposal. We may ask questions or request for additional information.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. You can make any other changes in your fork, then commit them to your branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.

### Still a little bit lost?

- Check out [this video](https://www.youtube.com/watch?v=RGOj5yH7evk) from freeCodeCamp youTube channel about basics of Git and GitHub.
- Don't be shy to ask us about anything related to the project and working on it! Depending on the nature of your question, use PR threads, issue threads or the discussions!
