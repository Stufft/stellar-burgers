import path from 'node:path';
import fs from 'node:fs';
import { BrowserContext, expect, Page, test } from '@playwright/test';

const apiHarPath = path.join(process.cwd(), 'tests', 'hars', 'api.har');

type TIngredientMock = {
  name: string;
  type: 'bun' | 'main' | 'sauce';
};

type THarEntry = {
  request: {
    url: string;
  };
  response: {
    content: {
      text: string;
    };
  };
};

const apiHar = JSON.parse(fs.readFileSync(apiHarPath, 'utf-8')) as {
  log: { entries: THarEntry[] };
};

const ingredientsEntry = apiHar.log.entries.find((entry) =>
  entry.request.url.endsWith('/ingredients')
);
const ingredientsMock = JSON.parse(ingredientsEntry!.response.content.text) as {
  data: TIngredientMock[];
};

const bunName = ingredientsMock.data.find((item) => item.type === 'bun')!.name;
const mainName = ingredientsMock.data.find((item) => item.type === 'main')!.name;
const sauceName = ingredientsMock.data.find(
  (item) => item.type === 'sauce'
)!.name;

const addIngredient = async (page: Page, ingredientName: string) => {
  const ingredientCard = page.locator('li').filter({ hasText: ingredientName });
  await ingredientCard.getByRole('button').click();
};

const addAuthTokens = async (context: BrowserContext, page: Page) => {
  await context.addCookies([
    {
      name: 'accessToken',
      value: 'test-token',
      url: 'http://localhost:4000'
    }
  ]);
  await page.evaluate(() => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
  });
};

const clearAuthTokens = async (context: BrowserContext, page: Page) => {
  await context.clearCookies();
  await page.evaluate(() => {
    window.localStorage.removeItem('refreshToken');
  });
};

test.describe('constructor page', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(apiHarPath, {
      url: '**/api/**',
      update: false
    });
    await page.goto('/');
  });

  test('adds bun and ingredients to constructor', async ({ page }) => {
    await addIngredient(page, bunName);
    await addIngredient(page, mainName);
    await addIngredient(page, sauceName);

    const constructor = page.locator('section').last();
    await expect(constructor.getByText(bunName)).toHaveCount(2);
    await expect(constructor.getByText(mainName)).toBeVisible();
    await expect(constructor.getByText(sauceName)).toBeVisible();
    await expect(constructor.getByText('3024')).toBeVisible();
  });

  test('opens and closes ingredient modal', async ({ page }) => {
    await page.getByText(bunName).first().click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(bunName)).toBeVisible();
    await expect(modal.getByText('420')).toBeVisible();

    await modal.locator('button').click();
    await expect(modal.getByText(bunName)).toBeHidden();
  });

  test('closes ingredient modal by overlay click', async ({ page }) => {
    await page.getByText(sauceName).first().click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(sauceName)).toBeVisible();

    await modal.locator('div').last().click({ position: { x: 10, y: 10 } });
    await expect(modal.getByText(sauceName)).toBeHidden();
  });

  test('creates order and shows order number', async ({ context, page }) => {
    await addAuthTokens(context, page);
    await page.reload();

    await addIngredient(page, bunName);
    await addIngredient(page, mainName);

    await page.locator('section').last().getByRole('button').last().click();

    const modal = page.locator('#modals');
    await expect(modal.getByText('1337')).toBeVisible();
    await expect(page.locator('section').last().getByText(bunName)).toBeHidden();

    await modal.locator('button').click();
    await expect(modal.getByText('1337')).toBeHidden();
    await expect(page.locator('section').last().getByText('0')).toBeVisible();

    await clearAuthTokens(context, page);
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem('refreshToken')))
      .toBeNull();
  });
});
