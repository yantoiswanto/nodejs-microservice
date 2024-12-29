import request from 'supertest';
import express from 'express';
import { faker } from '@faker-js/faker';
import catalogRoutes, { catalogService } from '../catalog.routes';
import { ProductFactory } from '../../utils/fixtures';

const app = express();
app.use(express.json());
app.use(catalogRoutes);


const mockProduct = () => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        stock: faker.number.int({ min: 10, max: 100 }),
        price: +faker.commerce.price(),
    }
}


describe("Catalog Routes", () => {
    describe("POST /products", () => {
        test("should create product successfully", async () => {
            const requestBody = mockProduct();
            const product = ProductFactory.build();
            jest.spyOn(catalogService, "createProduct")
                .mockImplementationOnce(() => Promise.resolve(product))
            const res = await request(app)
                .post("/products")
                .send(requestBody)
                .set("Accept", "application/json");
            expect(res.status).toBe(201);
            expect(res.body).toEqual(product);
        });

        test("should response with validation error 400", async () => {
            const requestBody = mockProduct();
            const res = await request(app)
                .post("/products")
                .send({...requestBody, name: ""})
                .set("Accept", "application/json");
            expect(res.status).toBe(400);
            expect(res.body).toEqual("name should not be empty");
        });

        test("should response with an internal error code 500", async () => {
            const requestBody = mockProduct();
            jest
                .spyOn(catalogService, "createProduct")
                .mockImplementationOnce(() => 
                  Promise.reject(new Error("error occurred on create product"))
            );
            const res = await request(app)
                .post("/products")
                .send(requestBody)
                .set("Accept", "application/json");
            expect(res.status).toBe(500);
            expect(res.body).toEqual("error occurred on create product");
        });
    })
})