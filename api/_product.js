// What the order function sells and emails. Files are encrypted copies in api/_files (see order.js).
// price is the launch price until `until`, then priceAfter — keep in sync with data-* on <body> in index.html.
export default {
  "brand": "Нейро Майстерня",
  "site": "neuro-maysternya.vercel.app",
  "title": "Повний пакет: 250 промптів Claude для бізнесу",
  "price": 299,
  "accent": "#2945e6",
  "files": [
    {
      "name": "Нейро_Майстерня_250_промптів.pdf",
      "enc": "1.enc"
    }
  ],
  "howTo": [
    "Почніть зі сторінки «5 правил» — 2 хвилини читання.",
    "Знайдіть у змісті свою категорію і скопіюйте промпт.",
    "Замініть [дужки] на свої дані й надішліть у Claude."
  ],
  "priceAfter": 399,
  "until": "2026-11-02T23:59:59+02:00",
  "gift": {
    "title": "20 промптів «Старт»",
    "name": "Нейро_Майстерня_20_промптів.pdf",
    "enc": "gift.enc"
  }
};
