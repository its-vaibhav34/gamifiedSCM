document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
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
  
  // Repository Modal Elements
  const repoModal = document.getElementById("repo-modal");
  const repoFriendName = document.getElementById("repo-friend-name");
  const repoSearchInput = document.getElementById("repo-search-input");
  const repoList = document.getElementById("repo-list");
  const saveReposBtn = document.getElementById("save-repos-btn");
  const closeModalBtns = document.querySelectorAll(".close-modal");
  
  // Projects Elements
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
  
  // Codespace Elements
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

  // Current user data
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

  // Initialize dark mode
  initDarkMode();

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

  // Event Listeners
  searchBtn.addEventListener("click", searchUser);
  usernameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchUser();
    }
  });
  addFriendBtn.addEventListener("click", addFriend);
  
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
  if (backToProjectsBtn) {
    backToProjectsBtn.addEventListener("click", () => {
      projectDetails.classList.add("hidden");
      projectsContainer.classList.remove("hidden");
    });
  }
  
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
  if (addFileBtn) {
    addFileBtn.addEventListener("click", () => {
      addFileModal.classList.remove("hidden");
      newFileName.value = "";
      newFileName.focus();
    });
  }
  
  if (createFileBtn) createFileBtn.addEventListener("click", createNewFile);
  if (saveFileBtn) saveFileBtn.addEventListener("click", saveCurrentFile);
  if (commitChangesBtn) commitChangesBtn.addEventListener("click", commitChanges);
  
  if (codeEditor) {
    codeEditor.addEventListener("input", () => {
      unsavedChanges = true;
      saveFileBtn.disabled = false;
    });
  }

  // Friend filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filter = button.getAttribute('data-filter');
        
        // Filter friends
        filterFriends(filter);
      });
    });
  }

  // Functions
  function initDarkMode() {
    const darkModeToggle = document.getElementById("darkModeToggle");
    
    if (!darkModeToggle) return;
    
    // Check if dark mode is enabled in localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      darkModeToggle.checked = true;
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener("change", () => {
      if (darkModeToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
      }
    });
  }

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

      // Reset UI
      userProfile.classList.add("hidden");
      errorMessage.classList.add("hidden");

      // Fetch user data from GitHub API
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("API rate limit exceeded. Please try again later.");
        } else if (response.status === 404) {
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
      userRepos.textContent = `${userData.public_repos} Repositories`;
      userFollowers.textContent = `${userData.followers} Followers`;
      userFollowing.textContent = `${userData.following} Following`;
      userProfileLink.href = userData.html_url;

      // Check if user is already a friend
      const isFriend = friends.some((friend) => friend.id === userData.id);
      if (isFriend) {
        addFriendBtn.textContent = "Already a Friend";
        addFriendBtn.disabled = true;
      } else {
        addFriendBtn.textContent = "Add as Friend";
        addFriendBtn.disabled = false;
      }

      // Show user profile
      userProfile.classList.remove("hidden");
      
      // Fetch user repositories
      await fetchUserRepositories(username);
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
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      
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
      collaborating: false
    });

    // Save to localStorage
    localStorage.setItem("githubFriends", JSON.stringify(friends));

    // Update UI
    displayFriends();
    friendsContainer.classList.remove("hidden");

    // Update add friend button
    addFriendBtn.textContent = "Already a Friend";
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
      const friendCard = document.createElement("div");
      friendCard.className = "friend-card";
      
      // Set data attributes for filtering
      friendCard.setAttribute("data-added", friend.added_at);
      friendCard.setAttribute("data-repos", friend.repos || 0);
      friendCard.setAttribute("data-followers", friend.followers || 0);
      
      // Check if friend has collaborative projects
      const hasProjects = collaborativeProjects.some(project => 
        project.collaborators && project.collaborators.some(collab => collab.id === friend.id)
      );
      
      // Update collaborating status
      friend.collaborating = hasProjects;
      friendCard.setAttribute("data-collaborating", hasProjects ? "true" : "false");
      
      friendCard.innerHTML = `
        <img class="friend-avatar" src="${friend.avatar_url}" alt="${friend.login}">
        <div class="friend-info">
          <div class="friend-name">${friend.name}</div>
          <div class="friend-login">@${friend.login}</div>
        </div>
        <div class="friend-actions">
          <a href="${friend.html_url}" target="_blank" class="view-profile">View Profile</a>
          <button class="select-repos" data-id="${friend.id}">Select Repositories</button>
          ${hasProjects ? `<button class="view-projects" data-id="${friend.id}">View Projects</button>` : ''}
          <button class="remove-friend" data-id="${friend.id}">Remove</button>
        </div>
      `;

      friendsList.appendChild(friendCard);

      // Add event listeners
      const removeBtn = friendCard.querySelector(".remove-friend");
      removeBtn.addEventListener("click", () => {
        removeFriend(friend.id);
      });
      
      const selectReposBtn = friendCard.querySelector(".select-repos");
      selectReposBtn.addEventListener("click", async () => {
        await openRepositoryModal(friend);
      });
      
      if (hasProjects) {
        const viewProjectsBtn = friendCard.querySelector(".view-projects");
        viewProjectsBtn.addEventListener("click", () => {
          filterProjectsByFriend(friend.id);
        });
      }
    });
  }

  function filterFriends(filter) {
    const friendCards = document.querySelectorAll('.friend-card');
    
    friendCards.forEach(card => {
      if (filter === 'all') {
        card.style.display = 'flex';
      } else if (filter === 'recent') {
        // Show only friends added in the last 7 days
        const addedDate = new Date(card.getAttribute('data-added'));
        const now = new Date();
        const diffTime = Math.abs(now - addedDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 7) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      } else if (filter === 'most-repos') {
        // Sort by repository count (show all but in sorted order)
        const friendCards = Array.from(document.querySelectorAll('.friend-card'));
        const sortedCards = friendCards.sort((a, b) => {
          return parseInt(b.getAttribute('data-repos')) - parseInt(a.getAttribute('data-repos'));
        });
        
        // Remove and re-append in sorted order
        sortedCards.forEach(card => {
          card.parentNode.appendChild(card);
          card.style.display = 'flex';
        });
      } else if (filter === 'most-followers') {
        // Sort by follower count (show all but in sorted order)
        const friendCards = Array.from(document.querySelectorAll('.friend-card'));
        const sortedCards = friendCards.sort((a, b) => {
          return parseInt(b.getAttribute('data-followers')) - parseInt(a.getAttribute('data-followers'));
        });
        
        // Remove and re-append in sorted order
        sortedCards.forEach(card => {
          card.parentNode.appendChild(card);
          card.style.display = 'flex';
        });
      } else if (filter === 'collaborating') {
        // Show only friends with active collaborations
        if (card.getAttribute('data-collaborating') === 'true') {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      }
    });
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
      addFriendBtn.textContent = "Add as Friend";
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
      if (!project.collaborators) return false;
      
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
    notification.textContent = message;
    notification.className = "notification" + (isError ? " error" : "");

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
  
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
    repoList.innerHTML = "";
    
    if (repos.length === 0) {
      repoList.innerHTML = "<div class='repo-item'>No repositories found</div>";
      return;
    }
    
    // Get existing collaborations for this friend
    const existingCollabs = collaborativeProjects
      .filter(project => project.collaborators && project.collaborators.some(collab => collab.id === currentFriend.id))
      .map(project => project.repo_id);
    
    repos.forEach(repo => {
      const isCollaborating = existingCollabs.includes(repo.id);
      
      const repoItem = document.createElement("div");
      repoItem.className = "repo-item";
      
      // Determine language color
      let languageColor = "#ccc";
      if (repo.language === "JavaScript") languageColor = "#f1e05a";
      else if (repo.language === "HTML") languageColor = "#e34c26";
      else if (repo.language === "CSS") languageColor = "#563d7c";
      else if (repo.language === "Python") languageColor = "#3572A5";
      else if (repo.language === "Java") languageColor = "#b07219";
      
      repoItem.innerHTML = `
        <input type="checkbox" class="repo-checkbox" data-id="${repo.id}" ${isCollaborating ? 'checked' : ''}>
        <div>
          <div class="repo-name">${repo.name}</div>
          <div class="repo-description">${repo.description || 'No description'}</div>
          <div class="repo-meta">
            ${repo.language ? `<span class="repo-language"><span class="language-color" style="background-color: ${languageColor}"></span>${repo.language}</span>` : ''}
            <span class="repo-updated">Updated ${formatDate(repo.updated_at)}</span>
          </div>
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
    collaborativeProjects = collaborativeProjects.filter(project => 
      project.collaborators && project.collaborators.length > 0
    );
    
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
    
    // Update friend's collaborating status
    const friendIndex = friends.findIndex(friend => friend.id === currentFriend.id);
    if (friendIndex !== -1) {
      friends[friendIndex].collaborating = selectedRepoIds.length > 0;
      localStorage.setItem("githubFriends", JSON.stringify(friends));
    }
    
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
  
  function displayProjects() {
    projectsList.innerHTML = "";
    
    if (collaborativeProjects.length === 0) {
      projectsList.innerHTML = "<div class='no-projects'>No collaborative projects yet</div>";
      return;
    }
    
    // Sort projects by most recently created
    const sortedProjects = [...collaborativeProjects].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );
    
    sortedProjects.forEach(project => {
      if (!project.collaborators || project.collaborators.length === 0) return;
      
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
          <span>${commitCount} commit${commitCount !== 1 ? 's' : ''}</span>
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
      project.collaborators && project.collaborators.some(collab => collab.id === friendId)
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
          <span>${commitCount} commit${commitCount !== 1 ? 's' : ''}</span>
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
    if (projectName) projectName.textContent = currentProject.name;
    if (projectDescription) projectDescription.textContent = currentProject.description || 'No description';
    
    // Load project data
    if (typeof loadProjectCommits === 'function') loadProjectCommits();
    if (typeof loadProjectFiles === 'function') loadProjectFiles();
    if (typeof loadCodespaceFiles === 'function') loadCodespaceFiles();
    
    // Show project details and hide projects list
    if (projectsContainer && projectDetails) {
      projectsContainer.classList.add("hidden");
      projectDetails.classList.remove("hidden");
    
      // Reset to commits tab
      const commitsTab = document.querySelector('.tab-btn[data-tab="commits"]');
      if (commitsTab) commitsTab.click();
    }
  }
  
  function loadProjectCommits() {
    if (!commitsList) return;
    
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
    if (!filesList) return;
    
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
    if (!codespaceFiles) return;
    
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
    
    if (currentFileElement) currentFileElement.textContent = file.name;
    if (codeEditor) {
      codeEditor.value = file.content;
      saveFileBtn.disabled = true;
    }
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
    
    // Create new file
    const newFile = {
      id: generateId(),
      name: fileName,
      content: ""
    };
    
    // Add to project files
    files.push(newFile);
    projectFiles[currentProject.id] = files;
    localStorage.setItem("projectFiles", JSON.stringify(projectFiles));
    
    // Update UI
    loadCodespaceFiles();
    
    // Open new file in editor
    setTimeout(() => {
      openFileInEditor(newFile.id);
    }, 100);
    
    // Close modal
    addFileModal.classList.add("hidden");
    
    // Show notification
    showNotification(`File ${fileName} created`);
  }
  
  function commitChanges() {
    const message = commitMessage.value.trim();
    
    if (!message) {
      showNotification("Please enter a commit message", true);
      return;
    }
    
    // Check for unsaved changes
    if (unsavedChanges && currentFile) {
      if (confirm("You have unsaved changes. Do you want to save them before committing?")) {
        saveCurrentFile();
      }
    }
    
    // Create new commit
    const commits = projectCommits[currentProject.id] || [];
    
    const newCommit = {
      id: generateId(),
      message: message,
      date: new Date().toISOString(),
      author: {
        name: "You",
        avatar_url: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
      }
    };
    
    // Add to project commits
    commits.push(newCommit);
    projectCommits[currentProject.id] = commits;
    localStorage.setItem("projectCommits", JSON.stringify(projectCommits));
    
    // Update UI
    loadProjectCommits();
    
    // Clear commit message
    commitMessage.value = "";
    
    // Show notification
    showNotification("Changes committed successfully");
  }
  
  // Helper functions
  function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today
      return `today at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (diffDays === 1) {
      // Yesterday
      return `yesterday at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (diffDays < 7) {
      // This week
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      // This month
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      // This year
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      // More than a year
      return date.toLocaleDateString();
    }
  }
});