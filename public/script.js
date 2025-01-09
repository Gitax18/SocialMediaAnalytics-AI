// Selecting the elements
const form = document.getElementById("form");
const input = document.getElementById("input");
const float = document.getElementById("float");
const right = document.getElementById("right");
const button = document.getElementById("send");
const downloadBtn = document.getElementById("downloadBtn");

// Instance of socket
const socket = io();

//attach event listener to download btn
downloadBtn.addEventListener("click", function () {
  // Get the HTML content of the 'right' div
  const content = right.innerHTML;

  // Create a Blob from the HTML content
  const blob = new Blob([content], { type: "text/html" });

  // Create a temporary download link
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "post-data.html"; // The file name for download

  // Trigger the download
  downloadLink.click();

  // Clean up the URL object
  URL.revokeObjectURL(downloadLink.href);
});

// attach event listener to form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    // sending data to server
    const chatItem = document.createElement("li");
    chatItem.className = "user-chat";
    chatItem.textContent = input.value;
    document.getElementById("messages").appendChild(chatItem);
    socket.emit("message", input.value);
    input.value = "";
    send.textContent = "generating..";
    send.disabled = true;
  }
});

// receiving message from server
socket.on("message", (res) => {
  console.log(res);
  const botHTML = res.res.replace(/```html/g, "");
  if (res.status === "ok") {
    const chatItem = document.createElement("li");
    chatItem.className = "bot-chat";
    chatItem.textContent = "Answer Generated";
    document.getElementById("messages").appendChild(chatItem);
  }
  right.innerHTML = botHTML;
  send.textContent = "submit";
  send.disabled = false;
});
