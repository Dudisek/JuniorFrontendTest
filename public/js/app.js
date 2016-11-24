// Form Submit on Click
var submitForm = document.getElementById('github-submit');
submitForm.addEventListener("click", getGitInfo);

// API Github
var api = 'https://api.github.com/users/'
var errors = document.getElementById('errors');

// Github information
var gitAccount = document.getElementById("github-account");
var userlogin = document.getElementById('login');
var userFullName = document.getElementById('name');
var userBio = document.getElementById('bio');
var userAvatar = document.getElementById('avatar'); 
var repoList = document.getElementById('repo-list');


function getGitInfo(e) {
  // Prevent Submit & clean elements before action
  e.preventDefault()
  errors.innerHTML = "";
  repoList.innerHTML = "";
  gitAccount.style.display = "none";
  
  // Fetch data if input is valid
  var username = getUsername()
  if (validInput(username)) {
    fetch(api + username)
    .then(res => {
      // Check status code
      if (res.status === 200) {
        res.json().then(data => {
          displayUserData(data)
          getGitRepos(username)
        })
      } else {
        res.json().then(error => {
          // We could handle here a different errors too, eg: exceed limits 
          console.log(error)
          addError("Does not exist")
        })
      }
    })
    .catch(error => {
      console.log('Request failed: ', error); 
    }); 
  }
}

function validInput(username) {
  if (username == "") {
    addError("Please type username")
    return false
  } else {
    return true
  }
}

function getGitRepos(username) {
  fetch(api + username + "/repos")
  .then(res => {  
    if (res.status === 200) {
      res.json().then(data => {
        displayUserRepos(data)
      })
    } else {
      res.json().then(error => {
        addError("Error: " + error)
      })
    }
  })
}

function addError(error){
  errors.innerHTML = "<div class='error-message'><span>" + error + "</span></div>"
}

function displayUserData(data){
  // Display gitAccount div and add html to elements
  gitAccount.style.display = "block";
  userlogin.innerHTML = "<a href=\"" + data.html_url + "\">" + "@" + data.login + "</a>";
  data.name ? userFullName.innerHTML = "<h2>" + data.name + "</h2>" : userFullName.innerHTML = "<h2>-</h2>"
  data.bio ? userBio.innerHTML = data.bio : userBio.innerHTML = "No Description"
  userAvatar.innerHTML = "<img src=\"" + data.avatar_url + "\">";
}

function displayUserRepos(data) {
  if (data.length == 0) {
    repoList.innerHTML = "<li><i>No repositories</i></li>"
  } else {
    data.forEach(function(repo) {
      var nameUrl= "<a href=\"" + repo.html_url + "\" target=\"_blank\">" + repo.name + "</a>"
      var stars = "<img src=\"public/img/star.png\"/> " + repo.stargazers_count + " "
      var forks = "<img src=\"public/img/fork.png\"/> " + repo.forks_count
      // Display repo
      repoList.innerHTML += "<li>" + nameUrl + "<span>" + stars + forks + "</span></li>"
    })
  }
}

function getUsername() {
  return document.getElementById("github-input").value;
}