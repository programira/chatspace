import { test, expect } from '@playwright/test';

test('Chat app should handle a large number of messages smoothly', async ({ page }) => {
  // Navigate to the chat app
  await page.goto('http://localhost:5173');

  // Wait for the Name input field to appear
  await page.waitForSelector('input', { timeout: 5000 });

  // Simulate user login
  await page.fill('input', 'TestUser1'); // Selects the name input field
  await page.click('button >> svg'); // Clicks the RocketLaunchIcon button

  // Wait for the chat page to load
  await page.waitForSelector('input[placeholder="Type your message..."]', { timeout: 5000 });

  // Send a large number of messages
  const messageCount = 10;
  for (let i = 0; i < messageCount; i++) {
    await page.fill('input[placeholder="Type your message..."]', `Test message ${i}`);
    await page.click('button:has-text("Send")');
  }

  // Wait for messages to render
  await page.waitForTimeout(2000);

  // Verify that messages are displayed correctly
  const messages = await page.locator('[data-testid^="message-"]').count();
  expect(messages).toBeGreaterThanOrEqual(messageCount);

  // Scroll to the last message to check performance
  const lastMessage = await page.locator('p[data-testid^="message-"]').last();
  await lastMessage.scrollIntoViewIfNeeded();

  // Take a screenshot for debugging (optional)
  await page.screenshot({ path: 'chat-load-test.png' });
});