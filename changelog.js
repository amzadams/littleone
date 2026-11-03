/* ============================================================
   changelog.js
   Add a new block at the TOP each time you change something.
   Bump `v`. Anyone who has not seen that version gets the
   popup next time they open the home page.

   kind: "new" | "fix" | "better"
   ============================================================ */

const CHANGELOG = [
  {
    v: "1.6",
    date: "2026-11-02",
    title: "Updates arrive on their own",
    items: [
      ["better", "New versions now load by themselves. No more closing and reopening the app to see changes."],
      ["better", "This popup has a Later button, and stops by itself after three times. It always stays under What's new in Tools."],
      ["better", "Home is tidier. The week details card is gone since Open on the picture shows all of it. The week number now sits on the picture."]
    ]
  },
  {
    v: "1.5",
    date: "2026-11-02",
    title: "Know what is coming",
    items: [
      ["new",    "Schedule, under Tools. Every usual test and scan by week, with real dates worked out from the due date."],
      ["new",    "Each one comes with questions worth asking. One tap drops them into a visit, without doubling up any already there."],
      ["new",    "The home page now says what is coming up next under Next visit."],
      ["new",    "This What's new popup. It shows once per update, tap Got it to clear it."]
    ]
  },
  {
    v: "1.4",
    date: "2026-11-02",
    title: "Posting, and a tidier home",
    items: [
      ["new",    "A round + button on the home page posts an update without leaving the page."],
      ["new",    "Updates now clear off the home page after a day. Nothing is deleted, it all lives in All updates under Tools."],
      ["new",    "A small count next to Latest shows posts you have not seen yet."],
      ["fix",    "Questions for a visit can now be edited and removed. That was broken, the buttons never appeared."],
      ["better", "Two visit reminders instead of one, the day before and again on the day."],
      ["better", "Food and medicine: search something that is not listed and you get NHS, Mayo and MotherToBaby links, plus you can save the doctor's answer into the list for good."]
    ]
  },
  {
    v: "1.3",
    date: "2026-11-02",
    title: "Pictures and tools",
    items: [
      ["new",    "A picture for each week on the home card. Drag to move it, slide to zoom, no cropping needed."],
      ["new",    "Weight, kick counter, baby names, hospital bag, baby registry, birth plan and a contraction timer."],
      ["new",    "Everything logged, the full searchable history of every entry."],
      ["better", "Tools is now a grid instead of a list."],
      ["better", "Darker text throughout, the grey was hard to read."]
    ]
  },
  {
    v: "1.2",
    date: "2026-11-01",
    title: "Logging anything, any day",
    items: [
      ["new",    "Entries now carry a real time, and can be backdated to any earlier day."],
      ["new",    "Attach a picture to any entry."],
      ["better", "The entry form stays closed until you pick what it is."],
      ["fix",    "Pages no longer render zoomed in on a phone."]
    ]
  },
  {
    v: "1.1",
    date: "2026-10-31",
    title: "Live between the two of you",
    items: [
      ["new",    "Everything syncs, so you both see the same thing on your own phones."],
      ["new",    "Scans and bump pictures."],
      ["new",    "Visits, with a running question list for each one."]
    ]
  },
  {
    v: "1.0",
    date: "2026-10-24",
    title: "The start",
    items: [
      ["new",    "Week by week, the countdown, the daily log, and the food and medicine lookup."]
    ]
  }
];

const CL_LATEST = CHANGELOG[0].v;
