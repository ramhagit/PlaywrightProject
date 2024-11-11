import { expect, test, type Page } from '@playwright/test';
import { WebService } from './web_service';

test.describe.configure({ mode: 'serial' });

let page: Page;
let webService: WebService;
const email = 'auto test';
const first_name = 'Negative';
const last_name = 'Scenario';
const address = 'Too';
const city = 'Bad';
const desired_subtotal = 9.00;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    webService = new WebService(page);
});
    
test(`navigate to login page and make sure it's loaded, login & make sure it succeeded`, async () => {
    await webService.loginAndValidate('giclao');
});

test('search for Hamburger', async () => {
    await webService.goToCatalogAndSearchForItemThenValidate('Dropit Hamburger (QA Automation)');
});

test('add 1 small hamburger to cart', async () => {
    await webService.addToCartValidatePopupAndClose();
});

test('search for Chips', async () => {
    await webService.goToCatalogAndSearchForItemThenValidate('Dropit Chips (QA Automation)');
});

test('choose "Medium" option for chips', async () => {
    await webService.chooseItemOptionByText('Medium');
});

test('add 1 medium chips to cart', async () => {
    await webService.addToCartValidatePopupAndClose();
});

test('enter cart - validate 2 items', async () => {
    await webService.enterCartWithValidationOfDesiredQuantity(2);
});

test('validate desired subtotal at cart', async () => {
    await webService.validateSubTotalAtCart(desired_subtotal);
});

test('click "Check out" at cart', async () => {
    await webService.checkoutFromCart();
});

test('fill-in check-out details: personal information', async () => {
    await webService.fillCheckOutInfo(email, first_name, last_name, address, city);
});

test('validate error message for invalid email', async () => {
    await webService.validateErrorForInvalidEmail();
});

test('fill-in check-out details: credit card information', async () => {
    await webService.fillCreditCardDetails('Hello', 0, 0, 0, 'Won\'t Work');
});

test('click "Pay now" and validate order NOT submitted', async () => {
    await page.getByRole('button', { name: 'Pay now' }).click();
    await expect(page.getByRole('button', { name: 'Pay now' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Payment' })).toBeVisible();
});