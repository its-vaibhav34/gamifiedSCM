document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Friends Section
  const usernameInput = document.getElementById("username-input");
  const searchBtn = document.getElementById("search-btn");
  const userProfile = document.getElementById("user-profile");
  const userAvatar = document.getElementById("user-avatar");
  const userName = document.getElementById("user-name");
  const userLogin = document.getElementById("user-login");
  const userBio = document.getElementById("user-bio");
  const userRepos = document.getElementById("user-repos");
  const userFollowers = document.getElementById("user-followers");
  const userFollowing = document.getElementById("user-following");
  const userProfileLink = document.getElementById("user-profile-link");
  const addFriendBtn = document.getElementById("add-friend-btn");
  const errorMessage = document.getElementById("error-message");
  const friendsContainer = document.getElementById("friends-container");
  const friendsList = document.getElementById("friends-list");
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  
  // DOM Elements - Repository Modal
  const repoModal = document.getElementById("repo-modal");
  const repoFriendName = document.getElementById("repo-friend-name");
  const repoSearchInput = document.getElementById("repo-search-input");
  const repoList = document.getElementById("repo-list");
  const saveReposBtn = document.getElementById("save-repos-btn");
  const closeModalBtns = document.querySelectorAll(".close-modal");
  
  // DOM Elements - Projects Section
  const projectsContainer = document.getElementById("projects-container");
  const projectsList = document.getElementById("projects-list");
  const projectDetails = document.getElementById("project-details");
  const projectName = document.getElementById("project-name");
  const projectDescription = document.getElementById("project-description");
  const backToProjectsBtn = document.getElementById("back-to-projects");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const commitsList = document.getElementById("commits-list");
  const filesList = document.getElementById("files-list");
  
  // DOM Elements - Codespace
  const codespaceFiles = document.getElementById("codespace-files");
  const codeEditor = document.getElementById("code-editor");
  const currentFileElement = document.getElementById("current-file");
  const saveFileBtn = document.getElementById("save-file-btn");
  const addFileBtn = document.getElementById("add-file-btn");
  const addFileModal = document.getElementById("add-file-modal");
  const newFileName = document.getElementById("new-file-name");
  const createFileBtn = document.getElementById("create-file-btn");
  const commitMessage = document.getElementById("commit-message");
  const commitChangesBtn = document.getElementById("commit-changes-btn");
  
  // DOM Elements - Navigation
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const friendsFilterBtns = document.querySelectorAll(".friends-filter .filter-btn");
  const projectsFilterBtns = document.querySelectorAll(".projects-filter .filter-btn");

  // Current data
  let currentUser = null;
  let currentFriend = null;
  let currentProject = null;
  let currentFile = null;
  let unsavedChanges = false;
  let userRepositories = [];

  // Load data from localStorage
  let friends = JSON.parse(localStorage.getItem("githubFriends")) || [];
  let collaborativeProjects = JSON.parse(localStorage.getItem("collaborativeProjects")) || [];
  let projectFiles = JSON.parse(localStorage.getItem("projectFiles")) || {};
  let projectCommits = JSON.parse(localStorage.getItem("projectCommits")) || {};
  
  // Check dark mode preference
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }

  // Display friends if any exist
  if (friends.length > 0) {
    displayFriends();
    friendsContainer.classList.remove("hidden");
  }

  // Display projects if any exist
  if (collaborativeProjects.length > 0) {
    displayProjects();
    projectsContainer.classList.remove("hidden");
  }

  // Event Listeners - Friends Section
  searchBtn.addEventListener("click", searchUser);
  usernameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchUser();
    }
  });
  addFriendBtn.addEventListener("click", addFriend);
  
  // Event Listeners - Navigation
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute("data-section");
      
      // Update active link
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      
      // Show target section, hide others
      sections.forEach(section => {
        if (section.id === targetSection) {
          section.classList.remove("hidden-section");
          section.classList.add("active-section");
        } else {
          section.classList.remove("active-section");
          section.classList.add("hidden-section");
        }
      });
    });
  });
  
  // Dark mode toggle
  darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", darkModeToggle.checked);
  });
  
  // Friends filter buttons
  friendsFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      friendsFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const filter = btn.getAttribute("data-filter");
      filterFriends(filter);
    });
  });
  
  // Projects filter buttons
  projectsFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      projectsFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const filter = btn.getAttribute("data-filter");
      filterProjects(filter);
    });
  });
  
  // Close modal buttons
  closeModalBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      repoModal.classList.add("hidden");
      addFileModal.classList.add("hidden");
    });
  });
  
  // Repository modal
  saveReposBtn.addEventListener("click", saveSelectedRepositories);
  repoSearchInput.addEventListener("input", filterRepositories);
  
  // Project navigation
  backToProjectsBtn.addEventListener("click", () => {
    projectDetails.classList.add("hidden");
    projectsContainer.classList.remove("hidden");
  });
  
  // Tab navigation
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from all tabs
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      
      // Add active class to clicked tab
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  });
  
  // Codespace events
  addFileBtn.addEventListener("click", () => {
    addFileModal.classList.remove("hidden");
    newFileName.value = "";
    newFileName.focus();
  });
  
  createFileBtn.addEventListener("click", createNewFile);
  saveFileBtn.addEventListener("click", saveCurrentFile);
  commitChangesBtn.addEventListener("click", commitChanges);
  
  codeEditor.addEventListener("input", () => {
    unsavedChanges = true;
    saveFileBtn.disabled = false;
  });

  // Functions - User Search and Friends
  async function searchUser() {
    const username = usernameInput.value.trim();

    if (!username) {
        showNotification("Please enter a GitHub username", true);
        return;
    }

    try {
        // Show loading state
        searchBtn.textContent = "Searching...";
        searchBtn.disabled = true;

        // Fetch user data from GitHub API
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("User not found");
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        }

        const userData = await response.json();
        currentUser = userData;

        // Display user data
        userAvatar.src = userData.avatar_url;
        userName.textContent = userData.name || userData.login;
        userLogin.textContent = `@${userData.login}`;
        userBio.textContent = userData.bio || "No bio available";
        userRepos.textContent = userData.public_repos;
        userFollowers.textContent = userData.followers;
        userFollowing.textContent = userData.following;
        userProfileLink.href = userData.html_url;

        // Fetch user repositories
        await fetchUserRepositories(username);

        // Show user profile
        userProfile.classList.remove("hidden");
    } catch (error) {
        console.error("Error fetching user:", error);
        errorMessage.querySelector("p").textContent = error.message || "User not found. Please try another username.";
        errorMessage.classList.remove("hidden");
    } finally {
        // Reset button state
        searchBtn.textContent = "Search";
        searchBtn.disabled = false;
    }
}
  
  async function fetchUserRepositories(username) {
    try {
        // Fetch repositories from GitHub API
        // const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error("API rate limit exceeded. Please try again later.");
            } else if (response.status === 404) {
                throw new Error("No repositories found for this user.");
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        }

        const repos = await response.json();

        // Map repository data
        userRepositories = repos.map(repo => ({
            id: repo.id.toString(),
            name: repo.name,
            description: repo.description,
            language: repo.language,
            updated_at: repo.updated_at,
            html_url: repo.html_url,
            owner: repo.owner.login
        }));

        console.log(`Fetched ${userRepositories.length} repositories for ${username}`);
    } catch (error) {
        console.error("Error fetching repositories:", error);
        showNotification(`Error fetching repositories: ${error.message}`, true);
    }
}

  function addFriend() {
    if (!currentUser) return;
  
    // Check if already a friend
    if (friends.some((friend) => friend.id === currentUser.id)) {
      showNotification("This user is already your friend", true);
      return;
    }
  
    // Add to friends array
    friends.push({
      id: currentUser.id,
      login: currentUser.login,
      name: currentUser.name || currentUser.login,
      avatar_url: currentUser.avatar_url,
      html_url: currentUser.html_url,
      repos: currentUser.public_repos,
      followers: currentUser.followers,
      added_at: new Date().toISOString(),
    });
  
    // Save to localStorage
    localStorage.setItem("githubFriends", JSON.stringify(friends));
  
    // Update UI
    displayFriends();
    friendsContainer.classList.remove("hidden");
  
    // Update add friend button
    addFriendBtn.innerHTML = '<i class="fa-solid fa-check"></i> Already a Friend';
    addFriendBtn.disabled = true;
  
    // Show notification
    showNotification(`${currentUser.login} added as a friend!`);
  
    // Open repository selection modal
    openRepositoryModal(currentUser);
  }

  function displayFriends() {
    // Clear friends list
    friendsList.innerHTML = "";

    // Sort friends by most recently added
    const sortedFriends = [...friends].sort((a, b) => new Date(b.added_at) - new Date(a.added_at));

    // Create friend cards
    sortedFriends.forEach((friend) => {
      // Check if friend has collaborative projects
      const hasProjects = collaborativeProjects.some(project => 
        project.collaborators.some(collab => collab.id === friend.id)
      );
      
      const friendCard = document.createElement("div");
      friendCard.className = "friend-card";
      
      friendCard.innerHTML = `
        <div class="friend-avatar">
          <img src="${friend.avatar_url}" alt="${friend.login}">
        </div>
        <div class="friend-info">
          <h3 class="friend-name">${friend.name}</h3>
          <p class="friend-login">@${friend.login}</p>
          <div class="friend-stats">
            <span><i class="fa-solid fa-code-branch"></i> ${friend.repos || 0}</span>
            <span><i class="fa-solid fa-users"></i> ${friend.followers || 0}</span>
          </div>
          <div class="friend-actions">
            <a href="${friend.html_url}" target="_blank" class="view-friend-btn">
              <i class="fa-solid fa-external-link-alt"></i> View Profile
            </a>
            <button class="select-repos-btn" data-id="${friend.id}">
              <i class="fa-solid fa-code-branch"></i> Select Repositories
            </button>
            ${hasProjects ? `
              <button class="view-projects-btn" data-id="${friend.id}">
                <i class="fa-solid fa-project-diagram"></i> View Projects
              </button>
            ` : ''}
            <button class="remove-friend-btn" data-id="${friend.id}">
              <i class="fa-solid fa-user-minus"></i> Remove
            </button>
          </div>
        </div>
      `;

      friendsList.appendChild(friendCard);

      // Add event listeners
      const removeBtn = friendCard.querySelector(".remove-friend-btn");
      removeBtn.addEventListener("click", () => {
        removeFriend(friend.id);
      });
      
      const selectReposBtn = friendCard.querySelector(".select-repos-btn");
      selectReposBtn.addEventListener("click", async () => {
        await openRepositoryModal(friend);
      });
      
      if (hasProjects) {
        const viewProjectsBtn = friendCard.querySelector(".view-projects-btn");
        viewProjectsBtn.addEventListener("click", () => {
          filterProjectsByFriend(friend.id);
          
          // Switch to projects section
          document.querySelector('.nav-link[data-section="projects-section"]').click();
        });
      }
    });
  }

  function filterFriends(filter) {
    // Get all friend cards
    const friendCards = document.querySelectorAll(".friend-card");
    
    // Show all friends first
    friendCards.forEach(card => {
      card.style.display = "flex";
    });
    
    if (filter === "all") return;
    
    // Sort and filter based on selected filter
    let sortedFriends = [...friends];
    
    if (filter === "recent") {
      sortedFriends.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));
    } else if (filter === "most-repos") {
      sortedFriends.sort((a, b) => (b.repos || 0) - (a.repos || 0));
    } else if (filter === "most-followers") {
      sortedFriends.sort((a, b) => (b.followers || 0) - (a.followers || 0));
    }
    
    // Clear and redisplay friends list
    friendsList.innerHTML = "";
    displayFriends();
  }

  function removeFriend(id) {
    // Find friend name before removal
    const friend = friends.find((f) => f.id === id);
    const friendName = friend ? friend.login : "Friend";

    // Remove friend from array
    friends = friends.filter((friend) => friend.id !== id);

    // Save to localStorage
    localStorage.setItem("githubFriends", JSON.stringify(friends));

    // Update UI
    if (friends.length === 0) {
      friendsContainer.classList.add("hidden");
    } else {
      displayFriends();
    }

    // Update add friend button if current user is the removed friend
    if (currentUser && currentUser.id === id) {
      addFriendBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Add as Friend';
      addFriendBtn.disabled = false;
    }

    // Show notification
    showNotification(`${friendName} removed from friends`);
    
    // Update projects if needed
    updateProjectsAfterFriendRemoval(id);
  }
  
  function updateProjectsAfterFriendRemoval(friendId) {
    // Filter out projects where the removed friend was the only collaborator
    collaborativeProjects = collaborativeProjects.filter(project => {
      // Keep projects with other collaborators
      const otherCollaborators = project.collaborators.filter(collab => collab.id !== friendId);
      if (otherCollaborators.length > 0) {
        // Update project collaborators
        project.collaborators = otherCollaborators;
        return true;
      }
      return false;
    });
    
    // Save updated projects
    localStorage.setItem("collaborativeProjects", JSON.stringify(collaborativeProjects));
    
    // Update UI
    if (collaborativeProjects.length > 0) {
      displayProjects();
    } else {
      projectsContainer.classList.add("hidden");
    }
  }

  function showNotification(message, isError = false) {
    notificationMessage.textContent = message;
    notification.className = "notification" + (isError ? " error" : "");
    
    // Update icon
    const icon = notification.querySelector(".notification-icon i");
    if (isError) {
      icon.className = "fa-solid fa-circle-exclamation";
    } else {
      icon.className = "fa-solid fa-circle-check";
    }

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
  
  // Functions - Repository Selection
  async function openRepositoryModal(friend) {
    currentFriend = friend;
    repoFriendName.textContent = `Select repositories to collaborate with ${friend.name}`;
    
    // Show loading state in repo list
    repoList.innerHTML = "<div class='repo-item'>Loading repositories...</div>";
    repoModal.classList.remove("hidden");
    
    try {
      // Fetch friend's repositories
      const response = await fetch(`https://api.github.com/users/${friend.login}/repos?sort=updated&per_page=100`);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("API rate limit exceeded. Please try again later.");
        } else {
          throw new Error(`GitHub API error: ${response.status}`);
        }
      }

      const repos = await response.json();
      userRepositories = repos.map(repo => ({
        id: repo.id.toString(),
        name: repo.name,
        description: repo.description,
        language: repo.language,
        updated_at: repo.updated_at,
        html_url: repo.html_url,
        owner: repo.owner.login
      }));
      
      // Display repositories
      displayRepositories(userRepositories);
    } catch (error) {
      console.error("Error fetching repositories:", error);
      repoList.innerHTML = `<div class='repo-item'>Error: ${error.message}</div>`;
    }
  }
  
  function displayRepositories(repos) {
    repoList.innerHTML = ""; // Clear the list

    if (repos.length === 0) {
        repoList.innerHTML = "<div class='repo-item'>No repositories found</div>";
        return;
    }

    repos.forEach(repo => {
        const repoItem = document.createElement("div");
        repoItem.className = "repo-item";

        repoItem.innerHTML = `
            <div>
                <h3>${repo.name}</h3>
                <p>${repo.description || "No description available"}</p>
                <p><strong>Language:</strong> ${repo.language || "N/A"}</p>
                <a href="${repo.html_url}" target="_blank">View Repository</a>
            </div>
        `;

        repoList.appendChild(repoItem);
    });
}
  
  function filterRepositories() {
    const searchTerm = repoSearchInput.value.toLowerCase();
    const filteredRepos = userRepositories.filter(repo => 
      repo.name.toLowerCase().includes(searchTerm) || 
      (repo.description && repo.description.toLowerCase().includes(searchTerm))
    );
    
    displayRepositories(filteredRepos);
  }
  
  function commitChanges() {
    if (!currentProject) {
        showNotification("No project selected to commit changes.", true);
        return;
    }

    if (!currentFile) {
        showNotification("No file selected to commit changes.", true);
        return;
    }

    const commitMsg = commitMessage.value.trim();

    if (!commitMsg) {
        showNotification("Please enter a commit message.", true);
        return;
    }

    // Create a new commit
    const newCommit = {
        id: generateId(),
        message: commitMsg,
        date: new Date().toISOString(),
        author: {
            name: "Current User", // Replace with actual user name if available
            avatar_url: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" // Replace with actual avatar URL if available
        }
    };

    // Add commit to project commits
    if (!projectCommits[currentProject.id]) {
        projectCommits[currentProject.id] = [];
    }

    projectCommits[currentProject.id].push(newCommit);
    localStorage.setItem("projectCommits", JSON.stringify(projectCommits));

    // Update project last modified
    currentProject.updated_at = new Date().toISOString();
    localStorage.setItem("collaborativeProjects", JSON.stringify(collaborativeProjects));

    // Clear the commit message input
    commitMessage.value = "";

    // Update UI
    loadProjectCommits();

    // Show notification
    showNotification(`Changes committed successfully: "${commitMsg}"`);
}

  function saveSelectedRepositories() {
    const checkboxes = repoList.querySelectorAll(".repo-checkbox");
    const selectedRepoIds = [];
    
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedRepoIds.push(checkbox.getAttribute("data-id"));
      }
    });
    
    // Update collaborative projects
    updateCollaborativeProjects(selectedRepoIds);
    
    // Close modal
    repoModal.classList.add("hidden");
    
    // Show notification
    showNotification(`Repository selection updated for ${currentFriend.name}`);
    
    // Update UI
    displayFriends();
    displayProjects();
    projectsContainer.classList.remove("hidden");
  }
  
  function updateCollaborativeProjects(selectedRepoIds) {
    // Remove friend from projects not selected anymore
    collaborativeProjects.forEach(project => {
      if (!selectedRepoIds.includes(project.repo_id)) {
        project.collaborators = project.collaborators.filter(collab => collab.id !== currentFriend.id);
      }
    });
    
    // Filter out projects with no collaborators
    collaborativeProjects = collaborativeProjects.filter(project => project.collaborators.length > 0);
    
    // Add friend to newly selected projects
    selectedRepoIds.forEach(repoId => {
      const existingProject = collaborativeProjects.find(project => project.repo_id === repoId);
      
      if (existingProject) {
        // Add friend as collaborator if not already
        if (!existingProject.collaborators.some(collab => collab.id === currentFriend.id)) {
          existingProject.collaborators.push({
            id: currentFriend.id,
            login: currentFriend.login,
            name: currentFriend.name,
            avatar_url: currentFriend.avatar_url
          });
        }
      } else {
        // Create new project
        const repo = userRepositories.find(repo => repo.id === repoId);
        
        if (repo) {
          const projectId = generateId();
          collaborativeProjects.push({
            id: projectId,
            repo_id: repoId,
            name: repo.name,
            description: repo.description,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            collaborators: [{
              id: currentFriend.id,
              login: currentFriend.login,
              name: currentFriend.name,
              avatar_url: currentFriend.avatar_url
            }]
          });
          
          // Initialize project files and commits
          initializeProjectFiles(repoId, repo);
        }
      }
    });
    
    // Save to localStorage
    localStorage.setItem("collaborativeProjects", JSON.stringify(collaborativeProjects));
  }
  
  function initializeProjectFiles(repoId, repo) {
    // Create initial files for the project
    if (!repo) return;
    
    const projectId = collaborativeProjects.find(project => project.repo_id === repoId).id;
    
    // Create default files based on repository language
    let files = [];
    
    if (repo.language === "HTML" || !repo.language) {
      files = [
        { id: generateId(), name: "index.html", content: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Project</title>\n  <link rel=\"stylesheet\" href=\"styles.css\">\n</head>\n<body>\n  <h1>Welcome to our collaborative project!</h1>\n  <script src=\"script.js\"></script>\n</body>\n</html>" },
        { id: generateId(), name: "styles.css", content: "body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n}" },
        { id: generateId(), name: "script.js", content: "// JavaScript code\nconsole.log('Project initialized!');" }
      ];
    } else if (repo.language === "JavaScript") {
      files = [
        { id: generateId(), name: "index.js", content: "// Main entry point\nconsole.log('Project initialized!');\n\nfunction init() {\n  console.log('Application started');\n}\n\ninit();" },
        { id: generateId(), name: "package.json", content: "{\n  \"name\": \"" + repo.name + "\",\n  \"version\": \"1.0.0\",\n  \"description\": \"" + (repo.description || "Collaborative project") + "\",\n  \"main\": \"index.js\",\n  \"scripts\": {\n    \"start\": \"node index.js\"\n  }\n}" }
      ];
    } else if (repo.language === "Python") {
      files = [
        { id: generateId(), name: "main.py", content: "# Main entry point\n\ndef main():\n    print(\"Project initialized!\")\n\nif __name__ == \"__main__\":\n    main()" },
        { id: generateId(), name: "requirements.txt", content: "# Python dependencies" }
      ];
    } else {
      files = [
        { id: generateId(), name: "README.md", content: `# ${repo.name}\n\n${repo.description || 'A collaborative project'}\n\n## Getting Started\n\nInstructions for getting started with this project.` }
      ];
    }
    
    // Save files
    projectFiles[projectId] = files;
    localStorage.setItem("projectFiles", JSON.stringify(projectFiles));
    
    // Initialize commits
    projectCommits[projectId] = [{
      id: generateId(),
      message: "Initial commit",
      date: new Date().toISOString(),
      author: {
        name: "System",
        avatar_url: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
      }
    }];
    localStorage.setItem("projectCommits", JSON.stringify(projectCommits));
  }
  
  // Functions - Projects
  function displayProjects() {
    projectsList.innerHTML = "";
    
    if (collaborativeProjects.length === 0) {
      projectsList.innerHTML = "<div class='no-projects'>No collaborative projects yet</div>";
      return;
    }
    
    // Sort projects by most recently created
    const sortedProjects = [...collaborativeProjects].sort((a, b) => 
      new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
    );
    
    sortedProjects.forEach(project => {
      const projectCard = document.createElement("div");
      projectCard.className = "project-card";
      projectCard.setAttribute("data-id", project.id);
      
      // Get commit count
      const commitCount = (projectCommits[project.id] || []).length;
      
      // Create collaborator avatars
      const collaboratorAvatars = project.collaborators.map(collab => 
        `<img class="collaborator-avatar" src="${collab.avatar_url}" alt="${collab.login}" title="${collab.name}">`
      ).join("");
      
      projectCard.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || 'No description'}</p>
        <div class="project-meta">
          <span><i class="fa-solid fa-code-commit"></i> ${commitCount} commit${commitCount !== 1 ? 's' : ''}</span>
          <div class="collaborators" title="Collaborators">
            ${collaboratorAvatars}
          </div>
        </div>
      `;
      
      projectsList.appendChild(projectCard);
      
      // Add event listener
      projectCard.addEventListener("click", () => {
        openProject(project.id);
      });
    });
  }
  
  function filterProjects(filter) {
    // Get all projects
    let sortedProjects = [...collaborativeProjects];
    
    if (filter === "recent") {
      sortedProjects.sort((a, b) => 
        new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
      );
    } else if (filter === "most-commits") {
      sortedProjects.sort((a, b) => {
        const aCommits = (projectCommits[a.id] || []).length;
        const bCommits = (projectCommits[b.id] || []).length;
        return bCommits - aCommits;
      });
    }
    
    // Clear and redisplay projects list
    projectsList.innerHTML = "";
    
    if (sortedProjects.length === 0) {
      projectsList.innerHTML = "<div class='no-projects'>No collaborative projects yet</div>";
      return;
    }
    
    sortedProjects.forEach(project => {
      const projectCard = document.createElement("div");
      projectCard.className = "project-card";
      projectCard.setAttribute("data-id", project.id);
      
      // Get commit count
      const commitCount = (projectCommits[project.id] || []).length;
      
      // Create collaborator avatars
      const collaboratorAvatars = project.collaborators.map(collab => 
        `<img class="collaborator-avatar" src="${collab.avatar_url}" alt="${collab.login}" title="${collab.name}">`
      ).join("");
      
      projectCard.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || 'No description'}</p>
        <div class="project-meta">
          <span><i class="fa-solid fa-code-commit"></i> ${commitCount} commit${commitCount !== 1 ? 's' : ''}</span>
          <div class="collaborators" title="Collaborators">
            ${collaboratorAvatars}
          </div>
        </div>
      `;
      
      projectsList.appendChild(projectCard);
      
      // Add event listener
      projectCard.addEventListener("click", () => {
        openProject(project.id);
      });
    });
  }
  
  function filterProjectsByFriend(friendId) {
    // Filter projects where the friend is a collaborator
    const filteredProjects = collaborativeProjects.filter(project => 
      project.collaborators.some(collab => collab.id === friendId)
    );
    
    // Display filtered projects
    projectsList.innerHTML = "";
    
    if (filteredProjects.length === 0) {
      projectsList.innerHTML = "<div class='no-projects'>No collaborative projects with this friend</div>";
      return;
    }
    
    filteredProjects.forEach(project => {
      const projectCard = document.createElement("div");
      projectCard.className = "project-card";
      projectCard.setAttribute("data-id", project.id);
      
      // Get commit count
      const commitCount = (projectCommits[project.id] || []).length;
      
      // Create collaborator avatars
      const collaboratorAvatars = project.collaborators.map(collab => 
        `<img class="collaborator-avatar" src="${collab.avatar_url}" alt="${collab.login}" title="${collab.name}">`
      ).join("");
      
      projectCard.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || 'No description'}</p>
        <div class="project-meta">
          <span><i class="fa-solid fa-code-commit"></i> ${commitCount} commit${commitCount !== 1 ? 's' : ''}</span>
          <div class="collaborators" title="Collaborators">
            ${collaboratorAvatars}
          </div>
        </div>
      `;
      
      projectsList.appendChild(projectCard);
      
      // Add event listener
      projectCard.addEventListener("click", () => {
        openProject(project.id);
      });
    });
    
    // Show projects container
    projectsContainer.classList.remove("hidden");
  }
  
  function openProject(projectId) {
    // Get project data
    currentProject = collaborativeProjects.find(project => project.id === projectId);
    
    if (!currentProject) {
      showNotification("Project not found", true);
      return;
    }
    
    // Update project details
    projectName.textContent = currentProject.name;
    projectDescription.textContent = currentProject.description || 'No description';
    
    // Load project data
    loadProjectCommits();
    loadProjectFiles();
    loadCodespaceFiles();
    
    // Show project details and hide projects list
    projectsContainer.classList.add("hidden");
    projectDetails.classList.remove("hidden");
    
    // Reset to commits tab
    document.querySelector('.tab-btn[data-tab="commits"]').click();
  }
  
  function loadProjectCommits() {
    commitsList.innerHTML = "";
    
    const commits = projectCommits[currentProject.id] || [];
    
    if (commits.length === 0) {
      commitsList.innerHTML = "<div class='no-commits'>No commits yet</div>";
      return;
    }
    
    // Sort commits by date (newest first)
    const sortedCommits = [...commits].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    sortedCommits.forEach(commit => {
      const commitItem = document.createElement("div");
      commitItem.className = "commit-item";
      
      const formattedDate = formatDate(commit.date);
      
      commitItem.innerHTML = `
        <div class="commit-header">
          <div class="commit-message">${commit.message}</div>
          <div class="commit-date">${formattedDate}</div>
        </div>
        <div class="commit-author">
          <img class="commit-avatar" src="${commit.author.avatar_url}" alt="${commit.author.name}">
          <span>${commit.author.name}</span>
        </div>
      `;
      
      commitsList.appendChild(commitItem);
    });
  }
  
  function loadProjectFiles() {
    filesList.innerHTML = "";
    
    const files = projectFiles[currentProject.id] || [];
    
    if (files.length === 0) {
      filesList.innerHTML = "<div class='no-files'>No files in this project</div>";
      return;
    }
    
    // Sort files alphabetically
    const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedFiles.forEach(file => {
      const fileItem = document.createElement("div");
      fileItem.className = "file-item";
      
      // Determine file icon based on extension
      let fileIcon = "📄";
      const extension = file.name.split('.').pop().toLowerCase();
      
      if (extension === "html") fileIcon = "🌐";
      else if (extension === "css") fileIcon = "🎨";
      else if (extension === "js") fileIcon = "📜";
      else if (extension === "json") fileIcon = "📋";
      else if (extension === "md") fileIcon = "📝";
      else if (extension === "py") fileIcon = "🐍";
      
      fileItem.innerHTML = `
        <div class="file-icon">${fileIcon}</div>
        <div class="file-name">${file.name}</div>
        <div class="file-meta">${file.content.length} bytes</div>
      `;
      
      filesList.appendChild(fileItem);
    });
  }
  
  function loadCodespaceFiles() {
    codespaceFiles.innerHTML = "";
    
    const files = projectFiles[currentProject.id] || [];
    
    if (files.length === 0) {
      codespaceFiles.innerHTML = "<div class='no-files'>No files in this project</div>";
      return;
    }
    
    // Sort files alphabetically
    const sortedFiles = [...files].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedFiles.forEach(file => {
      const fileItem = document.createElement("div");
      fileItem.className = "codespace-file";
      fileItem.setAttribute("data-id", file.id);
      
      // Determine file icon based on extension
      let fileIcon = "📄";
      const extension = file.name.split('.').pop().toLowerCase();
      
      if (extension === "html") fileIcon = "🌐";
      else if (extension === "css") fileIcon = "🎨";
      else if (extension === "js") fileIcon = "📜";
      else if (extension === "json") fileIcon = "📋";
      else if (extension === "md") fileIcon = "📝";
      else if (extension === "py") fileIcon = "🐍";
      
      fileItem.innerHTML = `
        <span class="file-icon">${fileIcon}</span>
        <span>${file.name}</span>
      `;
      
      codespaceFiles.appendChild(fileItem);
      
      // Add event listener
      fileItem.addEventListener("click", () => {
        openFileInEditor(file.id);
      });
    });
  }
  
  function openFileInEditor(fileId) {
    // Check for unsaved changes
    if (unsavedChanges && currentFile) {
      if (!confirm("You have unsaved changes. Do you want to discard them?")) {
        return;
      }
    }
    
    // Get file data
    const files = projectFiles[currentProject.id] || [];
    const file = files.find(f => f.id === fileId);
    
    if (!file) {
      showNotification("File not found", true);
      return;
    }
    
    // Update current file
    currentFile = file;
    
    // Update UI
    document.querySelectorAll(".codespace-file").forEach(el => {
      el.classList.remove("active");
    });
    document.querySelector(`.codespace-file[data-id="${fileId}"]`).classList.add("active");
    
    currentFileElement.textContent = file.name;
    codeEditor.value = file.content;
    saveFileBtn.disabled = true;
    unsavedChanges = false;
  }
  
  function saveCurrentFile() {
    if (!currentFile || !currentProject) return;
    
    // Update file content
    const files = projectFiles[currentProject.id] || [];
    const fileIndex = files.findIndex(f => f.id === currentFile.id);
    
    if (fileIndex === -1) return;
    
    files[fileIndex].content = codeEditor.value;
    
    // Save to localStorage
    projectFiles[currentProject.id] = files;
    localStorage.setItem("projectFiles", JSON.stringify(projectFiles));
    
    // Update project last modified
    currentProject.updated_at = new Date().toISOString();
    localStorage.setItem("collaborativeProjects", JSON.stringify(collaborativeProjects));
    
    // Update UI
    saveFileBtn.disabled = true;
    unsavedChanges = false;
    
    // Show notification
    showNotification(`File ${currentFile.name} saved`);
  }
  
  function createNewFile() {
    const fileName = newFileName.value.trim();

    if (!fileName) {
        showNotification("Please enter a file name", true);
        return;
    }

    // Check if file already exists
    const files = projectFiles[currentProject.id] || [];
    if (files.some(f => f.name === fileName)) {
        showNotification("A file with this name already exists", true);
        return;
    }

    // Create a new file
    const newFile = {
        id: generateId(),
        name: fileName,
        content: ""
    };

    // Add to project files
    files.push(newFile);
    projectFiles[currentProject.id] = files;
    localStorage.setItem("projectFiles", JSON.stringify(projectFiles));

    // Update project last modified
    currentProject.updated_at = new Date().toISOString();
    localStorage.setItem("collaborativeProjects", JSON.stringify(collaborativeProjects));

    // Update UI
    loadCodespaceFiles();

    // Open the new file in the editor
    openFileInEditor(newFile.id);

    // Close the "Add File" modal
    addFileModal.classList.add("hidden");

    // Show a notification
    showNotification(`File "${fileName}" created successfully!`);
}});