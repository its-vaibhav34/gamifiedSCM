document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    let links = "";
  
    if (currentPage === "index.html" || currentPage === "") {
      links = `
        <li><a href="index.html#home">Home</a></li>
        <li><a href="index.html#challenges">Challenges</a></li>
        <li><a href="index.html#leaderboard">Leaderboard</a></li>
        <li><a href="index.html#profile">Profile</a></li>
        <li><a href="index.html#documentation">Docs</a></li>
        <li><a href="index.html#settings">Settings</a></li>
        <li><a href="index.html#forum">Forum</a></li>
        <li><a class="active" href="git.html" id="collaboration-link">Collaboration</a></li>
      `;
    } else if (currentPage === "git.html") {
      links = `
        <li><a href="index.html#home">Home</a></li>
        <li><a href="index.html#challenges">Challenges</a></li>
        <li><a href="index.html#leaderboard">Leaderboard</a></li>
        <li><a href="index.html#profile">Profile</a></li>
        <li><a href="index.html#documentation">Docs</a></li>
        <li><a href="index.html#settings">Settings</a></li>
        <li><a href="index.html#forum">Forum</a></li>
        <li><a class="active" href="git.html" id="collaboration-link">Collaboration</a></li>
      `;
    }
  
    document.getElementById("navbar-links").innerHTML = links;
  });