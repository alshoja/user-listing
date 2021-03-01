let modal = document.getElementById("user-detail");
let span = document.getElementsByClassName("close")[0];

// fetching initial users
fetchUsers();

function fetchUsers() {
  fetch("https://hr.oat.taocloud.org/v1/users?limit=10&offset=0")
    .then((res) => {
      if (!res.ok) {
        throw Error("Some error occured");
      }
      return res.json();
    })
    .then((data) => {
      const html = data
        .map((user,i) => {
          return `
          <tr>
          <td>${i+1}</td>
          <td><a href="#" data-category="${
            user.userId
          }" id="user-modal">${toTitleCase(user.firstName)}</a></td>
          <td>${toTitleCase(user.lastName)}</td>
          </tr>
          `;
        })
        .join("");
      document.getElementById("index-loader").style.display = "none";
      document.querySelector("#app").insertAdjacentHTML("afterbegin", html);
    })
    .catch((err) => {
      console.log(err);
    });
}

function fetchUserById(id) {
  document.getElementById("detail").innerHTML = `<div class="loader"></div>`;
  fetch("https://hr.oat.taocloud.org/v1/user/" + id)
    .then((res) => {
      if (!res.ok) {
        throw Error("Some error occured");
      }
      return res.json();
    })
    .then((data) => {
      const modalHtml = `
          <span id="close" class="close">&times;</span>
          <img src="${data.picture}" alt="Jane" style="width:100%">
          <div class="container">
            <h2>${toTitleCase(data.title)} </span> ${toTitleCase(
        data.firstName
      )} ${toTitleCase(data.lastName)}</h2>
            <p class="title">${data.gender.toUpperCase()}</p>
            <h6><b>Email: </b><a href="mailto:${data.email}"> ${
        data.email
      } </a></h6>
            <address>${data.address}</address>
          </div>
          `;
      document.getElementById("detail").innerHTML = modalHtml;
    })
    .catch((err) => {
      console.log(err);
    });
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Delegating events since the element is a dynamic generated one
document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "user-modal") {
    modal.style.display = "block";
    if (e.target.dataset.category != "undefined") {
      fetchUserById(e.target.dataset.category);
    }
  }

  if (e.target && e.target.id == "close") {
    modal.style.display = "none";
  }
});
