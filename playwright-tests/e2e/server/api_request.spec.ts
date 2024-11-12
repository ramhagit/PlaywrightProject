import { test, expect } from '@playwright/test';

const URL = 'https://petstore.swagger.io/v2';

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

    createNewPetResponseBody.status = "sold";
    console.log('modifiedCreateNewPetResponse: ', createNewPetResponseBody);

    const putPetResponse = await request.put(`${URL}/pet`, {
        data: createNewPetResponseBody
    });
    const putPetResponseBody = await putPetResponse.json();
    console.log('putPetResponse: ', putPetResponseBody);
    expect(putPetResponse.ok()).toBeTruthy();
});

test('get all pets with status "available", varify fourth pet\'s name', async ({ request }) => {
    console.log('request.storageState(): ', await request.storageState());
    const availablePets = await request.get(URL + `/pet/findByStatus?status=available`);
    console.log('availablePets: ', await availablePets.json());
    expect(availablePets.ok()).toBeTruthy();
    // expect(await pets.json()).toContainEqual(expect.objectContaining(newPet));
});

test('get pets with status "sold"', async ({ request }) => {
    const soldPets = await request.get(URL + `/pet/findByStatus?status=sold`);
    console.log('pets: ', await soldPets.json());
    expect(soldPets.ok()).toBeTruthy();
    // expect(await pets.json()).toContainEqual(expect.objectContaining(newPet));
});

