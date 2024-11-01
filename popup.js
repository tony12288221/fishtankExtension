document.addEventListener("DOMContentLoaded", function() {
    const openStreamButton = document.getElementById("openStream");
  
    openStreamButton.addEventListener("click", function() {
      chrome.tabs.create({ url: chrome.runtime.getURL("player.html") });
    });
  });
  