import { test, expect } from '@playwright/test';

const URL = 'https://petstore.swagger.io/v2';
const expectedNameOfFourthPet = "Puff";

type Pet = {
    id?: number;
    category?: { id: number; name: string; };
    name: string;
    photoUrls: string[];
    tags?: { id: number; name: string; }[];
    status?: "available" | "pending" | "sold";
}

const newPet: Pet = {
    id: 1000,
    category: {
        id: 0,
        name: "string"
    },
    name: "doggie",
    photoUrls: [
        "string"
    ],
    tags: [
        {
            id: 0,
            name: "string"
        }
    ],
    status: "available"
};

test('create new pet with status "available" then change status to "sold"', async ({ request }) => {
    const createNewPetResponse = await request.post(`${URL}/pet`, {
        data: newPet
    });
    const createNewPetResponseBody = await createNewPetResponse.json();
    console.log('createNewPetResponse: ', createNewPetResponseBody);
    expect(createNewPetResponse.ok()).toBeTruthy();
    expect(createNewPetResponse.status()).toBe(200);
    expect(createNewPetResponseBody.status).toEqual("available");

    createNewPetResponseBody.status = "sold";
    console.log('modifiedCreateNewPetResponse: ', createNewPetResponseBody);

    const putPetResponse = await request.put(`${URL}/pet`, {
        data: createNewPetResponseBody
    });
    const putPetResponseBody = await putPetResponse.json();
    console.log('putPetResponse: ', putPetResponseBody);
    expect(putPetResponse.ok()).toBeTruthy();
    expect(createNewPetResponse.status()).toBe(200);
    expect(putPetResponseBody.id).toEqual(createNewPetResponseBody.id);
    expect(putPetResponseBody.name).toEqual(createNewPetResponseBody.name);
    expect(putPetResponseBody.status).toEqual("sold");
});

test('get all pets with status "available", varify fourth pet\'s name', async ({ request }) => {
    const getPetsResponse = await request.get(URL + `/pet/findByStatus?status=available`);
    const availablePets = await getPetsResponse.json();
    console.log('number of available pets: ', availablePets.length);
    // console.log('availablePets: ', availablePets);
    expect(getPetsResponse.ok()).toBeTruthy();
    expect(getPetsResponse.status()).toBe(200);
    expect(availablePets.length).toBeGreaterThan(4);
    const availablePetWithExpectedName = availablePets.findIndex((pet) => { pet.name === expectedNameOfFourthPet });
    console.log(`index of pet with name = "${expectedNameOfFourthPet}": `, availablePetWithExpectedName);
    expect(availablePets[3]).toHaveProperty("name");
    console.log('the fourth pet: ', availablePets[3]);
    expect(availablePets[3].name).toEqual(expectedNameOfFourthPet);
});

test('get pets with status "sold"', async ({ request }) => {
    const getSoldPetsResponse = await request.get(URL + `/pet/findByStatus?status=sold`);
    const soldPets = await getSoldPetsResponse.json();
    console.log('number of sold pets: ', soldPets.length);
    console.log('sold pets: ', soldPets);
    expect(getSoldPetsResponse.ok()).toBeTruthy();
    expect(getSoldPetsResponse.status()).toBe(200);
    expect(soldPets.length).toBeGreaterThan(0);
    soldPets.forEach(soldPet => {
        expect(soldPet).toHaveProperty("status");
        expect(soldPet.status).toEqual("sold");
    });
});

