import { test, expect, chromium } from '@playwright/test';

async function generateRandomTag(length: number): Promise<string> {
  return Math.random().toString(36).substring(2, 2 + length);
}

async function generateEmail(namespace: string): Promise<string> {
  const tag: string = await generateRandomTag(10);

  const email: string = `${namespace}.${tag}@inbox.testmail.app`;
  
  return email;
}

test('test register', async () => {
  let browserChromium = await chromium.launch({headless: false});

  const page = await browserChromium.newPage();

  const namespace: string = "utzs7"

  const email: string = await generateEmail(namespace);

  page.setDefaultTimeout(30000);

  await page.goto("http://localhost:4173");

  await page.waitForURL("http://localhost:4173");

  await page.click(`text="Go to App"`);

  await page.waitForURL("http://localhost:4173/app/account");

  await page.fill('input[name="email"]', email);

  await page.click(`text="Continue"`);

  console.log(email.split('.')[1]);

  const fetchData = await fetch(`https://api.testmail.app/api/json?namespace=${namespace}&tag=${email.split('.')[1].split('@')[0]}&livequery=true&apikey=c07495aa-a753-44de-bd63-a8fe35d479a1`);

  let code = (await fetchData.json()).emails[0].subject.split(' ')[0];

  await page.locator('#otp-0').pressSequentially(code);

  await page.goto("http://localhost:4173/app/dashboard");

  await page.waitForSelector();

  await page.waitForTimeout(10000);
});