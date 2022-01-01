const apiUrl = "https://telepathics.herokuapp.com";
const ideaLoc = document.getElementById("idea");
const LOCAL_STORAGE_IDEAS = "__telepathics__ideas";

let ideaList = [];

const generateIdea = () => {
  let randomIdea = "";
  ideaLoc.innerHTML = `<img src="/assets/loading.gif" alt="loading...">`;

  if (localStorage.getItem(LOCAL_STORAGE_IDEAS)) {
    const localStorageIdeas = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_IDEAS)
    );
    ideaList = localStorageIdeas.ideaList;
    const now = new Date().getTime();

    // if localstorageideas.timestamp is older than 30 days, fetch new ideas
    if (
      localStorageIdeas.timestamp &&
      now - localStorageIdeas.timestamp > 30 * 24 * 60 * 60 * 1000
    ) {
      localStorage.clear(LOCAL_STORAGE_IDEAS);
    }
  } else {
    console.log("fetching...");
    fetch(`${apiUrl}/db/ideas/all`)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        localStorage.setItem(
          LOCAL_STORAGE_IDEAS,
          JSON.stringify({ ideaList: data, timestamp: new Date().getTime() })
        );
        ideaList = data;
      });
  }

  randomIdea = ideaList[Math.floor(Math.random() * ideaList.length)];
  ideaLoc.innerText = randomIdea;
};

const submitIdea = () => {
  ideaLoc.innerHTML =
    '<input type="text" id="idea-input" placeholder="Your idea..."><button id="idea-submit"><span>Submit</span></button>';
  const ideaInput = document.getElementById("idea-input");
  const ideaSubmit = document.getElementById("idea-submit");
  ideaSubmit.addEventListener("click", function () {
    ideaLoc.innerHTML = `<img src="/assets/loading.gif" alt="loading...">`;
    fetch(`${apiUrl}/db/ideas/new`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea: ideaInput.value }),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        ideaLoc.innerHTML = "<span id='submitted'>submitted, thanks!</span>";
      });
  });
};

generateIdea();
