const createWordBtn = document.getElementById("createWordBtn");
const searchWordBtn = document.getElementById("searchWordBtn");
const errorMessageElement = document.getElementById("errorMessage");
const successResultsElement = document.getElementById("successResults");
const searchResultsElement = document.getElementById("searchResults");
const wordElement = document.getElementById("word");
const definitionElement = document.getElementById("definition");

function getEndpointUrl() { // Just gets the end point depending on the host.
  const baseUrl = window.location.origin;
  console.log("Base URL: ", baseUrl);
  const endpoint =
    baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1") // If the url has this, use the localhost.
      ? localEndpoint
      : productionEndpoint; // Use the production host otherwise.
  console.log("Using endpoint: ", endpoint);
  return endpoint;
}


function createWord(e) {
  e.preventDefault();
  console.log("CreateWord function triggered");

  const word = wordElement.value.trim().toLowerCase();
  const definition = definitionElement.value.trim();

  if (!word || !definition) { // Check if both fields are filled.
    errorMessageElement.innerHTML = "Both word and definition are required.";
    console.error("Error: Missing word or definition");
    return;
  }

  const xhr = new XMLHttpRequest(); 
  const url = getEndpointUrl(); 

  console.log("Endpoint URL: ", url);

  xhr.open("POST", url, true); // Sending a post request to the backend.
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = () => {
    console.log("XHR readyState: ", xhr.readyState, "XHR status: ", xhr.status);

    // Check if the request has been completed.
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // Check the status of the request. 200 is success.
      if (xhr.status === 200) {
        // Clear the input fields if successful.
        wordElement.value = "";
        definitionElement.value = "";
        errorMessageElement.innerHTML = "";
        successResultsElement.innerHTML = "";

        // Convert the response into a JSON. A valid js object.
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
  // Send the word and definition as form data
  // We use encodeURIComponent to make sure that special characters are properly encoded
  xhr.send(
    "word=" +
      encodeURIComponent(word) +
      "&definition=" +
      encodeURIComponent(definition)
  );

  // Send an error message if an error occured while making a request. Example, server is down.
  xhr.onerror = (e) => {
    errorMessageElement.innerHTML =
      "An error occurred while sending the request.";
    console.error("Request error:", e);
  };
}


function getDefinition(e) {
  e.preventDefault(); // Stops page from refreshing
  console.log("GetDefinition function triggered");
  
  const word = wordElement.value.toLowerCase();
  if (!word) {
    console.error("No word entered for search");
    errorMessageElement.innerHTML = "Please enter a word to search.";
    return;
  }
  
  const xhr = new XMLHttpRequest();
  // Here is the query. Get the word that we want to send to the server.
  const url = `${getEndpointUrl()}?word=${encodeURIComponent(word)}`;

  console.log("Endpoint URL (GET): ", url);

  // Opening a connection and performing a get request to the server.
  xhr.open("GET", url, true);
  xhr.onreadystatechange = () => {
    console.log("XHR readyState: ", xhr.readyState, "XHR status: ", xhr.status);
    // Checks if the request is done.
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // Check if no issues happened.
      if (xhr.status === 200) {
        // Clear the fields.
        errorMessageElement.innerText = "";
        searchResultsElement.innerHTML = "";

        // Put the word and definitions recevied from the server in the UI.
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

  // const pathname = window.location.pathname.replace("/COMP-4537/Labs/4", "");
  const isGitHubPages = window.location.hostname.includes("github.io");
  const hasLabsPath = window.location.pathname.includes("/Labs/4");

  // Determine the base path dynamically
  const basePath = isGitHubPages ? "/COMP-4537/Labs/4" : (hasLabsPath ? "/Labs/4" : "");

  // Normalize the pathname
  const pathname = window.location.pathname.startsWith(basePath)
      ? window.location.pathname.replace(basePath, "")
      : window.location.pathname;

  console.log("Resolved Pathname:", pathname);


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

