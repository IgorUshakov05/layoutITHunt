self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/assets/pictures/marketolog.webp",
    badge: "/assets/pictures/logo.png",
  });
});
