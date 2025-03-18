document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  const navLinks = document.querySelectorAll("nav ul li a")
  const sections = document.querySelectorAll("main section")

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Update active nav link
      document.querySelector("nav ul li.active").classList.remove("active")
      this.parentElement.classList.add("active")

      // Show corresponding section
      const targetId = this.getAttribute("href").substring(1)
      sections.forEach((section) => {
        section.classList.add("hidden-section")
        section.classList.remove("active-section")
      })
      document.getElementById(targetId).classList.remove("hidden-section")
      document.getElementById(targetId).classList.add("active-section")
    })
  })

  // Start Journey Button
  const startJourneyBtn = document.getElementById("start-journey")
  if (startJourneyBtn) {
    startJourneyBtn.addEventListener("click", () => {
      // Navigate to challenges section
      document.querySelector("nav ul li.active").classList.remove("active")
      document.querySelector('nav ul li a[href="#challenges"]').parentElement.classList.add("active")

      sections.forEach((section) => {
        section.classList.add("hidden-section")
        section.classList.remove("active-section")
      })
      document.getElementById("challenges").classList.remove("hidden-section")
      document.getElementById("challenges").classList.add("active-section")
    })
  }

  // Challenge Filtering
  const filterBtns = document.querySelectorAll(".filter-btn")
  const challengeCards = document.querySelectorAll(".challenge-card")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Update active filter button
      document.querySelector(".filter-btn.active").classList.remove("active")
      this.classList.add("active")

      const difficulty = this.getAttribute("data-difficulty")

      challengeCards.forEach((card) => {
        if (difficulty === "all" || card.getAttribute("data-difficulty") === difficulty) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  })

  // Leaderboard Tabs
  const tabBtns = document.querySelectorAll(".tab-btn")

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Update active tab button
      document.querySelector(".tab-btn.active").classList.remove("active")
      this.classList.add("active")

      // In a real app, this would fetch different leaderboard data
      const period = this.getAttribute("data-period")
      console.log(`Showing ${period} leaderboard`)
    })
  })

  // Challenge Modal
  const challengeBtns = document.querySelectorAll(".start-challenge-btn")
  const modal = document.getElementById("challenge-modal")
  const closeModal = document.querySelector(".close-modal")

  challengeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.style.display = "block"
      // In a real app, this would load the specific challenge data
    })
  })

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none"
    })
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })

  // Git Terminal Simulator
  const terminalInput = document.getElementById("terminal-input")
  const terminalOutput = document.getElementById("terminal-output")
  const workingDirectory = document.getElementById("working-directory")
  const stagingArea = document.getElementById("staging-area")
  const repository = document.getElementById("repository")
  const progressSteps = document.querySelectorAll(".progress-step")

  // Initialize repository state
  let repoInitialized = false
  let filesInWorkingDir = []
  let filesInStagingArea = []
  const commits = []

  if (terminalInput) {
    terminalInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const command = this.value.trim()
        this.value = ""

        // Add command to output
        const commandLine = document.createElement("div")
        commandLine.className = "output-line"
        commandLine.innerHTML = `<span class="prompt">$</span> ${command}`
        terminalOutput.appendChild(commandLine)

        // Process command
        processGitCommand(command)

        // Scroll to bottom of terminal
        terminalOutput.scrollTop = terminalOutput.scrollHeight
      }
    })
  }

  function processGitCommand(command) {
    const output = document.createElement("div")
    output.className = "output-line"

    // Process different Git commands
    if (command === "help") {
      output.textContent =
        'Available commands: git init, git status, touch <filename>, git add <filename>, git commit -m "<message>", clear'
    } else if (command === "git init") {
      if (!repoInitialized) {
        repoInitialized = true
        output.textContent = "Initialized empty Git repository"
        updateProgressStep("init")
      } else {
        output.textContent = "Git repository already initialized"
      }
    } else if (command === "git status") {
      if (!repoInitialized) {
        output.textContent = "Not a git repository. Use git init to create a new repository."
      } else {
        let status = "On branch master\n\n"

        if (filesInStagingArea.length > 0) {
          status += "Changes to be committed:\n"
          filesInStagingArea.forEach((file) => {
            status += `  (use "git restore --staged <file>..." to unstage)\n        new file:   ${file}\n`
          })
          status += "\n"
        }

        if (filesInWorkingDir.length > 0) {
          status += "Untracked files:\n"
          status += '  (use "git add <file>..." to include in what will be committed)\n'
          filesInWorkingDir.forEach((file) => {
            status += `        ${file}\n`
          })
        }

        if (filesInWorkingDir.length === 0 && filesInStagingArea.length === 0) {
          status += "nothing to commit, working tree clean"
        }

        output.innerHTML = status.replace(/\n/g, "<br>")
      }
    } else if (command.startsWith("touch ")) {
      if (!repoInitialized) {
        output.textContent = "Not a git repository. Use git init to create a new repository."
      } else {
        const filename = command.split(" ")[1]
        if (filename) {
          if (!filesInWorkingDir.includes(filename) && !filesInStagingArea.includes(filename)) {
            filesInWorkingDir.push(filename)
            output.textContent = `Created file: ${filename}`
            updateWorkingDirectory()

            if (filename === "index.html") {
              updateProgressStep("create")
            }
          } else {
            output.textContent = `File ${filename} already exists`
          }
        } else {
          output.textContent = "Please specify a filename"
        }
      }
    } else if (command.startsWith("git add ")) {
      if (!repoInitialized) {
        output.textContent = "Not a git repository. Use git init to create a new repository."
      } else {
        const filename = command.split(" ")[2]
        if (filename === ".") {
          // Add all files
          if (filesInWorkingDir.length > 0) {
            filesInStagingArea = [...filesInStagingArea, ...filesInWorkingDir]
            filesInWorkingDir = []
            output.textContent = "Added all files to staging area"
            updateWorkingDirectory()
            updateStagingArea()

            if (filesInStagingArea.includes("index.html")) {
              updateProgressStep("add")
            }
          } else {
            output.textContent = "No files to add"
          }
        } else if (filename) {
          const fileIndex = filesInWorkingDir.indexOf(filename)
          if (fileIndex !== -1) {
            filesInWorkingDir.splice(fileIndex, 1)
            filesInStagingArea.push(filename)
            output.textContent = `Added ${filename} to staging area`
            updateWorkingDirectory()
            updateStagingArea()

            if (filename === "index.html") {
              updateProgressStep("add")
            }
          } else {
            output.textContent = `File ${filename} not found in working directory`
          }
        } else {
          output.textContent = "Please specify a filename or use . to add all files"
        }
      }
    } else if (command.startsWith("git commit -m ")) {
      if (!repoInitialized) {
        output.textContent = "Not a git repository. Use git init to create a new repository."
      } else {
        if (filesInStagingArea.length > 0) {
          const messageMatch = command.match(/"([^"]+)"/)
          if (messageMatch) {
            const message = messageMatch[1]
            commits.push({
              hash: generateCommitHash(),
              message: message,
              files: [...filesInStagingArea],
            })
            output.textContent = `[master ${commits.length === 1 ? "(root-commit) " : ""}${commits[commits.length - 1].hash.substring(0, 7)}] ${message}\n ${filesInStagingArea.length} file${filesInStagingArea.length > 1 ? "s" : ""} changed\n create mode 100644 ${filesInStagingArea.join("\n create mode 100644 ")}`
            filesInStagingArea = []
            updateStagingArea()
            updateRepository()

            updateProgressStep("commit")
          } else {
            output.textContent = "Please provide a commit message in quotes"
          }
        } else {
          output.textContent = "Nothing to commit, working tree clean"
        }
      }
    } else if (command === "clear") {
      // Clear terminal output
      while (terminalOutput.firstChild) {
        terminalOutput.removeChild(terminalOutput.firstChild)
      }
      return // Don't add output line
    } else {
      output.textContent = `Command not recognized: ${command}`
    }

    terminalOutput.appendChild(output)
  }

  function updateWorkingDirectory() {
    if (workingDirectory) {
      workingDirectory.innerHTML = ""
      filesInWorkingDir.forEach((file) => {
        const fileElement = document.createElement("div")
        fileElement.className = "file-item"
        fileElement.innerHTML = `<i class="fa-regular fa-file"></i> ${file}`
        workingDirectory.appendChild(fileElement)
      })
    }
  }

  function updateStagingArea() {
    if (stagingArea) {
      stagingArea.innerHTML = ""
      filesInStagingArea.forEach((file) => {
        const fileElement = document.createElement("div")
        fileElement.className = "file-item"
        fileElement.innerHTML = `<i class="fa-regular fa-file"></i> ${file}`
        stagingArea.appendChild(fileElement)
      })
    }
  }

  function updateRepository() {
    if (repository) {
      repository.innerHTML = ""
      commits.forEach((commit) => {
        const commitElement = document.createElement("div")
        commitElement.className = "commit-item"
        commitElement.innerHTML = `
                    <div class="commit-hash">${commit.hash.substring(0, 7)}</div>
                    <div class="commit-message">${commit.message}</div>
                `
        repository.appendChild(commitElement)
      })
    }
  }

  function updateProgressStep(step) {
    progressSteps.forEach((progressStep) => {
      if (progressStep.getAttribute("data-step") === step) {
        progressStep.classList.add("completed")
        const indicator = progressStep.querySelector(".step-indicator i")
        indicator.classList.remove("fa-regular", "fa-circle")
        indicator.classList.add("fa-solid", "fa-circle-check")
      }
    })

    // Check if all steps are completed
    const allCompleted = Array.from(progressSteps).every((step) => step.classList.contains("completed"))
    if (allCompleted) {
      document.getElementById("submit-challenge").classList.add("ready")
    }
  }

  function generateCommitHash() {
    return Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10)
  }

  // Hint Button
  const hintBtn = document.getElementById("hint-btn")
  if (hintBtn) {
    hintBtn.addEventListener("click", () => {
      // Find the first incomplete step
      let incompleteStep = null
      for (const step of progressSteps) {
        if (!step.classList.contains("completed")) {
          incompleteStep = step.getAttribute("data-step")
          break
        }
      }

      // Show hint based on incomplete step
      const output = document.createElement("div")
      output.className = "output-line"

      switch (incompleteStep) {
        case "init":
          output.innerHTML =
            '<span style="color: yellow;">Hint:</span> Use <code>git init</code> to initialize a repository'
          break
        case "create":
          output.innerHTML =
            '<span style="color: yellow;">Hint:</span> Use <code>touch index.html</code> to create the file'
          break
        case "add":
          output.innerHTML =
            '<span style="color: yellow;">Hint:</span> Use <code>git add index.html</code> to add the file to staging area'
          break
        case "commit":
          output.innerHTML =
            '<span style="color: yellow;">Hint:</span> Use <code>git commit -m "Initial commit"</code> to commit your changes'
          break
        default:
          output.innerHTML =
            '<span style="color: yellow;">Hint:</span> All steps completed! Click "Complete Challenge" to finish.'
      }

      terminalOutput.appendChild(output)
      terminalOutput.scrollTop = terminalOutput.scrollHeight
    })
  }

  // Submit Challenge Button
  const submitChallengeBtn = document.getElementById("submit-challenge")
  if (submitChallengeBtn) {
    submitChallengeBtn.addEventListener("click", () => {
      // Check if all steps are completed
      const allCompleted = Array.from(progressSteps).every((step) => step.classList.contains("completed"))

      if (allCompleted) {
        // Close modal
        modal.style.display = "none"

        // Show success message
        alert("Challenge completed! You earned 10 XP!")

        // Update XP (in a real app, this would be handled by the backend)
        const xpValue = document.querySelector(".xp-value")
        if (xpValue) {
          xpValue.textContent = Number.parseInt(xpValue.textContent) + 10
        }

        // Add to recent activity (in a real app, this would be handled by the backend)
        const activityContainer = document.querySelector(".activity-container")
        if (activityContainer) {
          const activityItem = document.createElement("div")
          activityItem.className = "activity-item"
          activityItem.innerHTML = `
                        <div class="activity-icon">
                            <i class="fa-solid fa-check-circle"></i>
                        </div>
                        <div class="activity-content">
                            <h4>Completed "First Commit" Challenge</h4>
                            <p>Just now</p>
                        </div>
                        <div class="activity-xp">+10 XP</div>
                    `
          activityContainer.prepend(activityItem)
        }
      } else {
        alert("Please complete all steps before submitting the challenge!")
      }
    })
  }
})

