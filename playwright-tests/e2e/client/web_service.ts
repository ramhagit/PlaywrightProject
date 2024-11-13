import { expect, type Page } from "@playwright/test";

export class WebService {
    /**
     This class holds functionality that serves all web tests
     */
    constructor(page: Page) {
        this.page = page
    }
    public page: Page

    async loginAndValidate(pass: string) {
        await this.page.goto('https://drpt-external-dev.myshopify.com/password');

        // Expect a title "to contain" a substring.
        await expect(this.page).toHaveTitle(/drpt-external-dev/);

        // Expect page to have a label for password.
        await expect(this.page.locator('label[for=password]')).toContainText('Enter store password');

        // Expect page to have an input with id = password.
        await expect(this.page.locator('input[id=password]')).toBeVisible();

        // Fill in password.
        await this.page.locator('input[id=password]').fill(pass);

        // Click Enter button.
        await this.page.getByRole('button', { name: 'Enter' }).click();

        await expect(this.page.locator('#Banner-template--15463406633184__image_banner')).toContainText('Talk about your brand');
    }

    async goToCatalogAndSearchForItemThenValidate(item: string) {
        await this.page.getByRole('link', { name: 'Catalog' }).click();
        await this.page.getByRole('button', { name: 'Search' }).click();
        await this.page.getByPlaceholder('Search').fill(item);
        await this.page.getByRole('search').getByRole('button', { name: 'Search', exact: true }).click();
        const wantedItem = this.page.getByRole('link', { name: item });
        expect(wantedItem).toBeVisible();
        await wantedItem.click();
        const wantedItemPageHeader = this.page.getByRole('heading', { name: item });
        expect(wantedItemPageHeader).toBeVisible();
    }

    async chooseItemOptionByText(text: string) {
        await this.page.getByText(text).click();
    }

    async changeItemOptionQuantity(quantity: number) {
        await this.page.getByLabel('Quantity').fill(quantity.toString());
    }

    async addToCartValidatePopupAndClose() {
        await this.page.getByRole('button', { name: 'Add to cart' }).click();
        await expect(this.page.getByLabel('Item added to your cart')).toBeVisible();
        await this.page.getByRole('button', { name: 'Close' }).click();
    }

    async enterCartWithValidationOfDesiredQuantity(desiredQuantity: number) {
        await this.page.getByRole('link', { name: `Cart ${desiredQuantity} items` }).click();
        await expect(this.page.getByRole('heading', { name: 'Your cart' })).toBeVisible();
        await expect(this.page.getByRole('columnheader', { name: 'Product' })).toBeVisible();
        await expect(this.page.getByRole('columnheader', { name: 'Quantity' })).toBeVisible();
        await expect(this.page.getByRole('columnheader', { name: 'Total' })).toBeVisible();
    }

    async validateSubTotalAtCart(desiredSubtotal: number) {
        await expect(this.page.getByText(`£${desiredSubtotal.toFixed(2)} GBP`)).toBeVisible();
    }

    async checkoutFromCart() {
        await this.page.getByRole('button', { name: 'Check out' }).click();
    }

    async validateTotalAtCheckout(desiredTotal: number) {
        await expect(this.page.getByLabel('Cost summary')).toContainText(`£${desiredTotal.toFixed(2)}`);
    }

    async fillCheckOutInfo(email: string, firstName: string, lastName: string, address: string, city: string) {
        await this.page.getByPlaceholder('Email or mobile phone number').fill(email);
        await this.page.getByPlaceholder('First name (optional)').fill(firstName);
        await this.page.getByPlaceholder('Last name').fill(lastName);
        await this.page.getByPlaceholder('Address').fill(address);
        await this.page.getByPlaceholder('City').fill(city);
        await this.page.getByLabel('Shipping address', { exact: true }).getByText('£').click();
    }

    async validateErrorForInvalidEmail() {
        await expect(this.page.locator('#error-for-email')).toContainText('Enter a valid email');
    }

    async fillCreditCardDetails(cardNum: string, expiryMonth: number, expiryYear: number, verificationCode: number, cardHolderName: string) {
        // those sensitive fields are each in their own iFrame - and needs special treatment
        const cardNumber_iFrame = this.page.frameLocator('//iframe[contains(@id,"card-fields-number-")]');
        const expiry_iFrame = this.page.frameLocator('//iframe[contains(@id,"card-fields-expiry-")]');
        const verificationValue_iFrame = this.page.frameLocator('//iframe[contains(@id,"card-fields-verification_value-")]');
        const nameOnCard_iFrame = this.page.frameLocator('//iframe[contains(@id,"card-fields-name-")]');
        const cardNumberLocator = cardNumber_iFrame.getByPlaceholder('Card number');
        const expiryLocator = expiry_iFrame.getByPlaceholder('Expiration date (MM / YY)');
        const verificationValueLocator = verificationValue_iFrame.getByPlaceholder('Security code');
        const nameOnCardLocator = nameOnCard_iFrame.getByLabel('Name on card');
        await cardNumberLocator.fill(cardNum);
        await expiryLocator.fill(`${expiryMonth} / ${expiryYear}`);
        await verificationValueLocator.fill(`${verificationCode}`);
        await nameOnCardLocator.fill(cardHolderName);
    }

    async validateErrorForInvalidCardNumber() {
        const cardNumber_iFrame = this.page.frameLocator('//iframe[contains(@id,"card-fields-number-")]');
        await expect(cardNumber_iFrame.locator('#error-for-number')).toContainText('Enter a card number');
    }

    async clickPayNowAndValidate(email: string, firstName: string, cardHolderName: string, desiredTotal: number) {
        await this.page.getByRole('button', { name: 'Pay now' }).click();
        await expect(this.page.getByRole('heading', { name: `Thank you, ${firstName}!` })).toBeVisible();
        await expect(this.page.getByText('Confirmation #')).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Your order is confirmed' })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Order details' })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Contact information' })).toBeVisible();
        await expect(this.page.getByText(email)).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Shipping address' })).toBeVisible();
        await expect(this.page.getByRole('heading', { name: 'Payment method' })).toBeVisible();
        await expect(this.page.getByRole('img', { name: cardHolderName })).toBeVisible();
        await expect(this.page.getByLabel('Cost summary').getByText(`£${desiredTotal.toFixed(2)}`)).toBeVisible();
    }
}