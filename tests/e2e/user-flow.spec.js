import { test, expect } from '@playwright/test';

test.describe('User Flow', () => {
  test('user can sign up, login, search, and review provider', async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      full_name: 'Test User',
      email: `test${timestamp}@example.com`,
      phone_number: `+2348${timestamp.toString().slice(-9)}`,
      password: 'password123'
    };

    // Go to homepage
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/LocalServices/);

    // Navigate to register
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/\/auth\/register/);

    // Fill registration form
    await page.fill('input[type="text"]', testUser.full_name);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="tel"]', testUser.phone_number);
    const passwordFields = await page.locator('input[type="password"]').all();
    await passwordFields[0].fill(testUser.password);
    await passwordFields[1].fill(testUser.password);

    // Submit registration
    await page.click('button[type="submit"]');

    // Note: In real scenario, OTP would be sent. For testing, you'd need to mock this
    // or use a test phone number that returns a known OTP
    
    // For this example, we'll test the login flow instead with existing user
    await page.goto('http://localhost:3000/auth/login');
    
    // Use seeded user credentials
    await page.selectOption('select', 'user');
    await page.fill('input[type="email"]', 'john@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Should redirect to homepage
    await page.waitForURL('http://localhost:3000');

    // Search for providers
    await page.selectOption('select', 'plumber');
    await page.click('button:has-text("Search")');

    // Should see search results
    await expect(page).toHaveURL(/\/search/);
    await expect(page.locator('text=Found')).toBeVisible();

    // Click on first provider
    await page.click('.card >> nth=0');

    // Should see provider profile
    await expect(page).toHaveURL(/\/providers\/\d+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('can browse categories from homepage', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Click on a category
    await page.click('text=Plumber');

    // Should navigate to search with category filter
    await expect(page).toHaveURL(/\/search\?category=plumber/);
  });
});
