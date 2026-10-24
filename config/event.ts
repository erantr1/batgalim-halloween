// All event-specific content. Components read from here.

const date = "31.10";
const time = { start: "17:00", end: "19:00" };
const timeLabel = `${time.start} עד ${time.end}`;

export type Guideline = { text: string; link?: { label: string; href: string } };

export const event = {
  name: "האלווין גלים",
  titleLead: "בת גלים חוגגת", // the small line above the name
  tagline: "ממתק או ברדק",
  description: `ממתק או ברדק בשכונת בת גלים, חיפה. מוצאי שבת, ${date}, ${timeLabel}.`,
  dateLong: "מוצאי שבת, 31.10.2026",
  timeLabel,
  backHome: "חזרה לדף הראשי",

  map: {
    center: [32.832, 34.98] as [number, number],
    zoom: 16,
    title: "מפת הבתים והפעילויות",
    intro: "🎃 בתים עם ממתקים · 🕷️ פעילויות. הקישו כדי לראות איך מגיעים.",
    empty: "עדיין אין משתתפים במפה.",
    notPublished: `המפה תפורסם ב־${date}, לקראת תחילת האירוע.`,
    preview: "תצוגה מקדימה למארגנים: המפה עוד לא פורסמה, ורק מארגנים רואים אותה.",
    loading: "טוען את המפה…",
    error: "לא הצלחנו לטעון את המפה. נסו לרענן את הדף.",
    locate: "הראו איפה אני (נקודה כחולה)",
    locateError: "לא הצלחנו למצוא את המיקום שלכם. בדקו שהדפדפן מורשה לגשת למיקום.",
    labels: { entrance: "כניסה", floor: "קומה", apartment: "דירה", door_color: "צבע הדלת", door_sign: "שלט", building_entry: "כניסה לבניין" },
    accessTypes: { stairs: "מדרגות", elevator: "מעלית", both: "מדרגות או מעלית" },
  },

  home: {
    whatTitle: "אז מה עושים בעצם?",
    what: [
      'ילדי השכונה יתרוצצו בין הבתים לאסוף ממתקים. אתם מוזמנים להתרוצץ איתם, להירשם כבית מחלק, להגות פעילות מפחידה אחרת (מבוך קרטונים בחצר, ערבוב שיקויים בגינה, הרצאה "אם לדרקולה היה גלשן") - כל יוזמה מבורכת',
      "נקודות בונוס למי שיחלק ממתקים בצורה תיאטרלית אך חמודה, כשהוא עצמו מחופש",
      "בסוף ניפגש כולנו למסיבת האלווין מפחידה במיוחד בבר גלים",
    ],
    cta: {
      register: "אני רוצה לחלק ממתקים! כאן נרשמים",
      activity: "אני מביא אותה בפעילות של הישמור! כאן נרשמים",
      map: "כאן צופים במפה!",
      subscribe: "שכנה מעוניינת- הרשמה לצפייה במפה",
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
      building_entry: "איך נכנסים לבניין?",
      access_type: "איך עולים לדירה?",
      door_color: "צבע הדלת",
      door_sign: "מה כתוב על השלט בדלת?",
      access_notes: "עוד משהו שיעזור למצוא אתכם",
      pin: "איפה זה על המפה?",
    },
    kinds: { home: "ממתקים בבית שלנו", activity: "פעילות מפחידה" },
    chooseStreet: "בחרו רחוב",
    // From OpenStreetMap (23.10): the named streets north of the coastal railway, without squares,
    // the port streets east of Rambam, and roads that run mostly south of the railway.
    streets: [
      "אבדימי",
      "אלישע",
      "דוד ארליך",
      "החי\"ל",
      "העליה השניה",
      "הקלעים",
      "השחף",
      "השרון",
      "טיילת אריה גוראל",
      "טיילת בת גלים",
      "טיילת חולדה גורביץ'",
      "יהונתן",
      "יוברט המפרי",
      "יעקב כספי",
      "מילסון",
      "מרגולין",
      "נהלל",
      "נחליאלי",
      "סמטת בנימין",
      "סמטת הוז דב",
      "סמטת הכ\"ג",
      "סמטת הצנחנים",
      "סמטת מונש",
      "סמטת קל\"ח",
      "עפרון",
      "פינת גן",
      "רחף",
      "רציף אהרון רוזנפלד",
      "שד' המתנדבים",
      "שדרות בת גלים",
      "שקמונה",
      "שרל לוץ",
    ],
    accessTypes: { stairs: "מדרגות", elevator: "מעלית", both: "גם וגם" },
    hints: {
      private: "לא יופיע במפה. רק המארגנים יראו.",
      description: "יופיע במפה לכל המשתתפים. למשל: מבוך קרטונים בחצר.",
      access_notes: "יופיע במפה לכל המשתתפים. לא לכתוב קוד כניסה לבניין.",
      building_entry: "למשל: אינטרקום, או טלפון שיתקשרו אליו כשמגיעים. בלי הקוד של הבניין. יופיע במפה.",
      pin: "הקישו על המפה במקום שלכם. הקשה נוספת מזיזה את הסימון.",
    },
    guidelinesAck: "קראתי את ההנחיות, ואקשט את הדלת או הכניסה כך שיהיה ברור שאנחנו משתתפים.",
    mapConsent: "אני מסכים/ה שהכתובת ותיאור הדלת או הפעילות יופיעו במפת האירוע.",
    submit: "שליחה",
    sending: "שולח…",
    pinMissing: "צריך לסמן את המקום על המפה.",
    error: "משהו השתבש בשליחה. נסו שוב.",
    success: `תודה! קיבלנו את ההרשמה. ב־${date} תופיעו במפת האירוע, ותוכלו גם לצפות בה.`,
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

  // Viewer registration: on /get-map, and on /map once published for anyone not registered yet.
  // Hosts get in with their host registration.
  subscribe: {
    title: "הרשמה לצפייה במפה",
    intro: "לא בא לכם לחלק ממתקים? השאירו פרטים וצפו במפת הבתים והפעילויות.",
    labels: { name: "שם", contact: "טלפון או מייל" },
    hints: { contact: "לא יופיע במפה. רק המארגנים יראו, והפרטים יימחקו אחרי האירוע." },
    consent: "אני מסכים/ה שהמארגנים ישמרו את הפרטים עד אחרי האירוע ויוכלו ליצור איתי קשר.",
    submit: "הרשמה",
    sending: "שולח…",
    error: "משהו השתבש בשליחה. נסו שוב.",
    success: `נרשמתם! המפה תיפתח ב־${date}, לקראת תחילת האירוע.`,
    toMap: "למפה",
  },

  guidelinesTitle: "הנחיות",
  guidelines: [
    { text: `ילדי השכונה (ומבוגרים, אנחנו לא שופטים) יסתובבו בין הבתים בין ${time.start}-${time.end}` },
    {
      text: "יש לקשט את דלת הכניסה באווירת החג,",
      link: {
        label: "רעיונות לקישוטים בפינטרסט",
        href: "https://www.pinterest.com/search/pins/?q=halloween%20door%20decorations%20diy",
      },
    },
    { text: "אנו מעודדים הכנה פיראטית ויצירתיות ממוחזרת- כמה שיותר תכינו לבד יותר טוב" },
  ] satisfies Guideline[],

  // Shown under the guidelines.
  privacy: {
    title: "רגע שניה, מדובר בהרבה פרטים אישיים, לא?",
    text: "רק מי שנרשם מקבל גישה למפה (וגם אליה- רק למספר שעות מוגבל ביום האירוע) לאחר מכן אנחנו מוחקים את הפרטים קומפלט (זאת אומרת ששנה הבאה תצטרכו להירשם שוב) אין לנו מערך סייבר מתוקתק אבל הקישור יוצא בתפוצה קהילתית בלבד, ומי שנרשמים אלו השכנים מהבית ממול.",
    signature: "בברכת\nלכל השדים והגלים\nצוות האלווין גלים",
  },
};
