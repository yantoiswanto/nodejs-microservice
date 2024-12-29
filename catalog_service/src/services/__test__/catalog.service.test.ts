import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { Product } from "../../models/product.model";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { ProductFactory } from "../../utils/fixtures";
import { CatalogService } from "../catalog.service";
import { faker } from '@faker-js/faker';

const mockProduct = (rest: any) => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        stock: faker.number.int({ min: 10, max: 100 }),
        ...rest,
    }
}
describe('catalogService', () => {

    let repository: ICatalogRepository;

    beforeEach(() => {
        repository = new MockCatalogRepository();
    })

    afterEach(() => {
        repository = {} as MockCatalogRepository;
    });
    describe("createProduct", () => {
        test("should create a product", async () => {
            const service = new CatalogService(repository);
            const reqBody = mockProduct({
                price: +faker.commerce.price(),
            });
            const result = await service.createProduct(reqBody)
            expect(result).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                description: expect.any(String),
                price: expect.any(Number),
                stock: expect.any(Number),
            });
        })

        test("should throw an error if unable to create product", async () => {
            const service = new CatalogService(repository);
            const reqBody = mockProduct({
                price: +faker.commerce.price(),
            });

            jest
                .spyOn(repository, "create")
                .mockImplementationOnce(() => Promise.resolve({} as Product));

            await expect(service.createProduct(reqBody)).rejects.toThrow(
                "unable to create product"
            )
        });

        test("should throw an error if the product already exists", async () => {
            const service = new CatalogService(repository);
            const reqBody = mockProduct({
                price: +faker.commerce.price(),
            });

            jest
                .spyOn(repository, "create")
                .mockImplementationOnce(() =>
                    Promise.reject(new Error("product already exists"))
                );

            await expect(service.createProduct(reqBody)).rejects.toThrow(
                "product already exists"
            )
        });
    })

    describe("updateProduct", () => {

        test("should update a product", async () => {
            const service = new CatalogService(repository);
            const reqBody = mockProduct({
                price: +faker.commerce.price(),
                id: faker.number.int({ min: 10, max: 1000 }),
            });
            const result = await service.updateProduct(reqBody)
            expect(result).toMatchObject(reqBody);
        });

        test("should throw an error if the product doest not exists", async () => {
            const service = new CatalogService(repository);
            const reqBody = mockProduct({
                price: +faker.commerce.price(),
            });

            jest
                .spyOn(repository, "update")
                .mockImplementationOnce(() =>
                    Promise.reject(new Error("product doest not exists"))
                );

            await expect(service.updateProduct(reqBody)).rejects.toThrow(
                "product doest not exists"
            )
        });
    })

    describe("getProducts", () => {

        test("should get products by offset and limit", async () => {
            const service = new CatalogService(repository);
            const randomLimit = faker.number.int({ min: 10, max: 100 });
            const products = ProductFactory.buildList(randomLimit);

            jest
                .spyOn(repository, "find")
                .mockImplementationOnce(() => Promise.resolve(products));

            const result = await service.getProducts(randomLimit, 0)
            console.log(result)
            expect(result.length).toBe(randomLimit);
            expect(result).toMatchObject(products);
        })


        test("should throw an error if the products doest not exists", async () => {
            const service = new CatalogService(repository);

            jest
                .spyOn(repository, "find")
                .mockImplementationOnce(() =>
                    Promise.reject(new Error("products doest not exists"))
                );

            await expect(service.getProducts(0, 0)).rejects.toThrow(
                "products doest not exists"
            )
        });

    });

    describe("getProduct", () => {

        test("should get product by id", async () => {
            const service = new CatalogService(repository);
            const product = ProductFactory.build();

            jest
                .spyOn(repository, "findOne")
                .mockImplementationOnce(() => Promise.resolve(product));

            const result = await service.getProduct(product.id!)
            expect(result).toMatchObject(product);
        })
    });

    describe("deleteProduct", () => {

        test("should delete product by id", async () => {
            const service = new CatalogService(repository);
            const product = ProductFactory.build();

            jest
                .spyOn(repository, "delete")
                .mockImplementationOnce(() => Promise.resolve({ id: product.id }));

            const result = await service.deleteProduct(product.id!)
            expect(result).toMatchObject({
                id: product.id,
            });
        })
    });

})
