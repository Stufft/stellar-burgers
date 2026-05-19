import fs from 'node:fs';
import path from 'node:path';
import { BrowserContext, expect, Locator, Page, test } from '@playwright/test';

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
const mainName = ingredientsMock.data.find(
  (item) => item.type === 'main'
)!.name;
const sauceName = ingredientsMock.data.find(
  (item) => item.type === 'sauce'
)!.name;

const getConstructor = (page: Page) => page.getByTestId('burger-constructor');

const addIngredient = async (page: Page, ingredientName: string) => {
  const ingredientCard = page.locator('li').filter({ hasText: ingredientName });
  await ingredientCard.getByRole('button').click();
};

const expectIngredientNotInConstructor = async (
  constructor: Locator,
  ingredientName: string
) => {
  await expect(constructor.getByText(ingredientName)).toHaveCount(0);
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
    const constructor = getConstructor(page);

    await expectIngredientNotInConstructor(constructor, bunName);
    await addIngredient(page, bunName);
    await expect(constructor.getByText(bunName)).toHaveCount(2);

    await expectIngredientNotInConstructor(constructor, mainName);
    await addIngredient(page, mainName);
    await expect(constructor.getByText(mainName)).toBeVisible();

    await expectIngredientNotInConstructor(constructor, sauceName);
    await addIngredient(page, sauceName);
    await expect(constructor.getByText(sauceName)).toBeVisible();
    await expect(constructor.getByText('3024')).toBeVisible();
  });

  test('opens and closes ingredient modal', async ({ page }) => {
    await expect(page.getByTestId('modal')).toHaveCount(0);
    await page.getByText(bunName).first().click();

    const modal = page.getByTestId('modal');
    await expect(modal.getByText(bunName)).toBeVisible();
    await expect(modal.getByText('420')).toBeVisible();

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).toHaveCount(0);
  });

  test('closes ingredient modal by overlay click', async ({ page }) => {
    await expect(page.getByTestId('modal')).toHaveCount(0);
    await page.getByText(sauceName).first().click();

    const modal = page.getByTestId('modal');
    await expect(modal.getByText(sauceName)).toBeVisible();

    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId('modal')).toHaveCount(0);
  });

  test('creates order and shows order number', async ({ context, page }) => {
    await addAuthTokens(context, page);
    await page.reload();

    const constructor = getConstructor(page);
    await expectIngredientNotInConstructor(constructor, bunName);
    await addIngredient(page, bunName);
    await expect(constructor.getByText(bunName)).toHaveCount(2);

    await expectIngredientNotInConstructor(constructor, mainName);
    await addIngredient(page, mainName);
    await expect(constructor.getByText(mainName)).toBeVisible();

    await page.getByTestId('order-button').getByRole('button').click();

    const modal = page.getByTestId('modal');
    await expect(modal.getByText('1337')).toBeVisible();
    await expect(constructor.getByText(bunName)).toBeHidden();
    await expect(constructor.getByText(mainName)).toBeHidden();

    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).toHaveCount(0);
    await expect(constructor.getByText('0')).toBeVisible();

    await clearAuthTokens(context, page);
    await expect
      .poll(() =>
        page.evaluate(() => window.localStorage.getItem('refreshToken'))
      )
      .toBeNull();
  });
});
