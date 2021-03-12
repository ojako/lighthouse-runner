# Overly simplistic Lightouse test runner using Puppeteer.
Setup to allow you to login before performing tests on pages.

## Setup
```
$ npm install
$ node lighthouse.js \
    "https:my-website.com" \
    "admin@email.com" \
    "password123" \
    "#/a-page" \
    "#/another-page" \
    "#/final-page" \
    >> results.json
```
You'll need to edit the script to adapt it for your login page.
Simply updating the ID's might be enough.

### Notes
Just checks the login page and 3 more pages right now.
I'll update to take an unlimited number of pages at some point.
If you need extra pages checked just add the extra arguments.
The script is setup to just gather a few score and numerical details from the larger test results.
Add in new bits to check or uncomment the code blocks to have it generate all details.