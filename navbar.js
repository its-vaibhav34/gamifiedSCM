document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    let links = "";
  
    if (currentPage === "index.html" || currentPage === "") {
      links = `
        <li><a href="#home">Home</a></li>
        <li><a href="#challenges">Challenges</a></li>
        <li><a href="#leaderboard">Leaderboard</a></li>
        <li><a href="#profile">Profile</a></li>
        <li><a href="#documentation">Docs</a></li>
        <li><a href="#settings">Settings</a></li>
        <li><a href="#forum">Forum</a></li>
        <li><a href="git.html" id="collaboration-link">Collaboration</a></li>
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
        <li><a href="git.html" id="collaboration-link">Collaboration</a></li>
      `;
    }
  
    document.getElementById("navbar-links").innerHTML = links;
  
    // Now handle only # links
    const navLinks = document.querySelectorAll("#navbar-links a");
    const sections = document.querySelectorAll("section");
  
    navLinks.forEach(link => {
      const href = link.getAttribute("href");
  
      if (href.startsWith("#")) {
        // Sirf # wale links pe hi event prevent karenge
        link.addEventListener("click", event => {
          event.preventDefault();
  
          sections.forEach(section => {
            section.classList.remove("active-section");
            section.classList.add("hidden-section");
          });
  
          const targetId = href.substring(1);
          const targetSection = document.getElementById(targetId);
  
          if (targetSection) {
            targetSection.classList.remove("hidden-section");
            targetSection.classList.add("active-section");
          }
  
          navLinks.forEach(navLink => navLink.classList.remove("active"));
          link.classList.add("active");
        });
      }
      // Agar href normal link (jaise git.html) hai, kuch mat karo → browser apne aap open karega
    });
  });
  