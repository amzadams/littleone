# Little One

A private pregnancy site for two people. Static files on GitHub Pages, data in Firebase.

Files are flat in the repo root, same as your other site, so GitHub Pages will not 404 on them.

---

## 0. Look at it first, no Firebase needed

`app.js` ships with `demo: true`. In that mode nothing talks to Firebase. Everything
works, data saves into that one browser, and a yellow strip at the top lets you switch
between posting as her and posting as you so you can see both card colours.

**Double clicking `index.html` will not work.** Browsers block ES modules on `file://`.
Two ways around it:

- Easiest: upload to GitHub Pages now with `demo: true` and look at the live URL.
- Locally: open a terminal in the folder and run `python -m http.server 8000`,
  then visit `http://localhost:8000`.

When you are happy with it, set `demo: false` and do steps 2 to 5.

---

## 1. Make the repo

Make a **new** repo, not inside `amzadams.github.io`. Call it something like `littleone`.
Upload every file here to the root. Settings, Pages, deploy from branch `main`, folder `/root`.

It will live at `https://amzadams.github.io/littleone/`.

The HTML is public, which is fine. Nobody can read a single piece of her data
without signing in, because of the rules in step 4.

---

## 2. Firebase project

1. console.firebase.google.com, Add project. Skip Analytics.
2. Build, Authentication, Get started, enable **Email/Password**.
3. Users tab, Add user, twice. One for her, one for you. Set real passwords.
4. Build, Firestore Database, Create database, **production mode**, pick a US region.
5. Build, Storage, Get started, production mode.
6. Project settings, General, scroll to Your apps, click the web icon `</>`.
   Register the app, copy the `firebaseConfig` object.

---

## 3. Paste your config

Open `app.js`. Replace the `firebaseConfig` block with yours, then fill in `SETUP`:

```js
export const SETUP = {
  dueDate: "2027-04-17",
  herName: "Halima",
  hisName: "Amz",
  herEmail: "the email you created for her",
  clinicName: "Altru Clinic",
  clinicPhone: "+17017805000"
};
```

`herEmail` only decides which colour her cards are. Nothing else depends on it.

---

## 4. Rules, this is the part that keeps it private

Firestore, Rules tab. Replace everything with this, putting your two real emails in:

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

Storage, Rules tab, same idea:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function ours() {
      return request.auth != null && request.auth.token.email in [
        "her@example.com",
        "you@example.com"
      ];
    }
    match /{allPaths=**} {
      allow read, write: if ours();
    }
  }
}
```

Publish both. Without these, anyone could read her data. With them, only your two accounts can.

---

## 5. Allow your domain

Authentication, Settings, Authorized domains, add `amzadams.github.io`.
Otherwise sign in fails with an `auth/unauthorized-domain` error.

---

## 6. Icons

Add `icon.png` (192x192) and `icon-512.png` (512x512) to the root so it looks right
on the home screen. Any simple image works.

---

## What is in it

| Page | What it does |
|---|---|
| `index.html` | The 40 week ring, countdown, this week, today's log, next visit, latest updates |
| `log.html` | Nausea 1 to 5, water counter, prenatal and B6 checkoff, mood, notes, 14 day history |
| `week.html` | All 40 weeks, tap any one |
| `food.html` | Searchable food and medicine lookup, including Ghanaian dishes |
| `appointments.html` | Visits, a running question list for each, notes after, calendar export |
| `gallery.html` | Scan and bump photos, tagged with the week automatically |
| `updates.html` | Shared feed, her status and your notes, colour coded by who wrote it |
| `flags.html` | Warning signs with a one tap call button |
| `settings.html` | Due date, LMP calculator, notifications |
| `more.html` | Hub for everything above |

Both of you see the same data live. If she logs water on her phone, it shows on yours.

---

## Notifications, honestly

What works now: when either of you has the site open and the other posts an update,
a browser notification pops. On her iPhone she must **add the site to the home screen
first** (share button, Add to Home Screen), otherwise iOS blocks web notifications entirely.

What does not work yet: scheduled reminders when the site is closed, like "take your B6."
That needs Firebase Cloud Messaging plus a scheduled Cloud Function, and Cloud Functions
need the Blaze plan. It stays free at this volume but needs a card on file.

Easier middle ground that costs nothing: appointments export to her phone calendar with
the "Add to calendar" link, so the phone handles reminding her.

---

## Changing things

The content is all in `data.js` and it is plain text. Edit the 40 week entries, add foods,
add medicines, change the warning signs. No code knowledge needed, just keep the commas
and quotes where they are.

Colours live at the top of `style.css`.

---

## Worth adding later

- Kick counter, from week 28
- Weight log with a simple chart
- Hospital bag checklist, around week 34
- Contraction timer, week 37
- Baby name list you both add to and vote on
- Scheduled push reminders, once you are ready for Cloud Functions
