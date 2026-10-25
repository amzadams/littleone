# Little One

A private pregnancy site for two people. Static files on GitHub Pages, data in Firebase.
Everything sits flat in the repo root.

---

## Look at it first, no Firebase needed

`app.js` ships with `demo: true`. Nothing talks to Firebase, data saves into that one
browser, and a yellow strip lets you switch between posting as her and as you.

Double clicking `index.html` will not work, browsers block modules on `file://`.
Either push it to GitHub Pages, or run `python -m http.server 8000` in the folder.

---

## Firebase setup

No credit card needed. You are staying on the free Spark plan, which covers
Authentication and Firestore. Cloud Storage is the only paid part and this site
does not use it: pictures are shrunk in the browser and kept inside Firestore.

### 1. Make the project

console.firebase.google.com, Add project, name it, skip Google Analytics.

### 2. Turn on sign in

Build, Authentication, Get started, **Email/Password**, enable, save.

Users tab, Add user, twice:
- her email and a password you choose
- your email and a password

These are just labels for the site. Neither of you needs a real Gmail inbox for it,
any address works, but use ones you will remember.

### 3. Make the database

Build, Firestore Database, Create database, **Start in production mode**, region
`nam5` or any US one. Create.

Do **not** touch Storage. You do not need it.

### 4. Rules

Firestore, Rules tab. Delete what is there, paste this with your two real emails,
then Publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function ours() {
      return request.auth != null && request.auth.token.email in [
        "her@example.com",
        "you@example.com"
      ];
    }
    match /{document=**} {
      allow read, write: if ours();
    }
  }
}
```

This is the part that keeps her data private. The HTML is public, the data is not.
Without this anyone could read everything.

### 5. Allow your domain

Authentication, Settings tab, Authorized domains, Add domain, `amzadams.github.io`.
Without it sign in fails with `auth/unauthorized-domain`.

### 6. Get your config

Project settings (the gear), General, scroll to Your apps, click the web icon `</>`.
Give it any nickname, Register app. Copy the `firebaseConfig` object it shows.

### 7. Edit app.js

Paste the config over the placeholder one, then set:

```js
export const SETUP = {
  demo: false,
  useCloudStorage: false,
  dueDate: "2027-04-17",
  herName: "Halima",
  hisName: "Amz",
  herEmail: "the email you created for her",
  clinicName: "Altru Clinic",
  clinicPhone: "+17017805000"
};
```

Commit the new `app.js`. Hard refresh. You should land on the sign in screen.

### 8. Set the due date properly

Sign in, go to More, Settings, and put in whatever date the clinic gave.

---

## Pictures

Any picture is automatically shrunk to roughly 200 KB before saving, so scans,
bump photos and photographed clinic reports all work. Firestore's free tier holds
1 GB, which is thousands of pictures.

PDFs and Word files are not supported on this setup. Photograph them instead.

If you ever want real file uploads: upgrade the Firebase project to Blaze, enable
Storage, publish matching Storage rules, and set `useCloudStorage: true`. Blaze needs
a card on file even though the usage would be free.

---

## What is in it

| Page | What it does |
|---|---|
| `index.html` | 40 week ring, countdown, this week, today's summary, next visit, latest updates |
| `log.html` | Timestamped entries of any kind with pictures, daily trackers, 14 day history |
| `week.html` | All 40 weeks, tap any one |
| `food.html` | Searchable food and medicine lookup, Ghanaian dishes included |
| `appointments.html` | Visits, question list per visit, notes after, calendar export |
| `gallery.html` | Scans and bump photos, tagged with the week |
| `updates.html` | Shared feed, colour coded by who wrote it |
| `flags.html` | Warning signs with call buttons |
| `settings.html` | Due date, LMP calculator, notifications |
| `more.html` | Hub for everything above |

---

## Sending it to her

Send `https://amzadams.github.io/littleone/` and her email and password.
Tell her to open it in **Safari**, not Chrome, since only Safari on iPhone can add it
to the home screen, and iOS only allows notifications once it has been added that way.
Share button, Add to Home Screen.

She signs in once and stays signed in.

---

## Changing things

Content lives in `data.js` as plain text: the 40 weeks, foods, medicines, warning signs.
Colours are at the top of `style.css`. Edit, commit, done. She sees it next time she opens it.

---

## Worth adding later

- Kick counter, from week 28
- Weight log with a chart
- Hospital bag checklist, around week 34
- Contraction timer, week 37
- Baby name list you both add to and vote on
