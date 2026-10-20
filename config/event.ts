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

  map: { center: [32.832, 34.98] as [number, number], zoom: 16 },

  home: {
    intro:
      "ילדי השכונה יוצאים בתחפושות לאסוף ממתקים בבתים המשתתפים, ואחר כך נפגשים כולם לאירוע קהילתי.",
    cta: {
      register: "רוצים לחלק ממתקים? רשמו את הבית",
      map: "למפת הבתים המשתתפים",
      getMap: "מגיעים מקריית אליעזר? קבלו את המפה",
    },
  },

  register: {
    title: "רישום בית משתתף",
    intro:
      "ממלאים את הפרטים ומסמנים את הבניין על המפה. אחרי אישור המארגנים הבית יופיע במפת האירוע.",
    optional: "(לא חובה)",
    labels: {
      names: "שמות המארחים",
      phone: "טלפון",
      street: "רחוב",
      building_number: "מספר בית",
      entrance: "כניסה",
      floor: "קומה",
      apartment: "דירה",
      access_type: "איך עולים לדירה?",
      door_color: "צבע הדלת",
      door_sign: "מה כתוב על השלט בדלת?",
      access_notes: "עוד משהו שיעזור למצוא אתכם",
      pin: "איפה הבניין?",
    },
    accessTypes: { stairs: "מדרגות", elevator: "מעלית", both: "גם וגם" },
    hints: {
      private: "לא יופיע במפה. רק המארגנים יראו.",
      access_notes: "יופיע במפה לכל המשתתפים. לא לכתוב קוד כניסה לבניין.",
      pin: "הקישו על המפה במקום הבניין שלכם. הקשה נוספת מזיזה את הסימון.",
    },
    guidelinesAck: "קראתי את ההנחיות, ואקשט את הדלת או הכניסה כך שיהיה ברור שאנחנו משתתפים.",
    mapConsent: "אני מסכים/ה שהכתובת ותיאור הדלת יופיעו במפת האירוע.",
    submit: "שליחה",
    sending: "שולח…",
    pinMissing: "צריך לסמן את הבניין על המפה.",
    error: "משהו השתבש בשליחה. נסו שוב.",
    success: "תודה! קיבלנו את ההרשמה. אחרי אישור המארגנים הבית יופיע במפה.",
    backHome: "חזרה לדף הראשי",
  },

  guidelinesTitle: "הנחיות",
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
