let x = {
  success: true,
  notifications: [
    {
      status: "start",
      subscription_level: "Лонг",
      end_date: "2023-04-06",
      timestamp: "2023-04-06T05:48:20.647Z",
    },
    {
      status: "end",
      timestamp: "2023-04-06T05:50:40.414Z",
    },
    {
      status: "start",
      subscription_level: "Лонг",
      end_date: "2026-04-06",
      timestamp: "2025-04-06T06:13:55.994Z",
    },
    {
      status: "end",
      timestamp: "2026-04-06T06:15:48.581Z",
    },
  ],
};
const groupByDay = (notifications) => {
  const grouped = {};
  let now = new Date();
  let today = `${String(now.getUTCDate()).padStart(2, "0")}-${String(
    now.getUTCMonth() + 1
  ).padStart(2, "0")}-${now.getUTCFullYear()}`;
  console.log(today);

  notifications.forEach((item) => {
    const dateObj = new Date(item.timestamp);
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    const dateKey = `${day}-${month}-${year}`;

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(item);
  });

  return Object.entries(grouped)
    .map(([date, notifications]) => ({ date, notifications }))
    .sort((a, b) => {
      const [d1, m1, y1] = a.date.split("-").map(Number);
      const [d2, m2, y2] = b.date.split("-").map(Number);
      return new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1); // по убыванию
    })
    .map((item) => {
      console.log(item);
      if (item.date === today) {
        return { ...item, date: "Сегодня" };
      }
      return item;
    });
};
const grouped = groupByDay(x.notifications);
console.log(grouped);
