const xbtn = document.querySelector(".x-btn");
const overlay =  document.querySelector(".overlay");
const submit =  document.querySelector(".submit-btn");
const input = document.querySelector(".input-url");
const contextMode = document.querySelector("#context-mode");
const contextBtn = document.querySelector("#context-mode-btn");


const connection = document.querySelector("#connection-icon");

//------ Event Listeners -------//

// Update the online status icon based on connectivity
window.addEventListener('online',  updateOnlineIndicator);
window.addEventListener('offline', updateOfflineIndicator);
updateOnlineIndicator();

contextBtn.addEventListener("change", function () {
    dataLayerPanel.classList.toggle("hidden");
})

//------ Function Definitions -------//
function updateOnlineIndicator() {
    connection.classList.add("hidden");
    gameInstance.SendMessage("HtmlUIManager", "OnBrowserOffline", 'True');
}
function updateOfflineIndicator() {
    connection.classList.remove("hidden");
    gameInstance.SendMessage("HtmlUIManager", "OnBrowserOffline", 'False');
}


