// All event-specific content. Components read from here.

const date = "31.10";
const time = { start: "18:00", end: "20:00" };
const timeLabel = `${time.start} עד ${time.end}`;

export type Guideline = { text: string; link?: { label: string; href: string } };

export const event = {
  name: "האלווין גלים",
  title: 'בת גלים חוגגת "האלווין גלים"',
  tagline: "ממתק או ברדק",
  description: `ממתק או ברדק בשכונת בת גלים, חיפה. מוצאי שבת, ${date}, ${timeLabel}.`,
  dateLong: "מוצאי שבת, 31.10.2026",
  timeLabel,
  backHome: "חזרה לדף הראשי",

  map: {
    center: [32.832, 34.98] as [number, number],
    zoom: 16,
    title: "מפת הבתים והפעילויות",
    intro: "🎃 בתים עם ממתקים · 👻 פעילויות. הקישו כדי לראות איך מגיעים.",
    empty: "עדיין אין משתתפים במפה.",
    notPublished: `המפה תפורסם ב־${date}, לקראת תחילת האירוע.`,
    loading: "טוען את המפה…",
    error: "לא הצלחנו לטעון את המפה. נסו לרענן את הדף.",
    locate: "הראו איפה אני (נקודה כחולה)",
    locateError: "לא הצלחנו למצוא את המיקום שלכם. בדקו שהדפדפן מורשה לגשת למיקום.",
    labels: { entrance: "כניסה", floor: "קומה", apartment: "דירה", door_color: "צבע הדלת", door_sign: "שלט" },
    accessTypes: { stairs: "מדרגות", elevator: "מעלית", both: "מדרגות או מעלית" },
  },

  home: {
    whatTitle: "אז מה עושים בעצם?",
    what: [
      'ילדי השכונה יתרוצצו בין הבתים לאסוף ממתקים. אתם מוזמנים להתרוצץ איתם, להירשם כבית מחלק, להגות פעילות מפחידה אחרת (מבוך קרטונים בחצר, ערבוב שיקויים בגינה, הרצאה "אם לדרקולה היה גלשן") - כל יוזמה מבורכת',
      "נקודות בונוס למי שיחלק ממתקים בצורה תיאטרלית אך חמודה, כשהוא עצמו מחופש",
      "בסוף ניפגש כולנו למסיבת האלווין מפחידה במיוחד",
    ],
    cta: {
      register: "אני רוצה לחלק ממתקים! כאן נרשמים",
      activity: "אני מביא אותה בפעילות של הישמור! כאן נרשמים",
      map: "כאן צופים במפה!",
      getMap: "מגיעים מקריית אליעזר? קבלו את המפה",
    },
  },

  register: {
    title: "הרשמה: ממתקים או פעילות",
    intro: `ממלאים את הפרטים ומסמנים את המקום על המפה. ב־${date} הוא יופיע במפת האירוע.`,
    optional: "(לא חובה)",
    labels: {
      description: "מה הפעילות?",
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
      pin: "איפה זה על המפה?",
    },
    kinds: { home: "ממתקים בבית שלנו", activity: "פעילות מפחידה" },
    accessTypes: { stairs: "מדרגות", elevator: "מעלית", both: "גם וגם" },
    hints: {
      private: "לא יופיע במפה. רק המארגנים יראו.",
      description: "יופיע במפה לכל המשתתפים. למשל: מבוך קרטונים בחצר.",
      access_notes: "יופיע במפה לכל המשתתפים. לא לכתוב קוד כניסה לבניין.",
      pin: "הקישו על המפה במקום שלכם. הקשה נוספת מזיזה את הסימון.",
    },
    guidelinesAck: "קראתי את ההנחיות, ואקשט את הדלת או הכניסה כך שיהיה ברור שאנחנו משתתפים.",
    mapConsent: "אני מסכים/ה שהכתובת ותיאור הדלת או הפעילות יופיעו במפת האירוע.",
    submit: "שליחה",
    sending: "שולח…",
    pinMissing: "צריך לסמן את המקום על המפה.",
    error: "משהו השתבש בשליחה. נסו שוב.",
    success: `תודה! קיבלנו את ההרשמה. ב־${date} תופיעו במפת האירוע.`,
    // Shown under the general guidelines on the registration page.
    guidelines: [
      { text: "תחפושות חופשיות: כן, אפשר למחזר את התחפושת של הדג זהב מפורים" },
      {
        text: "נשמח לכיבוד ברוח החג, רצוי בהכנה ביתית,",
        link: {
          label: "רעיונות והשראה בפינטרסט",
          href: "https://www.pinterest.com/search/pins/?q=halloween%20treats",
        },
      },
      // link to the community file: open question
      { text: "הצלחתם להתחמק מהאלרגנים? ספרו לנו כאן." },
    ] satisfies Guideline[],
  },

  // Organizers send the link by hand (CSV export of map_subscribers).
  getMap: {
    title: "קבלת מפת האירוע",
    intro: "לא גרים בבת גלים? השאירו פרטים ונשלח לכם קישור למפת הבתים המשתתפים.",
    labels: { name: "שם ההורה", contact: "טלפון או מייל" },
    hints: { contact: "רק כדי לשלוח לכם את הקישור. הפרטים יימחקו אחרי האירוע." },
    consent: "אני מסכים/ה שהמארגנים ישלחו לי את הקישור למפה.",
    submit: "שליחה",
    sending: "שולח…",
    error: "משהו השתבש בשליחה. נסו שוב.",
    success: "תודה! נשלח לכם את הקישור למפה לפני האירוע.",
  },

  guidelinesTitle: "הנחיות",
  guidelines: [
    { text: `ילדי השכונה (ומבוגרים, אנחנו לא שופטים) יסתובבו בין הבתים בין ${time.start}-${time.end}` },
    { text: "יש לקשט את דלת הכניסה באווירת החג" },
    { text: "אנו מעודדים הכנה פיראטית ויצירתיות ממוחזרת- כמה שיותר תכינו לבד יותר טוב" },
  ] satisfies Guideline[],
};
