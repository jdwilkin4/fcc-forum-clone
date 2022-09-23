# freeCodeCamp forum clone<!-- omit in toc -->

## Description

The application is a clone of [freeCodeCamp's 30 most recent forum posts](https://forum.freecodecamp.org/latest). It is developed by the members of the freeCodeCamp community in order to develop soft skills, get more familiar with Fetch API, Git workflow and develop general coding skills. _And also, just for the sake of happy coding!_

## Table of contents<!-- omit in toc -->

- [How to contribute](#how-to-contribute)
- [How to install the dependencies](#how-to-install-the-dependencies)
- [Prettier pre-commit hook](#prettier-pre-commit-hook)
- [Script commands](#script-commands)
  - [browser-sync](#browser-sync)
  - [Prettier formatting script](#prettier-formatting-script)

## How to contribute

**Please note:**
If you are not marked as a collaborator for this project, then you will need to follow the first two steps.

If you are marked as a collaborator, then you can clone the repo `git clone https://github.com/jdwilkin4/fcc-forum-clone.git` and then follow the rest of the steps in order.

1.  Fork the repo ([How to fork a repo instructions](https://docs.github.com/en/get-started/quickstart/fork-a-repo))
2.  Clone the repo to your local machine. `git clone https://github.com/GITHUB-USERNAME-GOES-HERE/fcc-forum-clone.git`
3.  Change directories to the fcc-forum-clone repo `cd fcc-forum-clone`
4.  Install the dependencies `npm install`
5.  Create a branch and switch to that new branch `git checkout -b new-branch-name`
6.  Make some changes to the project
7.  Start the live server to see your new changes `npm start`
8.  Stage changes. `git add .`
9.  Commit changes to your local branch. `git commit -m "commit message"`
10. Push up your local branch and create a remote branch on GitHub `git push -u origin branch_name`
11. Submit a Pull request so that we can review your changes. Click compare, leave a comment and click the create pull request button.

## How to install the dependencies

In order to use the Prettier and browser-sync packages, you will need to install the package dependencies.

Make sure you are in the project directory `fcc-forum-clone`.
Then run `npm install` which will install the package dependencies.
This will add a `node_modules` folder to the root directory.
The `node_modules` folder has already been added to the `.gitignore` file because it should never be committed or included in the production build of the site.

## Prettier pre-commit hook

Whenever you push changes to GitHub, the Prettier pre-commit hook will automatically format all of your staged files. This ensures that the whole team has clean and consistent formatting throughout the entire project.

## Script commands

### browser-sync

The `npm start` command will start the local server at port 3000 and automatically open a new browser window. Whenever you make changes, it will hot reload the page.

To stop the local server, use the `Ctrl+C` command.

### Prettier formatting script

The `npm run format` command will format all of the files for the project.
