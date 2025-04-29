document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const usernameInput = document.getElementById("username-input")
    const searchBtn = document.getElementById("search-btn")
    const userProfile = document.getElementById("user-profile")
    const userAvatar = document.getElementById("user-avatar")
    const userName = document.getElementById("user-name")
    const userLogin = document.getElementById("user-login")
    const userBio = document.getElementById("user-bio")
    const userRepos = document.getElementById("user-repos")
    const userFollowers = document.getElementById("user-followers")
    const userFollowing = document.getElementById("user-following")
    const userProfileLink = document.getElementById("user-profile-link")
    const addFriendBtn = document.getElementById("add-friend-btn")
    const errorMessage = document.getElementById("error-message")
    const friendsContainer = document.getElementById("friends-container")
    const friendsList = document.getElementById("friends-list")
    const notification = document.getElementById("notification")
  
    // Current user data
    let currentUser = null
  
    // Load friends from localStorage
    let friends = JSON.parse(localStorage.getItem("githubFriends")) || []
  
    // Display friends if any exist
    if (friends.length > 0) {
      displayFriends()
      friendsContainer.classList.remove("hidden")
    }
  
    // Event Listeners
    searchBtn.addEventListener("click", searchUser)
    usernameInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchUser()
      }
    })
    addFriendBtn.addEventListener("click", addFriend)
  
    // Functions
    async function searchUser() {
      const username = usernameInput.value.trim()
  
      if (!username) {
        showNotification("Please enter a GitHub username", true)
        return
      }
  
      try {
        // Show loading state
        searchBtn.textContent = "Searching..."
        searchBtn.disabled = true
  
        // Reset UI
        userProfile.classList.add("hidden")
        errorMessage.classList.add("hidden")
  
        // Fetch user data from GitHub API
        const response = await fetch(`https://api.github.com/users/${username}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer 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',
              'Accept': 'application/vnd.github+json'
            }
          })
            
        if (!response.ok) {
          throw new Error("User not found")
        }
  
        const userData = await response.json()
        currentUser = userData
  
        // Display user data
        userAvatar.src = userData.avatar_url
        userName.textContent = userData.name || userData.login
        userLogin.textContent = `@${userData.login}`
        userBio.textContent = userData.bio || "No bio available"
        userRepos.textContent = `${userData.public_repos} Repositories`
        userFollowers.textContent = `${userData.followers} Followers`
        userFollowing.textContent = `${userData.following} Following`
        userProfileLink.href = userData.html_url
  
        // Check if user is already a friend
        const isFriend = friends.some((friend) => friend.id === userData.id)
        if (isFriend) {
          addFriendBtn.textContent = "Already a Friend"
          addFriendBtn.disabled = true
        } else {
          addFriendBtn.textContent = "Add as Friend"
          addFriendBtn.disabled = false
        }
  
        // Show user profile
        userProfile.classList.remove("hidden")
      } catch (error) {
        console.error("Error fetching user:", error)
        errorMessage.classList.remove("hidden")
      } finally {
        // Reset button state
        searchBtn.textContent = "Search"
        searchBtn.disabled = false
      }
    }
  
    function addFriend() {
      if (!currentUser) return
  
      // Check if already a friend
      if (friends.some((friend) => friend.id === currentUser.id)) {
        showNotification("This user is already your friend", true)
        return
      }
  
      // Add to friends array
      friends.push({
        id: currentUser.id,
        login: currentUser.login,
        name: currentUser.name || currentUser.login,
        avatar_url: currentUser.avatar_url,
        html_url: currentUser.html_url,
        added_at: new Date().toISOString(),
      })
  
      // Save to localStorage
      localStorage.setItem("githubFriends", JSON.stringify(friends))
  
      // Update UI
      displayFriends()
      friendsContainer.classList.remove("hidden")
  
      // Update add friend button
      addFriendBtn.textContent = "Already a Friend"
      addFriendBtn.disabled = true
  
      // Show notification
      showNotification(`${currentUser.login} added as a friend!`)
    }
  
    function displayFriends() {
      // Clear friends list
      friendsList.innerHTML = ""
  
      // Sort friends by most recently added
      const sortedFriends = [...friends].sort((a, b) => new Date(b.added_at) - new Date(a.added_at))
  
      // Create friend cards
      sortedFriends.forEach((friend) => {
        const friendCard = document.createElement("div")
        friendCard.className = "friend-card"
        friendCard.innerHTML = `
                  <img class="friend-avatar" src="${friend.avatar_url}" alt="${friend.login}">
                  <div class="friend-info">
                      <div class="friend-name">${friend.name}</div>
                      <div class="friend-login">@${friend.login}</div>
                  </div>
                  <a href="${friend.html_url}" target="_blank" class="view-profile">View Profile</a>
                  <button class="remove-friend" data-id="${friend.id}">Remove</button>
              `
  
        friendsList.appendChild(friendCard)
  
        // Add event listener to remove button
        const removeBtn = friendCard.querySelector(".remove-friend")
        removeBtn.addEventListener("click", () => {
          removeFriend(friend.id)
        })
      })
    }
  
    function removeFriend(id) {
      // Find friend name before removal
      const friend = friends.find((f) => f.id === id)
      const friendName = friend ? friend.login : "Friend"
  
      // Remove friend from array
      friends = friends.filter((friend) => friend.id !== id)
  
      // Save to localStorage
      localStorage.setItem("githubFriends", JSON.stringify(friends))
  
      // Update UI
      if (friends.length === 0) {
        friendsContainer.classList.add("hidden")
      } else {
        displayFriends()
      }
  
      // Update add friend button if current user is the removed friend
      if (currentUser && currentUser.id === id) {
        addFriendBtn.textContent = "Add as Friend"
        addFriendBtn.disabled = false
      }
  
      // Show notification
      showNotification(`${friendName} removed from friends`)
    }
  
    function showNotification(message, isError = false) {
      notification.textContent = message
      notification.className = "notification" + (isError ? " error" : "")
  
      // Show notification
      setTimeout(() => {
        notification.classList.add("show")
      }, 10)
  
      // Hide notification after 3 seconds
      setTimeout(() => {
        notification.classList.remove("show")
      }, 3000)
    }
  })
  // Filter functionality for GitHub friends
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.friends-filter .filter-btn');
  
  filterButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Update active button
          document.querySelector('.friends-filter .filter-btn.active').classList.remove('active');
          button.classList.add('active');
          
          const filterType = button.getAttribute('data-filter');
          const friendCards = document.querySelectorAll('.friend-card');
          
          // This is just a demo - in a real implementation, you would sort the actual friend data
          if (filterType === 'all') {
              // Show all friends
              friendCards.forEach(card => {
                  card.style.display = 'flex';
              });
          } else if (filterType === 'recent') {
              // In a real implementation, you would sort by date added
              // For demo, we'll just randomize
              const randomOrder = [...friendCards].sort(() => Math.random() - 0.5);
              friendCards.forEach(card => {
                  card.style.display = 'none';
              });
              randomOrder.forEach(card => {
                  card.style.display = 'flex';
              });
          } else if (filterType === 'most-repos') {
              // In a real implementation, you would sort by repository count
              // For demo, we'll just show some and hide others
              friendCards.forEach((card, index) => {
                  if (index % 2 === 0) {
                      card.style.display = 'flex';
                  } else {
                      card.style.display = 'none';
                  }
              });
          } else if (filterType === 'most-followers') {
              // In a real implementation, you would sort by follower count
              // For demo, we'll just show some and hide others
              friendCards.forEach((card, index) => {
                  if (index % 2 === 1) {
                      card.style.display = 'flex';
                  } else {
                      card.style.display = 'none';
                  }
              });
          }
      });
  });
});