const createWordBtn = document.getElementById("createWordBtn");
const searchWordBtn = document.getElementById("searchWordBtn");
const errorMessageElement = document.getElementById("errorMessage");
const successResultsElement = document.getElementById("successResults");
const searchResultsElement = document.getElementById("searchResults");
const wordElement = document.getElementById("word");
const definitionElement = document.getElementById("definition");

function getEndpointUrl() {
  const baseUrl = window.location.origin;
  console.log("Base URL: ", baseUrl);
  const endpoint =
    baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")
      ? localEndpoint
      : productionEndpoint;
  console.log("Using endpoint: ", endpoint);
  return endpoint;
}


function createWord(e) {
  e.preventDefault();
  console.log("CreateWord function triggered");

  const word = wordElement.value.trim().toLowerCase();
  const definition = definitionElement.value.trim();

  if (!word || !definition) {
    errorMessageElement.innerHTML = "Both word and definition are required.";
    console.error("Error: Missing word or definition");
    return;
  }

  const xhr = new XMLHttpRequest();
  const url = getEndpointUrl();

  console.log("Endpoint URL: ", url);

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = () => {
    console.log("XHR readyState: ", xhr.readyState, "XHR status: ", xhr.status);

    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        wordElement.value = "";
        definitionElement.value = "";
        errorMessageElement.innerHTML = "";
        successResultsElement.innerHTML = "";

        const res = JSON.parse(xhr.responseText);
        if (
          !res ||
          !res.numReq ||
          !res.date ||
          !res.totalWords ||
          !res.word ||
          !res.definition
        ) {
          errorMessageElement.innerHTML = "Failed to process the response.";
          console.error("Invalid response format received");
          return;
        }

        const numRequestsElement = document.createElement("h3");
        numRequestsElement.innerHTML = numRequestsPostMsg
          .replace("%NUMREQ", res.numReq)
          .replace("%DATE", res.date)
          .replace("%TOTALWORDS", res.totalWords);

        const newEntryElement = document.createElement("h3");
        newEntryElement.innerHTML = newEntryPostMsg
          .replace("%WORD", res.word)
          .replace("%DEFINITION", res.definition);

        successResultsElement.appendChild(numRequestsElement);
        successResultsElement.appendChild(newEntryElement);

        console.log("Word successfully added:", res.word);
      } else {
        successResultsElement.innerHTML = "";
        errorMessageElement.innerHTML = xhr.responseText;
        console.error("Error posting word:", xhr.responseText);
      }
    }
  };

  console.log("Sending data:", { word, definition });
  xhr.send(
    "word=" +
      encodeURIComponent(word) +
      "&definition=" +
      encodeURIComponent(definition)
  );

  xhr.onerror = (e) => {
    errorMessageElement.innerHTML =
      "An error occurred while sending the request.";
    console.error("Request error:", e);
  };
}


function getDefinition(e) {
  e.preventDefault();
  console.log("GetDefinition function triggered");

  const word = wordElement.value.toLowerCase();
  if (!word) {
    console.error("No word entered for search");
    errorMessageElement.innerHTML = "Please enter a word to search.";
    return;
  }

  const xhr = new XMLHttpRequest();
  const url = `${getEndpointUrl()}?word=${encodeURIComponent(word)}`;

  console.log("Endpoint URL (GET): ", url);

  xhr.open("GET", url, true);
  xhr.onreadystatechange = () => {
    console.log("XHR readyState: ", xhr.readyState, "XHR status: ", xhr.status);
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        errorMessageElement.innerText = "";
        searchResultsElement.innerHTML = "";

        const searchedTerm = document.createElement("h3");
        searchedTerm.innerHTML = `Word: ${word}`;
        const searchedDefinition = document.createElement("h3");
        searchedDefinition.innerHTML = `Definition: ${xhr.responseText}`;

        searchResultsElement.appendChild(searchedTerm);
        searchResultsElement.appendChild(searchedDefinition);

        console.log("Search successful: ", xhr.responseText);
      } else if (xhr.status === 404) {
        errorMessageElement.innerHTML = `The word "${word}" was not found.`;
        console.error("Word not found: ", word);
      } else {
        errorMessageElement.innerHTML = "An error occurred while searching.";
        console.error("Search request failed: ", xhr.responseText);
      }
    }
  };

  xhr.onerror = (e) => {
    errorMessageElement.innerHTML =
      "An error occurred during the search request.";
    console.error("Error with search request: ", e); // Debug: log error
  };

  xhr.send();
}


// Run when the page is loaded
window.onload = () => {
  console.log("Window onload executed");

  const pathname = window.location.pathname.replace("/COMP4537/labs/4", "");
  console.log("Current pathname: ", pathname);

  if (pathname.endsWith("store.html")) {
    console.log("Store page detected");

    const createWordBtn = document.getElementById("createWordBtn");
    if (createWordBtn) {
      console.log("CreateWord button found");
      createWordBtn.addEventListener("click", createWord);
    } else {
      console.error("CreateWord button not found!");
    }
  }

  if (pathname.endsWith("search.html")) {
    console.log("Search page detected");

    const searchWordBtn = document.getElementById("searchWordBtn");
    if (searchWordBtn) {
      console.log("SearchWord button found");
      searchWordBtn.addEventListener("click", getDefinition);
    } else {
      console.error("SearchWord button not found!");
    }
  }
};

