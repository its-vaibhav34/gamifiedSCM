document.addEventListener("DOMContentLoaded", () => {
  console.log("Document loaded and ready");
  
  // Navigation
  const navLinks = document.querySelectorAll("nav ul li a");
  const sections = document.querySelectorAll("main section");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Update active nav link
      document.querySelector("nav ul li.active").classList.remove("active");
      this.parentElement.classList.add("active");

      // Show corresponding section
      const targetId = this.getAttribute("href").substring(1);
      sections.forEach((section) => {
        section.classList.add("hidden-section");
        section.classList.remove("active-section");
      });
      document.getElementById(targetId).classList.remove("hidden-section");
      document.getElementById(targetId).classList.add("active-section");
    });
  });

  // Start Journey Button
  const startJourneyBtn = document.getElementById("start-journey");
  if (startJourneyBtn) {
    startJourneyBtn.addEventListener("click", () => {
      // Navigate to challenges section
      document.querySelector("nav ul li.active").classList.remove("active");
      document.querySelector('nav ul li a[href="#challenges"]').parentElement.classList.add("active");

      sections.forEach((section) => {
        section.classList.add("hidden-section");
        section.classList.remove("active-section");
      });
      document.getElementById("challenges").classList.remove("hidden-section");
      document.getElementById("challenges").classList.add("active-section");
    });
  }

  // Challenge Filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const challengeCards = document.querySelectorAll(".challenge-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Update active filter button
      document.querySelector(".filter-btn.active").classList.remove("active");
      this.classList.add("active");

      const difficulty = this.getAttribute("data-difficulty");

      challengeCards.forEach((card) => {
        if (difficulty === "all" || card.getAttribute("data-difficulty") === difficulty) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Leaderboard Tabs
  const tabBtns = document.querySelectorAll(".tab-btn");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Update active tab button
      document.querySelector(".tab-btn.active").classList.remove("active");
      this.classList.add("active");

      // In a real app, this would fetch different leaderboard data
      const period = this.getAttribute("data-period");
      console.log(`Showing ${period} leaderboard`);
    });
  });

  // Challenge Modals
  console.log("Setting up challenge modals");
  
  // First, hide all modals initially
  const allModals = document.querySelectorAll(".modal");
  allModals.forEach(modal => {
    modal.style.display = "none";
  });
  
  // Debug: List all available modals
  console.log("Available modals:");
  allModals.forEach(m => console.log(m.id));

  // Open correct modal when challenge button is clicked
  const startChallengeBtns = document.querySelectorAll(".start-challenge-btn");
  console.log(`Found ${startChallengeBtns.length} challenge buttons`);
  
  startChallengeBtns.forEach((btn) => {
    const challenge = btn.getAttribute("data-challenge");
    console.log(`Setting up button for challenge: ${challenge}`);
    
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      const challenge = this.getAttribute("data-challenge");
      console.log(`Challenge button clicked: ${challenge}`);

      if (challenge) {
        // First, close any open modals
        allModals.forEach(modal => {
          modal.style.display = "none";
        });

        // Then open the correct modal
        const modalId = `challenge-modal-${challenge}`;
        const modal = document.getElementById(modalId);
        
        if (modal) {
          modal.style.display = "block";
          console.log(`Opening modal: ${modalId}`);
          
          // Initialize the challenge
          initializeChallenge(challenge);
        } else {
          console.error(`No modal found with ID: ${modalId}`);
        }
      } else {
        console.error("Button missing data-challenge attribute.");
      }
    });
  });

  // Close modals when clicking the close button
  const closeModalBtns = document.querySelectorAll(".close-modal");
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", function() {
      const modal = this.closest(".modal");
      if (modal) {
        modal.style.display = "none";
        console.log(`Modal closed: ${modal.id}`);
      }
    });
  });

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
      console.log(`Modal closed by clicking outside: ${event.target.id}`);
    }
  });

  // Challenge state objects
  const challengeStates = {
    "first-commit": {
      repoInitialized: false,
      filesInWorkingDir: [],
      filesInStagingArea: [],
      commits: [],
      currentBranch: "master"
    },
    "tracking": {
      repoInitialized: true,
      filesInWorkingDir: ["index.html"],
      filesInStagingArea: [],
      commits: [{
        hash: generateCommitHash(),
        message: "Initial commit",
        files: ["index.html"],
        branch: "master"
      }],
      fileContents: {
        "index.html": "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>"
      },
      fileModified: false,
      currentBranch: "master"
    },
    "branching": {
      repoInitialized: true,
      filesInWorkingDir: [],
      filesInStagingArea: [],
      commits: [{
        hash: generateCommitHash(),
        message: "Initial commit",
        files: ["index.html"],
        branch: "master"
      }],
      branches: ["master"],
      currentBranch: "master",
      fileContents: {
        "index.html": "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>"
      }
    },
    "merge": {
      repoInitialized: true,
      filesInWorkingDir: [],
      filesInStagingArea: [],
      commits: [{
        hash: generateCommitHash(),
        message: "Initial commit",
        files: ["index.html"],
        branch: "master"
      }],
      branches: ["master"],
      currentBranch: "master",
      fileContents: {
        "index.html": "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n  <p>Welcome to my website.</p>\n</body>\n</html>"
      },
      conflictResolved: false
    },
    "rebase": {
      repoInitialized: true,
      filesInWorkingDir: [],
      filesInStagingArea: [],
      commits: [{
        hash: generateCommitHash(),
        message: "Initial commit",
        files: ["index.html"],
        branch: "master"
      }],
      branches: ["master"],
      currentBranch: "master",
      fileContents: {
        "index.html": "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n  <p>Welcome to my website.</p>\n</body>\n</html>"
      }
    },
    "cicd": {
      repoInitialized: true,
      filesInWorkingDir: ["index.html", "app.js", "styles.css"],
      filesInStagingArea: [],
      commits: [{
        hash: generateCommitHash(),
        message: "Initial commit",
        files: ["index.html", "app.js", "styles.css"],
        branch: "master"
      }],
      branches: ["master"],
      currentBranch: "master",
      githubConnected: false,
      workflowCreated: false
    }
  };

  // Initialize challenge state
  function initializeChallenge(challenge) {
    console.log(`Initializing challenge: ${challenge}`);
    
    // Get challenge state
    const state = challengeStates[challenge];
    
    // Update UI based on challenge state
    updateWorkingDirectory(challenge);
    updateStagingArea(challenge);
    updateRepository(challenge);
    
    // Set up terminal input for this challenge
    setupTerminalInput(challenge);
    
    // Reset progress steps
    resetProgressSteps(challenge);
  }
  
  // Set up terminal input for a specific challenge
  function setupTerminalInput(challenge) {
    const terminalInput = document.getElementById(`terminal-input-${challenge}`);
    if (terminalInput) {
      // Remove any existing event listeners
      const newTerminalInput = terminalInput.cloneNode(true);
      terminalInput.parentNode.replaceChild(newTerminalInput, terminalInput);
      
      // Add new event listener
      newTerminalInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          const command = this.value.trim();
          this.value = "";
          
          // Add command to output
          const terminalOutput = document.getElementById(`terminal-output-${challenge}`);
          const commandLine = document.createElement("div");
          commandLine.className = "output-line";
          commandLine.innerHTML = `<span class="prompt">$</span> ${command}`;
          terminalOutput.appendChild(commandLine);
          
          // Process command for this challenge
          processGitCommand(command, challenge);
          
          // Scroll to bottom of terminal
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
      });
    }
  }

  // Process Git commands for a specific challenge
  function processGitCommand(command, challenge) {
    const terminalOutput = document.getElementById(`terminal-output-${challenge}`);
    const output = document.createElement("div");
    output.className = "output-line";
    
    const state = challengeStates[challenge];
    
    // Process different Git commands based on the challenge
    if (command === "help") {
      output.innerHTML = 'Available commands: git init, git status, touch <filename>, git add <filename>, git commit -m "<message>", git branch, git checkout, git merge, git rebase, git log, git diff, clear';
    } else if (command === "git init") {
      if (!state.repoInitialized) {
        state.repoInitialized = true;
        output.textContent = "Initialized empty Git repository";
        updateProgressStep("init", challenge);
      } else {
        output.textContent = "Git repository already initialized";
      }
    } else if (command === "git status") {
      if (!state.repoInitialized && challenge === "first-commit") {
        output.textContent = "Not a git repository. Use git init to create a new repository.";
      } else {
        let status = `On branch ${state.currentBranch}\n\n`;
        
        if (state.filesInStagingArea.length > 0) {
          status += "Changes to be committed:\n";
          state.filesInStagingArea.forEach((file) => {
            status += `  (use "git restore --staged <file>..." to unstage)\n        new file:   ${file}\n`;
          });
          status += "\n";
        }
        
        if (state.filesInWorkingDir.length > 0) {
          status += "Untracked files:\n";
          status += '  (use "git add <file>..." to include in what will be committed)\n';
          state.filesInWorkingDir.forEach((file) => {
            status += `        ${file}\n`;
          });
        }
        
        if (state.fileModified && challenge === "tracking") {
          status += "Modified files:\n";
          status += '  (use "git add <file>..." to update what will be committed)\n';
          status += `        index.html\n`;
          updateProgressStep("status", challenge);
        }
        
        if (state.filesInWorkingDir.length === 0 && state.filesInStagingArea.length === 0 && !state.fileModified) {
          status += "nothing to commit, working tree clean";
        }
        
        output.innerHTML = status.replace(/\n/g, "<br>");
      }
    } else if (command.startsWith("touch ")) {
      if (!state.repoInitialized && challenge === "first-commit") {
        output.textContent = "Not a git repository. Use git init to create a new repository.";
      } else {
        const filename = command.split(" ")[1];
        if (filename) {
          if (!state.filesInWorkingDir.includes(filename) && !state.filesInStagingArea.includes(filename)) {
            state.filesInWorkingDir.push(filename);
            state.fileContents = state.fileContents || {};
            state.fileContents[filename] = "";
            output.textContent = `Created file: ${filename}`;
            updateWorkingDirectory(challenge);
            
            if (filename === "index.html" && challenge === "first-commit") {
              updateProgressStep("create", challenge);
            }
            
            if (challenge === "branching" && state.currentBranch === "feature-branch") {
              updateProgressStep("modify", challenge);
            }
          } else {
            output.textContent = `File ${filename} already exists`;
          }
        } else {
          output.textContent = "Please specify a filename";
        }
      }
    } else if (command.startsWith("git add ")) {
      if (!state.repoInitialized && challenge === "first-commit") {
        output.textContent = "Not a git repository. Use git init to create a new repository.";
      } else {
        const filename = command.split(" ")[2];
        if (filename === ".") {
          // Add all files
          if (state.filesInWorkingDir.length > 0 || state.fileModified) {
            state.filesInStagingArea = [...state.filesInStagingArea, ...state.filesInWorkingDir];
            state.filesInWorkingDir = [];
            
            if (state.fileModified && challenge === "tracking") {
              state.filesInStagingArea.push("index.html");
              state.fileModified = false;
              updateProgressStep("add", challenge);
            }
            
            output.textContent = "Added all files to staging area";
            updateWorkingDirectory(challenge);
            updateStagingArea(challenge);
            
            if (state.filesInStagingArea.includes("index.html") && challenge === "first-commit") {
              updateProgressStep("add", challenge);
            }
          } else {
            output.textContent = "No files to add";
          }
        } else if (filename) {
          const fileIndex = state.filesInWorkingDir.indexOf(filename);
          if (fileIndex !== -1) {
            state.filesInWorkingDir.splice(fileIndex, 1);
            state.filesInStagingArea.push(filename);
            output.textContent = `Added ${filename} to staging area`;
            updateWorkingDirectory(challenge);
            updateStagingArea(challenge);
            
            if (filename === "index.html" && challenge === "first-commit") {
              updateProgressStep("add", challenge);
            }
          } else if (state.fileModified && filename === "index.html" && challenge === "tracking") {
            state.filesInStagingArea.push("index.html");
            state.fileModified = false;
            output.textContent = `Added ${filename} to staging area`;
            updateStagingArea(challenge);
            updateProgressStep("add", challenge);
          } else {
            output.textContent = `File ${filename} not found in working directory`;
          }
        } else {
          output.textContent = "Please specify a filename or use . to add all files";
        }
      }
    } else if (command.startsWith("git commit -m ")) {
      if (!state.repoInitialized && challenge === "first-commit") {
        output.textContent = "Not a git repository. Use git init to create a new repository.";
      } else {
        if (state.filesInStagingArea.length > 0) {
          const messageMatch = command.match(/"([^"]+)"/);
          if (messageMatch) {
            const message = messageMatch[1];
            const newCommit = {
              hash: generateCommitHash(),
              message: message,
              files: [...state.filesInStagingArea],
              branch: state.currentBranch
            };
            
            state.commits.push(newCommit);
            output.textContent = `[${state.currentBranch} ${state.commits.length === 1 ? "(root-commit) " : ""}${newCommit.hash.substring(0, 7)}] ${message}\n ${state.filesInStagingArea.length} file${state.filesInStagingArea.length > 1 ? "s" : ""} changed\n create mode 100644 ${state.filesInStagingArea.join("\n create mode 100644 ")}`;
            state.filesInStagingArea = [];
            updateStagingArea(challenge);
            updateRepository(challenge);
            
            if (challenge === "first-commit") {
              updateProgressStep("commit", challenge);
            } else if (challenge === "tracking") {
              updateProgressStep("commit", challenge);
            } else if (challenge === "branching" && state.currentBranch === "feature-branch") {
              updateProgressStep("commit", challenge);
            }
          } else {
            output.textContent = "Please provide a commit message in quotes";
          }
        } else {
          output.textContent = "Nothing to commit, working tree clean";
        }
      }
    } else if (command === "git diff") {
      if (challenge === "tracking" && state.fileModified) {
        output.innerHTML = `diff --git a/index.html b/index.html<br>index 1234567..abcdefg 100644<br>--- a/index.html<br>+++ b/index.html<br>@@ -3,6 +3,7 @@<br> &lt;html&gt;<br> &lt;head&gt;<br>   &lt;title&gt;My Website&lt;/title&gt;<br>+  &lt;meta charset="UTF-8"&gt;<br> &lt;/head&gt;<br> &lt;body&gt;<br>   &lt;h1&gt;Hello World&lt;/h1&gt;`;
        updateProgressStep("diff", challenge);
      } else {
        output.textContent = "No changes to show";
      }
    } else if (command === "git log") {
      if (state.commits.length > 0) {
        let log = "";
        for (let i = state.commits.length - 1; i >= 0; i--) {
          const commit = state.commits[i];
          log += `commit ${commit.hash}<br>Author: Git User &lt;user@example.com&gt;<br>Date: ${new Date().toISOString()}<br><br>    ${commit.message}<br><br>`;
        }
        output.innerHTML = log;
        
        if (challenge === "tracking") {
          updateProgressStep("log", challenge);
        }
      } else {
        output.textContent = "No commits yet";
      }
    } else if (command === "git log --oneline") {
      if (state.commits.length > 0) {
        let log = "";
        for (let i = state.commits.length - 1; i >= 0; i--) {
          const commit = state.commits[i];
          log += `${commit.hash.substring(0, 7)} ${commit.message}<br>`;
        }
        output.innerHTML = log;
        
        if (challenge === "rebase") {
          updateProgressStep("verify", challenge);
        }
      } else {
        output.textContent = "No commits yet";
      }
    } else if (command.startsWith("git branch")) {
      if (command === "git branch") {
        // List branches
        let branchList = "";
        state.branches.forEach(branch => {
          branchList += (branch === state.currentBranch ? "* " : "  ") + branch + "<br>";
        });
        output.innerHTML = branchList || "No branches yet";
      } else {
        // Create branch
        const branchName = command.split(" ")[2];
        if (branchName) {
          if (!state.branches.includes(branchName)) {
            state.branches.push(branchName);
            output.textContent = `Created branch ${branchName}`;
            
            if ((challenge === "branching" || challenge === "merge") && branchName === "feature-branch") {
              updateProgressStep("create-branch", challenge);
            } else if (challenge === "rebase" && branchName === "feature-branch") {
              updateProgressStep("create-branch", challenge);
            }
          } else {
            output.textContent = `Branch ${branchName} already exists`;
          }
        } else {
          output.textContent = "Please specify a branch name";
        }
      }
    } else if (command.startsWith("git checkout")) {
      const branchName = command.split(" ")[2];
      if (branchName) {
        if (state.branches.includes(branchName)) {
          state.currentBranch = branchName;
          output.textContent = `Switched to branch '${branchName}'`;
          
          if ((challenge === "branching" || challenge === "merge") && branchName === "feature-branch") {
            updateProgressStep("checkout", challenge);
          } else if (challenge === "branching" && branchName === "master") {
            // Check if we've already made commits on feature-branch
            const featureCommits = state.commits.filter(c => c.branch === "feature-branch");
            if (featureCommits.length > 0) {
              updateProgressStep("merge", challenge);
            }
          }
        } else {
          output.textContent = `Branch ${branchName} does not exist`;
        }
      } else {
        output.textContent = "Please specify a branch name";
      }
    } else if (command.startsWith("git merge")) {
      const branchName = command.split(" ")[2];
      if (branchName) {
        if (state.branches.includes(branchName)) {
          if (state.currentBranch !== branchName) {
            // Check if there are commits on the branch to merge
            const branchCommits = state.commits.filter(c => c.branch === branchName);
            if (branchCommits.length > 0) {
              if (challenge === "merge" && branchName === "feature-branch") {
                output.innerHTML = "Auto-merging index.html<br>CONFLICT (content): Merge conflict in index.html<br>Automatic merge failed; fix conflicts and then commit the result.";
                updateProgressStep("merge-conflict", challenge);
              } else {
                output.textContent = `Merging branch '${branchName}' into ${state.currentBranch}`;
                
                if (challenge === "branching" && branchName === "feature-branch") {
                  updateProgressStep("merge", challenge);
                }
              }
            } else {
              output.textContent = `Nothing to merge from ${branchName}`;
            }
          } else {
            output.textContent = "Cannot merge a branch into itself";
          }
        } else {
          output.textContent = `Branch ${branchName} does not exist`;
        }
      } else {
        output.textContent = "Please specify a branch name";
      }
    } else if (command.startsWith("git branch -d") || command.startsWith("git branch --delete")) {
      const branchName = command.split(" ")[3] || command.split(" ")[2];
      if (branchName) {
        if (state.branches.includes(branchName)) {
          if (state.currentBranch !== branchName) {
            // Remove the branch
            state.branches = state.branches.filter(b => b !== branchName);
            output.textContent = `Deleted branch ${branchName}`;
            
            if (challenge === "branching" && branchName === "feature-branch") {
              updateProgressStep("delete", challenge);
            }
          } else {
            output.textContent = "Cannot delete the currently checked out branch";
          }
        } else {
          output.textContent = `Branch ${branchName} does not exist`;
        }
      } else {
        output.textContent = "Please specify a branch name";
      }
    } else if (command.startsWith("git rebase")) {
      const branchName = command.split(" ")[2];
      if (branchName) {
        if (state.branches.includes(branchName)) {
          if (state.currentBranch !== branchName) {
            output.textContent = `Rebasing ${state.currentBranch} onto ${branchName}`;
            
            if (challenge === "rebase" && branchName === "master" && state.currentBranch === "feature-branch") {
              updateProgressStep("rebase", challenge);
              
              // Simulate conflict
              output.innerHTML += "<br>CONFLICT (content): Merge conflict in index.html<br>Resolve all conflicts manually, mark them as resolved with git add, and then run git rebase --continue";
            }
          } else {
            output.textContent = "Cannot rebase a branch onto itself";
          }
        } else {
          output.textContent = `Branch ${branchName} does not exist`;
        }
      } else {
        output.textContent = "Please specify a branch name";
      }
    } else if (command === "git rebase --continue") {
      if (challenge === "rebase") {
        output.textContent = "Continuing rebase";
        updateProgressStep("resolve", challenge);
      } else {
        output.textContent = "No rebase in progress";
      }
    } else if (command === "edit index.html") {
      if (challenge === "tracking") {
        output.innerHTML = "Editing index.html...<br>Added &lt;meta charset=\"UTF-8\"&gt; to the head section";
        state.fileModified = true;
        updateProgressStep("modify", challenge);
      } else if (challenge === "merge" && state.currentBranch === "master") {
        output.innerHTML = "Editing index.html...<br>Modified content in the body section";
        updateProgressStep("modify-main", challenge);
      } else if (challenge === "merge" && state.currentBranch === "feature-branch") {
        output.innerHTML = "Editing index.html...<br>Added new content in the body section";
        updateProgressStep("modify-branch", challenge);
      } else if (challenge === "branching" && state.currentBranch === "feature-branch") {
        output.innerHTML = "Editing index.html...<br>Added new feature to the page";
        updateProgressStep("modify", challenge);
      } else {
        output.textContent = "Editing index.html...";
      }
    } else if (command === "resolve conflict") {
      if (challenge === "merge" || challenge === "rebase") {
        output.innerHTML = "Conflict resolved in index.html<br>Use git add index.html to mark as resolved";
        state.conflictResolved = true;
        updateProgressStep("resolve", challenge);
      } else {
        output.textContent = "No conflicts to resolve";
      }
    } else if (command === "mkdir -p .github/workflows") {
      if (challenge === "cicd") {
        output.textContent = "Created directory structure .github/workflows";
        updateProgressStep("create-workflow", challenge);
      } else {
        output.textContent = "Directory created";
      }
    } else if (command === "create workflow file") {
      if (challenge === "cicd") {
        output.innerHTML = "Created .github/workflows/ci.yml with basic CI configuration";
        updateProgressStep("define-steps", challenge);
      } else {
        output.textContent = "File created";
      }
    } else if (command === "git remote add origin https://github.com/user/repo.git") {
      if (challenge === "cicd") {
        output.textContent = "Added remote origin";
        state.githubConnected = true;
        updateProgressStep("create-repo", challenge);
      } else {
        output.textContent = "Remote added";
      }
    } else if (command === "git push -u origin master") {
      if (challenge === "cicd" && state.githubConnected) {
        output.innerHTML = "Pushing to origin<br>Enumerating objects: 5, done.<br>Counting objects: 100% (5/5), done.<br>Writing objects: 100% (5/5), 1.2 KiB | 1.2 MiB/s, done.<br>Total 5 (delta 0), reused 0 (delta 0)<br>To https://github.com/user/repo.git<br> * [new branch]      master -> master<br>Branch 'master' set up to track remote branch 'master' from 'origin'.";
        updateProgressStep("commit-push", challenge);
        updateProgressStep("trigger", challenge);
      } else {
        output.textContent = "Pushed to remote";
      }
    } else if (command === "check workflow status") {
      if (challenge === "cicd") {
        output.innerHTML = "Workflow run #1: ✅ Success<br>Jobs: build (✅), test (✅), deploy (✅)<br>Duration: 1m 24s";
        updateProgressStep("monitor", challenge);
      } else {
        output.textContent = "No workflows found";
      }
    } else if (command === "clear") {
      // Clear terminal output
      const terminalOutput = document.getElementById(`terminal-output-${challenge}`);
      while (terminalOutput.firstChild) {
        terminalOutput.removeChild(terminalOutput.firstChild);
      }
      return; // Don't add output line
    } else {
      output.textContent = `Command not recognized: ${command}`;
    }
    
    terminalOutput.appendChild(output);
  }

  function updateWorkingDirectory(challenge) {
    const workingDirectory = document.getElementById(`working-directory-${challenge}`);
    const state = challengeStates[challenge];
    
    if (workingDirectory) {
      workingDirectory.innerHTML = "";
      
      // Add files from working directory
      state.filesInWorkingDir.forEach((file) => {
        const fileElement = document.createElement("div");
        fileElement.className = "file-item";
        fileElement.innerHTML = `<i class="fa-regular fa-file"></i> ${file}`;
        workingDirectory.appendChild(fileElement);
      });
      
      // Add modified files
      if (state.fileModified && challenge === "tracking") {
        const fileElement = document.createElement("div");
        fileElement.className = "file-item modified";
        fileElement.innerHTML = `<i class="fa-regular fa-file"></i> index.html <span class="modified-tag">modified</span>`;
        workingDirectory.appendChild(fileElement);
      }
    }
  }

  function updateStagingArea(challenge) {
    const stagingArea = document.getElementById(`staging-area-${challenge}`);
    const state = challengeStates[challenge];
    
    if (stagingArea) {
      stagingArea.innerHTML = "";
      state.filesInStagingArea.forEach((file) => {
        const fileElement = document.createElement("div");
        fileElement.className = "file-item";
        fileElement.innerHTML = `<i class="fa-regular fa-file"></i> ${file}`;
        stagingArea.appendChild(fileElement);
      });
    }
  }

  function updateRepository(challenge) {
    const repository = document.getElementById(`repository-${challenge}`);
    const state = challengeStates[challenge];
    
    if (repository) {
      repository.innerHTML = "";
      
      // Group commits by branch
      const commitsByBranch = {};
      state.commits.forEach(commit => {
        const branch = commit.branch || "master";
        if (!commitsByBranch[branch]) {
          commitsByBranch[branch] = [];
        }
        commitsByBranch[branch].push(commit);
      });
      
      // Add branch labels
      Object.keys(commitsByBranch).forEach(branch => {
        if (state.branches && state.branches.includes(branch)) {
          const branchLabel = document.createElement("div");
          branchLabel.className = "branch-label";
          branchLabel.textContent = branch;
          repository.appendChild(branchLabel);
          
          // Add commits for this branch
          commitsByBranch[branch].forEach(commit => {
            const commitElement = document.createElement("div");
            commitElement.className = "commit-item";
            commitElement.innerHTML = `
              <div class="commit-hash">${commit.hash.substring(0, 7)}</div>
              <div class="commit-message">${commit.message}</div>
            `;
            repository.appendChild(commitElement);
          });
        }
      });
    }
  }

  function resetProgressSteps(challenge) {
    const progressSteps = document.querySelectorAll(`.progress-step[data-challenge="${challenge}"]`);
    progressSteps.forEach((step) => {
      step.classList.remove("completed");
      const indicator = step.querySelector(".step-indicator i");
      indicator.className = "fa-regular fa-circle";
    });
  }

  function updateProgressStep(step, challenge) {
    const progressSteps = document.querySelectorAll(`.progress-step[data-challenge="${challenge}"]`);
    let stepFound = false;
    
    progressSteps.forEach((progressStep) => {
      if (progressStep.getAttribute("data-step") === step) {
        progressStep.classList.add("completed");
        const indicator = progressStep.querySelector(".step-indicator i");
        indicator.classList.remove("fa-regular", "fa-circle");
        indicator.classList.add("fa-solid", "fa-circle-check");
        stepFound = true;
      }
    });
    
    if (!stepFound) {
      console.warn(`Step ${step} not found for challenge ${challenge}`);
    }
    
    // Check if all steps are completed
    const allCompleted = Array.from(progressSteps).every((step) => step.classList.contains("completed"));
    if (allCompleted) {
      const submitBtn = document.querySelector(`.submit-challenge[data-challenge="${challenge}"]`);
      if (submitBtn) {
        submitBtn.classList.add("ready");
      }
    }
  }

  function generateCommitHash() {
    return Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
  }

  // Hint Buttons
  const hintBtns = document.querySelectorAll(".hint-btn");
  hintBtns.forEach((btn) => {
    btn.addEventListener("click", function() {
      const challenge = this.getAttribute("data-challenge");
      const progressSteps = document.querySelectorAll(`.progress-step[data-challenge="${challenge}"]`);
      
      // Find the first incomplete step
      let incompleteStep = null;
      for (const step of progressSteps) {
        if (!step.classList.contains("completed")) {
          incompleteStep = step.getAttribute("data-step");
          break;
        }
      }
      
      // Show hint based on incomplete step and challenge
      const terminalOutput = document.getElementById(`terminal-output-${challenge}`);
      const output = document.createElement("div");
      output.className = "output-line";
      
      let hintText = "";
      
      // First commit challenge hints
      if (challenge === "first-commit") {
        switch (incompleteStep) {
          case "init":
            hintText = 'Use <code>git init</code> to initialize a repository';
            break;
          case "create":
            hintText = 'Use <code>touch index.html</code> to create the file';
            break;
          case "add":
            hintText = 'Use <code>git add index.html</code> to add the file to staging area';
            break;
          case "commit":
            hintText = 'Use <code>git commit -m "Initial commit"</code> to commit your changes';
            break;
          default:
            hintText = 'All steps completed! Click "Complete Challenge" to finish.';
        }
      }
      // Tracking changes challenge hints
      else if (challenge === "tracking") {
        switch (incompleteStep) {
          case "modify":
            hintText = 'Use <code>edit index.html</code> to modify the file';
            break;
          case "status":
            hintText = 'Use <code>git status</code> to check the repository status';
            break;
          case "diff":
            hintText = 'Use <code>git diff</code> to view the changes';
            break;
          case "add":
            hintText = 'Use <code>git add index.html</code> to stage the changes';
            break;
          case "commit":
            hintText = 'Use <code>git commit -m "Update index.html"</code> to commit the changes';
            break;
          case "log":
            hintText = 'Use <code>git log</code> to view the commit history';
            break;
          default:
            hintText = 'All steps completed! Click "Complete Challenge" to finish.';
        }
      }
      // Branching challenge hints
      else if (challenge === "branching") {
        switch (incompleteStep) {
          case "create-branch":
            hintText = 'Use <code>git branch feature-branch</code> to create a new branch';
            break;
          case "checkout":
            hintText = 'Use <code>git checkout feature-branch</code> to switch to the new branch';
            break;
          case "modify":
            hintText = 'Use <code>edit index.html</code> or <code>touch new-file.txt</code> to modify or create a file';
            break;
          case "commit":
            hintText = 'Use <code>git add .</code> and <code>git commit -m "Add feature"</code> to commit your changes';
            break;
          case "merge":
            hintText = 'First use <code>git checkout master</code> then <code>git merge feature-branch</code> to merge the branch';
            break;
          case "delete":
            hintText = 'Use <code>git branch -d feature-branch</code> to delete the branch after merging';
            break;
          default:
            hintText = 'All steps completed! Click "Complete Challenge" to finish.';
        }
      }
      // Merge conflicts challenge hints
      else if (challenge === "merge") {
        switch (incompleteStep) {
          case "create-branch":
            hintText = 'Use <code>git branch feature-branch</code> to create a new branch';
            break;
          case "modify-branch":
            hintText = 'Use <code>git checkout feature-branch</code> then <code>edit index.html</code> to modify the file in the branch';
            break;
          case "modify-main":
            hintText = 'Use <code>git checkout master</code> then <code>edit index.html</code> to modify the file in the main branch';
            break;
          case "merge-conflict":
            hintText = 'Use <code>git merge feature-branch</code> to attempt to merge and create a conflict';
            break;
          case "resolve":
            hintText = 'Use <code>resolve conflict</code> to simulate resolving the conflict';
            break;
          case "commit":
            hintText = 'Use <code>git add index.html</code> and <code>git commit -m "Resolve merge conflict"</code> to complete the merge';
            break;
          default:
            hintText = 'All steps completed! Click "Complete Challenge" to finish.';
        }
      }
      // Rebase challenge hints
      else if (challenge === "rebase") {
        switch (incompleteStep) {
          case "create-branch":
            hintText = 'Use <code>git branch feature-branch</code> to create a new branch';
            break;
          case "branch-commits":
            hintText = 'Use <code>git checkout feature-branch</code>, then make changes and commit them';
            break;
          case "main-commits":
            hintText = 'Use <code>git checkout master</code>, then make changes and commit them';
            break;
          case "rebase":
            hintText = 'Use <code>git checkout feature-branch</code> then <code>git rebase master</code> to rebase your branch';
            break;
          case "resolve":
            hintText = 'Use <code>resolve conflict</code> then <code>git add index.html</code> and <code>git rebase --continue</code>';
            break;
          case "verify":
            hintText = 'Use <code>git log --oneline</code> to verify the linear history';
            break;
          default:
            hintText = 'All steps completed! Click "Complete Challenge" to finish.';
        }
      }
      // CI/CD challenge hints
      else if (challenge === "cicd") {
        switch (incompleteStep) {
          case "create-repo":
            hintText = 'Use <code>git remote add origin https://github.com/user/repo.git</code> to connect to GitHub';
            break;
          case "create-workflow":
            hintText = 'Use <code>mkdir -p .github/workflows</code> to create the directory structure';
            break;
          case "define-steps":
            hintText = 'Use <code>create workflow file</code> to create a workflow file with CI/CD steps';
            break;
          case "commit-push":
            hintText = 'Use <code>git add .</code>, <code>git commit -m "Add CI workflow"</code>, and <code>git push -u origin master</code>';
            break;
          case "trigger":
            hintText = 'The workflow will be triggered automatically when you push to GitHub';
            break;
          case "monitor":
            hintText = 'Use <code>check workflow status</code> to check the status of your workflow';
            break;
          default:
            hintText = 'All steps completed! Click "Complete Challenge" to finish.';
        }
      }
      
      output.innerHTML = `<span style="color: yellow;">Hint:</span> ${hintText}`;
      terminalOutput.appendChild(output);
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    });
  });

  // Submit Challenge Buttons
  const submitChallengeBtns = document.querySelectorAll(".submit-challenge");
  submitChallengeBtns.forEach((btn) => {
    btn.addEventListener("click", function() {
      const challenge = this.getAttribute("data-challenge");
      const progressSteps = document.querySelectorAll(`.progress-step[data-challenge="${challenge}"]`);
      
      // Check if all steps are completed
      const allCompleted = Array.from(progressSteps).every((step) => step.classList.contains("completed"));
      
      if (allCompleted) {
        // Close modal
        const modal = document.getElementById(`challenge-modal-${challenge}`);
        if (modal) {
          modal.style.display = "none";
        }
        
        // Get XP value based on challenge
        let xpValue = 10;
        switch (challenge) {
          case "first-commit":
            xpValue = 10;
            break;
          case "tracking":
            xpValue = 15;
            break;
          case "branching":
            xpValue = 25;
            break;
          case "merge":
            xpValue = 30;
            break;
          case "rebase":
            xpValue = 50;
            break;
          case "cicd":
            xpValue = 60;
            break;
        }
        
        // Show success message
        alert(`${challenge.charAt(0).toUpperCase() + challenge.slice(1).replace(/-/g, ' ')} Challenge completed! You earned ${xpValue} XP!`);
        
        // Update XP
        updateXP(xpValue);
        
        // Add to recent activity
        addActivity(challenge, xpValue);
      } else {
        alert("Please complete all steps before submitting the challenge!");
      }
    });
  });

  // XP Update Function
  function updateXP(amount) {
    const xpValue = document.querySelector(".xp-value");
    if (xpValue) {
      xpValue.textContent = Number.parseInt(xpValue.textContent) + amount;
    }
  }
  
  // Add Activity Function
  function addActivity(challenge, xpValue) {
    const activityContainer = document.querySelector(".activity-container");
    if (activityContainer) {
      const challengeName = challenge
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      const activityItem = document.createElement("div");
      activityItem.className = "activity-item";
      activityItem.innerHTML = `
        <div class="activity-icon">
          <i class="fa-solid fa-check-circle"></i>
        </div>
        <div class="activity-content">
          <h4>Completed "${challengeName}" Challenge</h4>
          <p>Just now</p>
        </div>
        <div class="activity-xp">+${xpValue} XP</div>
      `;
      activityContainer.prepend(activityItem);
    }
  }
});
// Add to script.js

document.addEventListener("DOMContentLoaded", () => {
  // Existing code...
  
  // Documentation page sidebar navigation
  const docLinks = document.querySelectorAll(".doc-sidebar ul li a");
  const docSections = document.querySelectorAll(".doc-section");
  
  docLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      
      // Update active sidebar link
      document.querySelector(".doc-sidebar ul li.active")?.classList.remove("active");
      this.parentElement.classList.add("active");
      
      // Show corresponding section
      const targetId = this.getAttribute("href").substring(1);
      docSections.forEach((section) => {
        section.classList.remove("active");
      });
      document.getElementById(targetId).classList.add("active");
    });
  });
});
// Add to script.js

document.addEventListener("DOMContentLoaded", () => {
  // Existing code...
  
  // Settings page sidebar navigation
  const settingsLinks = document.querySelectorAll(".settings-sidebar ul li a");
  const settingsSections = document.querySelectorAll(".settings-section");
  
  settingsLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      
      // Update active sidebar link
      document.querySelector(".settings-sidebar ul li.active")?.classList.remove("active");
      this.parentElement.classList.add("active");
      
      // Show corresponding section
      const targetId = this.getAttribute("href").substring(1);
      settingsSections.forEach((section) => {
        section.classList.remove("active");
      });
      document.getElementById(targetId).classList.add("active");
    });
  });
  
  // Settings form submission
  const settingsForm = document.querySelector(".settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("submit", function(e) {
      e.preventDefault();
      alert("Settings saved successfully!");
    });
  }
});
// Add to script.js

document.addEventListener("DOMContentLoaded", () => {
  // Existing code...
  
  // Forum new topic button
  const newTopicBtn = document.querySelector(".new-topic-btn");
  if (newTopicBtn) {
    newTopicBtn.addEventListener("click", function() {
      alert("New topic feature coming soon!");
    });
  }
  
  // Forum category cards
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach(card => {
    card.addEventListener("click", function() {
      const categoryName = this.querySelector("h3").textContent;
      alert(`Viewing topics in ${categoryName} category coming soon!`);
    });
  });
  
  // Forum topic links
  const topicLinks = document.querySelectorAll(".topic-content h4 a");
  topicLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const topicTitle = this.textContent;
      alert(`Viewing topic: ${topicTitle} coming soon!`);
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Tab Navigation
  const docLinks = document.querySelectorAll('.doc-link');
  const docSections = document.querySelectorAll('.doc-section');
  
  // Set the first section as active by default
  if (docSections.length > 0) {
      docSections[0].classList.remove('hidden');
      if (docLinks.length > 0) {
          docLinks[0].classList.add('active');
      }
  }
  
  docLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Get the target section ID
          const targetId = this.getAttribute('data-target');
          
          // Remove active class from all links and hide all sections
          docLinks.forEach(l => l.classList.remove('active'));
          docSections.forEach(s => s.classList.add('hidden'));
          
          // Add active class to clicked link and show target section
          this.classList.add('active');
          document.getElementById(targetId).classList.remove('hidden');
      });
  });
  
  // Copy Command Button Functionality
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
      button.addEventListener('click', function() {
          const command = this.getAttribute('data-command');
          navigator.clipboard.writeText(command).then(() => {
              // Change the icon temporarily to show it was copied
              const icon = this.querySelector('i');
              icon.classList.remove('fa-copy');
              icon.classList.add('fa-check');
              
              setTimeout(() => {
                  icon.classList.remove('fa-check');
                  icon.classList.add('fa-copy');
              }, 2000);
          });
      });
  });
  
  // Try It Button Functionality
  const tryButtons = document.querySelectorAll('.try-it-btn');
  
  tryButtons.forEach(button => {
      button.addEventListener('click', function() {
          const command = this.getAttribute('data-command');
          const outputElement = this.nextElementSibling;
          
          // Show the output element
          outputElement.classList.remove('hidden');
          
          // Simulate command execution
          executeCommand(command, outputElement);
      });
  });
  
  // Print Cheatsheet Functionality
  const printButton = document.getElementById('print-cheatsheet');
  if (printButton) {
      printButton.addEventListener('click', function() {
          // Create a new window with just the cheatsheet content
          const printWindow = window.open('', '_blank');
          
          // Get the cheatsheet content
          const cheatsheetContent = document.querySelector('.cheatsheet-container').innerHTML;
          
          // Create HTML for the print window
          printWindow.document.write(`
              <!DOCTYPE html>
              <html>
              <head>
                  <title>Git Cheat Sheet</title>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          padding: 20px;
                          max-width: 1000px;
                          margin: 0 auto;
                      }
                      h1 {
                          text-align: center;
                          color: #2c3e50;
                          margin-bottom: 30px;
                      }
                      .cheatsheet-container {
                          display: grid;
                          grid-template-columns: repeat(2, 1fr);
                          gap: 20px;
                      }
                      .cheatsheet-section h2 {
                          font-size: 1.5rem;
                          color: #2c3e50;
                          border-bottom: 2px solid #f0f0f0;
                          padding-bottom: 5px;
                          margin-bottom: 10px;
                      }
                      table {
                          width: 100%;
                          border-collapse: collapse;
                      }
                      tr {
                          border-bottom: 1px solid #eee;
                      }
                      td {
                          padding: 8px 5px;
                          line-height: 1.4;
                      }
                      td:first-child {
                          font-family: monospace;
                          white-space: nowrap;
                          color: #d14;
                      }
                      @media print {
                          body {
                              padding: 0;
                          }
                      }
                  </style>
              </head>
              <body>
                  <h1>Git Cheat Sheet</h1>
                  <div class="cheatsheet-container">
                      ${cheatsheetContent}
                  </div>
              </body>
              </html>
          `);
          
          // Print the window
          setTimeout(() => {
              printWindow.print();
          }, 500);
      });
  }
  
  // Command Execution Simulation
  function executeCommand(command, outputElement) {
      // Simulate loading
      outputElement.textContent = "Executing command...";
      
      // Simulate different outputs based on the command
      setTimeout(() => {
          let output = "";
          
          if (command.includes("init")) {
              output = "Initialized empty Git repository in /path/to/repository/.git/";
          } 
          else if (command.includes("add")) {
              output = "Changes staged for commit.";
          }
          else if (command.includes("commit")) {
              output = `[main f7b97e2] ${command.split('"')[1] || "Commit message"}\n 1 file changed, 5 insertions(+), 2 deletions(-)`;
          }
          else if (command.includes("status")) {
              output = "On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges to be committed:\n  (use \"git restore --staged <file>...\" to unstage)\n\t modified:   index.html\n\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n  (use \"git restore <file>...\" to discard changes in working directory)\n\t modified:   styles.css";
          }
          else if (command.includes("log")) {
              if (command.includes("--oneline")) {
                  output = "f7b97e2 (HEAD -> main) Add navigation menu\n3a5c1d9 Update landing page design\nbd58a37 Initial commit";
              } else {
                  output = "commit f7b97e2e3a5c1d9bd58a37c6f98c6cc4c5f55f5 (HEAD -> main)\nAuthor: Developer <dev@example.com>\nDate:   Wed Apr 23 10:30:25 2025 -0400\n\n    Add navigation menu\n\ncommit 3a5c1d9bd58a37c6f98c6cc4c5f55f5db47e288\nAuthor: Developer <dev@example.com>\nDate:   Wed Apr 22 09:15:10 2025 -0400\n\n    Update landing page design\n\ncommit bd58a37c6f98c6cc4c5f55f5db47e2883a5c1d9\nAuthor: Developer <dev@example.com>\nDate:   Tue Apr 21 14:45:32 2025 -0400\n\n    Initial commit";
              }
          }
          else if (command.includes("branch")) {
              if (command.split(" ").length > 1 && !command.includes("-d") && !command.includes("-v")) {
                  const branchName = command.split(" ")[1];
                  output = `Created branch '${branchName}'`;
              } else {
                  output = "* main\n  feature-branch\n  bugfix-123";
              }
          }
          else if (command.includes("checkout") || command.includes("switch")) {
              const parts = command.split(" ");
              let branchName;
              
              if (command.includes("-b") || command.includes("-c")) {
                  branchName = parts[parts.length - 1];
                  output = `Switched to a new branch '${branchName}'`;
              } else if (parts.length > 1) {
                  branchName = parts[parts.length - 1];
                  output = `Switched to branch '${branchName}'`;
              }
          }
          else if (command.includes("merge")) {
              if (command.includes("--abort")) {
                  output = "Merge aborted.";
              } else if (command.includes("--continue")) {
                  output = "Merge completed.";
              } else {
                  const branchName = command.split(" ")[1];
                  output = `Updating f7b97e2..3a5c1d9\nFast-forward\n index.html | 7 +++++++\n styles.css | 3 +++\n 2 files changed, 10 insertions(+)\nMerge made by the 'recursive' strategy.`;
              }
          }
          else if (command.includes("remote")) {
              if (command.includes("-v")) {
                  output = "origin  https://github.com/username/repo.git (fetch)\norigin  https://github.com/username/repo.git (push)";
              } else {
                  output = "origin";
              }
          }
          else if (command.includes("clone")) {
              output = "Cloning into 'repo'...\nremote: Enumerating objects: 75, done.\nremote: Counting objects: 100% (75/75), done.\nremote: Compressing objects: 100% (53/53), done.\nremote: Total 75 (delta 30), reused 59 (delta 20), pack-reused 0\nReceiving objects: 100% (75/75), 11.24 KiB | 3.74 MiB/s, done.\nResolving deltas: 100% (30/30), done.";
          }
          else if (command.includes("push")) {
              output = "Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (3/3), done.\nWriting objects: 100% (3/3), 352 bytes | 352.00 KiB/s, done.\nTotal 3 (delta 2), reused 0 (delta 0), pack-reused 0\nremote: Resolving deltas: 100% (2/2), completed with 2 local objects.\nTo https://github.com/username/repo.git\n   3a5c1d9..f7b97e2  main -> main";
          }
          else if (command.includes("pull")) {
              output = "Already up to date.";
          }
          else if (command.includes("fetch")) {
              output = "From https://github.com/username/repo\n * [new branch]      feature-xyz -> origin/feature-xyz\n   bd58a37..3a5c1d9  main       -> origin/main";
          }
          else if (command.includes("rebase")) {
              output = "Successfully rebased and updated refs/heads/feature-branch.";
          }
          else if (command.includes("cherry-pick")) {
              output = "[main abc1234] Add feature X\n 1 file changed, 10 insertions(+)";
          }
          else if (command.includes("stash")) {
              if (command === "git stash") {
                  output = "Saved working directory and index state WIP on main: f7b97e2 Add navigation menu";
              } else if (command.includes("list")) {
                  output = "stash@{0}: WIP on main: f7b97e2 Add navigation menu\nstash@{1}: WIP on feature-branch: 3a5c1d9 Update landing page design";
              } else if (command.includes("apply") || command.includes("pop")) {
                  output = "On branch main\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n  (use \"git restore <file>...\" to discard changes in working directory)\n\t modified:   index.html\n\nno changes added to commit (use \"git add\" and/or \"git commit -a\")";
              }
          }
          else if (command.includes("tag")) {
              if (command === "git tag") {
                  output = "v0.9.0\nv1.0.0\nv1.1.0";
              } else if (command.includes("-a")) {
                  output = "Tagged commit f7b97e2 as v1.0.0";
              }
          }
          else if (command.includes("bisect")) {
              if (command.includes("start")) {
                  output = "Git bisect session started.";
              } else if (command.includes("good")) {
                  output = "Bisecting: 5 revisions left to test after this (roughly 3 steps)";
              } else if (command.includes("bad")) {
                  output = "Bisecting: 2 revisions left to test after this (roughly 1 step)";
              } else if (command.includes("reset")) {
                  output = "Bisect session ended.";
              }
          }
          else if (command.includes("worktree")) {
              output = "/path/to/repo    f7b97e2 [main]\n/path/to/repo-feat 3a5c1d9 [feature-branch]";
          }
          else {
              output = "Command executed successfully.";
          }
          
          outputElement.textContent = output;
      }, 1000);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("darkModeToggle");

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    darkToggle.checked = true;
  }

  darkToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });
});

// user-data.js - Manages user data across the application

// User data object to store all user information
const userData = {
  username: "GitUser",
  email: "user@example.com",
  avatar: "https://m.media-amazon.com/images/S/aplus-media/vc/eeae6f85-4736-4672-9a64-a17ceefe4d87._SL300__.png",
  level: 2,
  xp: 120,
  challenges: 3,
  badges: 1,
  // Add more user data as needed
};

// Available avatars for selection
const availableAvatars = [
  "https://m.media-amazon.com/images/S/aplus-media/vc/eeae6f85-4736-4672-9a64-a17ceefe4d87._SL300__.png",
  "https://yt3.googleusercontent.com/yrfyzQYlBIj_a5A35QNnx1r-sxCo7od_YgmZmKjVDcoKi04s1fzusbExbd1cUw-Ymrx3n7F5kA=s900-c-k-c0x00ffffff-no-rj",
  "https://yt3.googleusercontent.com/GyLEdLKX4ZTpYsjk68s4-Lti6P94-m9QZlqAQwOY0sfQPw-Vja8fLZ-O440I6ee2O2f-k3VJvg=s900-c-k-c0x00ffffff-no-rj",
  "https://static1.srcdn.com/wordpress/wp-content/uploads/2022/01/Master-Tigress-from-Kung-Fu-Panda.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQijTncVRzTHCFNa6LTl6E9iJ_nyYINQE-VBQ&s",
  "https://lumiere-a.akamaihd.net/v1/images/open-uri20150422-20810-6pb5yg_c12dffb8.jpeg",
  "https://i.pinimg.com/474x/0a/cc/30/0acc30e51f64a8f125ec0ca350c0e1c6.jpg",
  "https://i.pinimg.com/736x/18/67/ca/1867ca6916da84ec47e3e5ba496643d0.jpg"
];

// Function to update user data
function updateUserData(newData) {
  // Update the userData object with new values
  Object.assign(userData, newData);
  
  // Update UI elements across the application
  updateUIElements();
  
  // Save to localStorage for persistence
  saveUserData();
  
  return userData;
}

// Function to update all UI elements that display user data
function updateUIElements() {
  // Update header user info
  updateHeaderUserInfo();
  
  // Update profile page
  updateProfilePage();
  
  // Update settings page
  updateSettingsPage();
  
  // Update leaderboard
  updateLeaderboard();
}

// Update header user info (avatar, XP, level)
function updateHeaderUserInfo() {
  // Update XP value
  const xpElements = document.querySelectorAll('.xp-value');
  xpElements.forEach(el => {
      el.textContent = userData.xp;
  });
  
  // Update level value
  const levelElements = document.querySelectorAll('.level-value');
  levelElements.forEach(el => {
      el.textContent = userData.level;
  });
  
  // Update avatar
  const headerAvatarImg = document.querySelector('.user-info .user-avatar img');
  if (headerAvatarImg) {
      headerAvatarImg.src = userData.avatar;
  }
}

// Update profile page with user data
function updateProfilePage() {
  // Update profile avatar
  const profileAvatar = document.querySelector('.profile-avatar img');
  if (profileAvatar) {
      profileAvatar.src = userData.avatar;
  }
  
  // Update stats
  const statValues = document.querySelectorAll('.profile-stats .stat-value');
  if (statValues.length >= 4) {
      statValues[0].textContent = userData.level;
      statValues[1].textContent = userData.xp;
      statValues[2].textContent = userData.challenges;
      statValues[3].textContent = userData.badges;
  }
  
  // Update progress bar
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
      // Calculate progress percentage (assuming 200 XP needed for next level)
      const progressPercentage = (userData.xp % 200) / 2;
      progressFill.style.width = `${progressPercentage}%`;
  }
  
  // Update progress text
  const progressHeader = document.querySelector('.progress-header');
  if (progressHeader) {
      const progressSpans = progressHeader.querySelectorAll('span');
      if (progressSpans.length >= 2) {
          progressSpans[0].textContent = `Level ${userData.level + 1}`;
          progressSpans[1].textContent = `${userData.xp % 200}/200 XP`;
      }
  }
}

// Update settings page with user data
function updateSettingsPage() {
  // Update username input
  const usernameInput = document.getElementById('username');
  if (usernameInput) {
      usernameInput.value = userData.username;
  }
  
  // Update email input
  const emailInput = document.getElementById('email');
  if (emailInput) {
      emailInput.value = userData.email;
  }
  
  // Update avatar preview
  const avatarPreview = document.querySelector('.avatar-selector .current-avatar');
  if (avatarPreview) {
      avatarPreview.src = userData.avatar;
  }
}

// Update leaderboard with user data
function updateLeaderboard() {
  // Find the current user row in the leaderboard
  const currentUserRow = document.querySelector('.leaderboard-table tr.current-user');
  if (currentUserRow) {
      // Update XP cell
      const xpCell = currentUserRow.querySelector('td:nth-child(4)');
      if (xpCell) {
          xpCell.textContent = `${userData.xp} XP`;
      }
      
      // Update level cell
      const levelCell = currentUserRow.querySelector('td:nth-child(3)');
      if (levelCell) {
          levelCell.textContent = userData.level;
      }
  }
}

// Save user data to localStorage
function saveUserData() {
  localStorage.setItem('gitQuestUserData', JSON.stringify(userData));
}

// Load user data from localStorage
function loadUserData() {
  const savedData = localStorage.getItem('gitQuestUserData');
  if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.assign(userData, parsedData);
  }
}

// Add XP to the user
function addXP(amount) {
  const newXP = userData.xp + amount;
  
  // Check if user leveled up (assuming 200 XP per level)
  const currentLevel = Math.floor(userData.xp / 200);
  const newLevel = Math.floor(newXP / 200);
  
  const leveledUp = newLevel > currentLevel;
  
  // Update user data
  updateUserData({
      xp: newXP,
      level: newLevel,
  });
  
  // Return whether the user leveled up
  return leveledUp;
}

// Initialize user data when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Load saved user data
  loadUserData();
  
  // Update UI with loaded data
  updateUIElements();
});

// Export functions for use in other scripts
window.UserData = {
  get: () => ({ ...userData }), // Return a copy of userData
  update: updateUserData,
  addXP: addXP,
  avatars: availableAvatars
};