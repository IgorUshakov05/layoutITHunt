const buttonLeavFromChat = document.getElementById("removeChatUser");
buttonLeavFromChat.addEventListener("click", async () => {
  buttonLeavFromChat.setAttribute("disabled", "true");
  let request = await sendRequestLeav();
  window.location.href = "/";
});
const sendRequestLeav = async () => {
  try {
    let response = await fetch("/api/leav-company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "augwod89h1h9awdh9py0y82hjd",
      },
    });
    let data = await response.json();
    buttonLeavFromChat.removeAttribute("disabled");
    return await { ...data };
  } catch (error) {
    console.log(error);
    buttonLeavFromChat.removeAttribute("disabled");

    return { success: false };
  }
};
