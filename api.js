// setInterval(function(){
//   location.reload();
// }, 2000);
let apiCalled = false;
let userAvatarUrl = '';
let uName = '';
let locati = '';
let htmlUrl = '';
let twitter = '';
let bio = '';
let blog = '';
let noOfRepos = 0;
let followers = 0;
let following = 0;
let repoPerPage = 10;
let page = 1;
let maxVisiblePage = 0;
let hideBio;
let hideButton;



$(document).ready(function() {
  hideBio = $("#bio-hide");
  hideBio.addClass("d-none");
  hideButton = $("#button-hide");
  hideButton.addClass("d-none");

});


function highlightCurrentPageButton() {
  const paginationContainer = $("#pagination-container");
  const prevButton = $("#previous-button");
  const nextButton = $("#next-button");

  paginationContainer.find("button").each(function () {
    if ($(this).text() == page) {
      $(this).addClass("btn m-1 rounded-circle btn-outline-secondary").prop("disabled", true);
    } else {
      $(this).removeClass("btn-outline-secondary").prop("disabled", false);
    }
  });

  prevButton.prop("disabled", page === 1);
  nextButton.prop("disabled", page === this.maxVisiblePage);
}


function searchUser() {

  const loadingOverlay = $("#loading-overlay");
  loadingOverlay.removeClass("d-none"); // Show loading spinner
  hideBio.removeClass("d-none");
  hideButton.removeClass("d-none");

  const inputField = document.getElementById("input");
  const dropDown = document.getElementById("perPage");
  const userName = inputField.value;
  this.repoPerPage = dropDown.value;



  if (userName.length === 0) {
    loadingOverlay.addClass("d-none");
    alert("User Name is empty");
  } else if (!apiCalled) {
    apiCalled = true;


    fetch("https://api.github.com/users/" + userName)
      .then((result) => result.json())
      .then((data) => {
        userAvatarUrl = data.avatar_url;
        uName = data.name;
        locati = data.location;
        htmlUrl = data.html_url;
        twitter = data.twitter_username;
        blog = data.blog;
        followers = data.followers;
        following = data.following;
        this.noOfRepos = data.public_repos;
        this.maxVisiblePage = Math.ceil(this.noOfRepos / this.repoPerPage)



        if (data.name === null) {
          $("#user-name").text("Name Not Available");
        } else {
          $("#user-name").text(uName);
        }
        if (data.location === null) {
          $("#user-location").text("No Location Available");
        } else {
          $("#user-location").text(locati);
          $('a#user-location').attr('href', 'https://www.google.com/maps/place/' + locati);
        }

        if (data.twitter_username === null) {
          $("#user-twitter").text("No Twitter Available ");

        } else {
          $("#user-twitter").text(twitter);
          $('a#user-twitter').attr('href', 'https://twitter.com/' + twitter);
        }

        if (data.blog === null) {
          $("#user-web").text("No Website Available");

        } else if (data.blog === "") {
          $("#user-web").text("No Website Available");

        }
        else {
          $("#user-web").text(blog);
          $('a#user-web').attr('href', blog);

        }

        if (data.html_url === null) {
          $("#user-github").text("No Github Available");

        } else {
          $("#user-github").text(htmlUrl);
          $('a#user-github').attr('href', htmlUrl);
        }


        $("#user-avatar").attr("src", userAvatarUrl);
        $("#user-noOfRepos").text(this.noOfRepos);
        $("#user-following").text(following);
        $("#user-followers").text(followers);



        $("#pagination-container").html("");
        const paginationContainer = $("#pagination-container");
        for (let i = 1; i <= this.maxVisiblePage; i++) {
          const pageButton = $("<button>");
          pageButton.addClass("m-1 rounded-circle btn btn-outline-success");
          pageButton.text(i);

          pageButton.click(function () {
            page = $(this).text();
            paginationContainer.find("button").not(this).removeClass("btn-success").prop("disabled", false);
            searchUser();
            highlightCurrentPageButton();
          });
          paginationContainer.append(pageButton);

        }

      })
      .catch((error) => {
        hideBio.addClass("d-none");
        hideButton.addClass("d-none");
        console.error("API error:", error);
        alert("An error occurred while fetching user data.");
      })


    fetch("https://api.github.com/users/" + userName + "/repos?page=" + page + "&per_page=" + this.repoPerPage)
      .then((result) => result.json())
      .then((repoData) => {
        const repos = repoData;

        $("#repo-list").html("");


        repos.forEach((repo) => {
          const repoContainer = $("<div>");
          repoContainer.addClass("col p-4 m-2  h-full border-2 flex-col rounded-4 shadow-lg");


          const repoName = $("<div>");
          repoName.addClass("px-2  fw-bolder text-uppercase");
          repoName.text(repo.name);
          repoContainer.append(repoName);


          const repoDescription = $("<div>");
          repoDescription.addClass("p-2 fst-italic text-success");
          repoDescription.text(repo.description);
          repoContainer.append(repoDescription);


          const topicContainer = $("<div>");
          topicContainer.addClass("d-flex flex-wrap  p-2 justify-content-start");


          repo.topics.forEach((topic) => {
            const topicSpan = $("<span>");
            topicSpan.addClass("shadow-sm text-white  p-1 m-1 px-3 bg-success   rounded-3 border ");
            topicSpan.text(topic);
            topicContainer.append(topicSpan);
          });

          repoContainer.append(topicContainer);


          $("#repo-list").append(repoContainer);
        });
      })
      .catch((error) => {
        hideBio.addClass("d-none");
        hideButton.addClass("d-none");
        alert("An error occurred while fetching user data.");
        console.error("API error:", error);

      }).finally(() => {
        apiCalled = false;
        highlightCurrentPageButton();
        loadingOverlay.addClass("d-none");

      });


  }
}
$(document).ready(function () {
  $("#previous-button").click(function () {
    if (page > 1) {
      page--;
      console.log(page);
      searchUser();

      highlightCurrentPageButton();
    }
  });

  $("#next-button").click(function () {
    page++;
    console.log(page);
    searchUser();

    highlightCurrentPageButton();
  });
});
