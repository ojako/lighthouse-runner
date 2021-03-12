/* eslint-disable no-console */
/* eslint-disable func-style */
'use strict'

const process = require('process')

const puppeteer = require('puppeteer')
const lighthouse = require('lighthouse')
// This port will be used by Lighthouse later.
// The specific port is arbitrary.
const PORT = 8041

// Login details.
const DOMAIN = process.argv.slice(2)[0]
const EMAIL = process.argv.slice(2)[1]
const PASSWORD = process.argv.slice(2)[2]

// Extra pages.
const page1 = process.argv.slice(2)[3]
const page2 = process.argv.slice(2)[4]
const page3 = process.argv.slice(2)[5]

if (!DOMAIN || !EMAIL || !PASSWORD) {
  console.log('You need to pass the correct arguments: "domain", "email", "password"')
  console.log('e.g. "node lighthouse.js https://my-website.com email@wazoku.com 123"')
  console.log('You can pass up to 3 additional pages to be checked if you want. Include the pages as "#/page/123 #/article/123 #/post/123"')

  return
}

// Lighthouse Config
const CONFIG = {
  port: PORT,
  disableStorageReset: true,
}

// The results which we return.
const results = []

async function test(url) {
  results.push(await lighthouse(url, CONFIG))
}

function returnScores() {
  const scores = []

  results.forEach(x => {
    const result = {
      url: x.lhr.requestedUrl,
      audits: {},
      categories: {},
    }

    // Get just the basics.
    result.audits['first-contentful-paint'] = x.lhr.audits['first-contentful-paint'].numericValue
    result.audits.interactive = x.lhr.audits.interactive.score
    result.categories.accessibility = x.lhr.categories.accessibility.score

    // Get all the audits.
    // for (const [key, value] of Object.entries(x.lhr.audits)) {
    //   result.audits.push({
    //     id: value.id,
    //     score: value.score,
    //     numericValue: value.numericValue,
    //   })
    // }

    // Get all the categories.
    // for (const [key, value] of Object.entries(x.lhr.categories)) {
    //   result.categories.push({
    //     id: value.id,
    //     score: value.score,
    //     numericValue: value.numericValue,
    //   })
    // }

    scores.push(result)
  })

  return scores
}

async function login(browser, origin) {
  const page = await browser.newPage()
  await page.goto(origin)

  // We test the login page before signing in.
  await test(origin)

  const emailInput = await page.$('#emailField')
  await emailInput.type(EMAIL)

  const passwordInput = await page.$('#passwordField')
  await passwordInput.type(PASSWORD)

  const submitButton = await page.$('[type="submit"]')
  await submitButton.click('[type="submit"]')
}

// Perform the main test tasks.
async function main() {
  const browser = await puppeteer.launch({
    args: [`--remote-debugging-port=${PORT}`],
    headless: true,
  })

  await login(browser, DOMAIN)
  
  if (page1) {await test(`${DOMAIN}${page1}`)}

  if (page2) {await test(`${DOMAIN}${page2}`)}

  if (page3) {await test(`${DOMAIN}${page3}`)}

  await browser.close()

  console.log(JSON.stringify(returnScores()))
}

main()
