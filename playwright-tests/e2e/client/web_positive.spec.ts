import { test, type Page } from '@playwright/test';
import { WebService } from './web_service';

test.describe.configure({ mode: 'serial' });

let page: Page;
let webService: WebService;
const email = 'auto.test@gmail.com';
const first_name = 'Positive';
const last_name = 'Scenario';
const address = 'Candi';
const city = 'Date';
const card_holder = 'BOGUS';
const desired_subtotal = 33.00;
const desired_total = 56.99;

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

test('choose "Medium" option for hamburger', async () => {
    await webService.chooseItemOptionByText('Medium');
});

test('choose quantity of 2 for medium hamburger', async () => {
    await webService.changeItemOptionQuantity(2);
});

test('add 2 medium hamburger to cart', async () => {
    await webService.addToCartValidatePopupAndClose();
});

test('choose "So Large" option for hamburger', async () => {
    await webService.chooseItemOptionByText('So large you can\'t eat it');
});

test('choose quantity of 1 for so large hamburger', async () => {
    await webService.changeItemOptionQuantity(1);
});

test('add 1 so large hamburger to cart', async () => {
    await webService.addToCartValidatePopupAndClose();
});

test('search for Chips', async () => {
    await webService.goToCatalogAndSearchForItemThenValidate('Dropit Chips (QA Automation)');
});

test('choose "Large" option for chips', async () => {
    await webService.chooseItemOptionByText('Large');
});

test('choose quantity of 2 for large chips', async () => {
    await webService.changeItemOptionQuantity(2);
});

test('add 2 large chips to cart', async () => {
    await webService.addToCartValidatePopupAndClose();
});

test('choose "Too Much" option for chips', async () => {
    await webService.chooseItemOptionByText('Too much for you to handle');
});

test('choose quantity of 1 for too much chips', async () => {
    await webService.changeItemOptionQuantity(1);
});

test('add 1 too much chips to cart', async () => {
    await webService.addToCartValidatePopupAndClose();
});

test('enter cart - validate 6 items', async () => {
    await webService.enterCartWithValidationOfDesiredQuantity(6);
});

test('validate desired subtotal at cart', async () => {
    await webService.validateSubTotalAtCart(desired_subtotal);
});

test('click "Check out" at cart', async () => {
    await webService.checkoutFromCart();
});

test('validate desired total at checkout', async () => {
    await webService.validateTotalAtCheckout(desired_total);
});

test('fill-in check-out details: personal information', async () => {
    await webService.fillCheckOutInfo(email, first_name, last_name, address, city);
});

test('fill-in check-out details: credit card information', async () => {
    await webService.fillCreditCardDetails('1', 12, 26, 777, 'Bogus Gateway');
});

test('clicking "Pay Now" and validating order submitted', async () => {
    await webService.clickPayNowAndValidate(email, first_name, card_holder, desired_total);
});