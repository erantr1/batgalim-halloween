// All event-specific content. Components read from here.

const time = { start: "18:00", end: "20:00" };
const timeLabel = `${time.start} עד ${time.end}`;
const afterParty = "בבר גלים או בגינה הקהילתית (יעודכן)"; // open question

type Guideline = { text: string; link?: { label: string; href: string } };

export const event = {
  name: "האלווין בבת גלים",
  tagline: "ממתק או ברדק",
  description: `ממתק או ברדק בשכונת בת גלים, חיפה. מוצאי שבת, 31.10, ${timeLabel}.`,
  date: "31.10",
  dateLong: "מוצאי שבת, 31.10.2026",
  time,
  timeLabel,
  afterParty,

  // used from step 3; verify center on the map
  map: { center: [32.832, 34.98] as [number, number], zoom: 16 },

  home: {
    intro:
      "ילדי השכונה יוצאים בתחפושות לאסוף ממתקים בבתים המשתתפים, ואחר כך נפגשים כולם לאירוע קהילתי.",
    cta: {
      register: "רוצים לחלק ממתקים? רשמו את הבית",
      map: "למפת הבתים המשתתפים",
      getMap: "מגיעים מקריית אליעזר? קבלו את המפה",
    },
    guidelinesTitle: "הנחיות",
  },

  guidelines: [
    { text: `ממתק או ברדק בין ${time.start} ל־${time.end}. אחר כך נפגשים לאירוע קהילתי ${afterParty}.` },
    { text: "מקשטים את הדלת או את הכניסה, כדי שיהיה ברור לילדים שאתם משתתפים." },
    { text: "מערבים את הילדים בהכנות וביצירה. התחפושות חופשיות: מתחפשים למה שבא לכם." },
    {
      text: "נשמח לכיבוד ברוח החג, רצוי בהכנה ביתית.",
      link: {
        label: "רעיונות והשראה בפינטרסט",
        href: "https://www.pinterest.com/search/pins/?q=halloween%20treats",
      },
    },
    // link to the community file: open question
    { text: "הכנתם כיבוד ללא אלרגנים? כתבו את זה בקובץ הקהילתי." },
    { text: "כדי שלא יצטברו יותר מדי ממתקים בבית, באירוע הקהילתי תהיה תיבה לתרומת ממתקים." },
  ] satisfies Guideline[],
};
