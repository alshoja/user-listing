let modal = document.getElementById("user-detail");
let span = document.getElementsByClassName("close")[0];

let params = {
  limit: 10,
  offset: 0,
  search: "",
  next: 1,
  prv: 1,
};

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

function searchName() {
  const searchValue = document.getElementById("search").value;
  params.search = searchValue;
  fetchUsers(params);
}

function init(limitValue) {
  if (limitValue >= 10) {
    document.getElementById("prv").classList.remove("disabled");
    params.limit = limitValue;
  } else {
    document.getElementById("prv").classList.add("disabled");

    params.offset = 0;
  }
  console.log("current tparam", params);
  fetchUsers(params);
}

// fetching initial users
fetchUsers(params);

function fetchUsers({ limit, offset, search }) {
  var Svalue = search;
  fetch(
    "https://hr.oat.taocloud.org/v1/users?name=" +
      search +
      "&limit=" +
      limit +
      "&offset=" +
      offset
  )
    .then((res) => {
      if (!res.ok) {
        throw Error("Some error occured");
      }
      return res.json();
    })
    .then((data) => {
      console.log("data", data);
      clearTable();
      const html = data
        .map((user, i) => {
          return `
          <tr id="app">
          <td>${user.userId + 1}</td>
          <td><a href="#" data-category="${
            user.userId
          }" id="user-modal">${toTitleCase(user.firstName)}</a></td>
          <td>${toTitleCase(user.lastName)}</td>
          </tr>
          `;
        })
        .join("");
      params.next = data[data.length - 1].userId;
      console.log("current param", params);
      document.querySelector("#app").insertAdjacentHTML("afterend", html);
      document.getElementById("index-loader").style.display = "none";
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
          <img src="${data.picture}" style="width:100%">
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

function clearTable() {
  let table = document.getElementById("tbId");
  var tbodyRowCount = table.tBodies[0].rows.length; // 3
  console.log(tbodyRowCount);

  for (let i = 1; i < tbodyRowCount; i++) {
    table.deleteRow(1);
  }
  document.getElementById("app").innerHTML = `<tr id="app"></tr>`;
}

function next() {
  params.offset = params.next + 1;
  console.log("next", params);
  fetchUsers(params);
}

function previous() {
  params.offset = params.prv;
  console.log("prv", params);
  fetchUsers(params);
}
