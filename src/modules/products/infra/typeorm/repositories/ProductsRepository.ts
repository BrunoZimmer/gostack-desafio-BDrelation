import { getRepository, Repository, In } from 'typeorm';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProduct = await this.ormRepository.findOne({
      where: { name },
    });

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findProducts = await this.ormRepository.find({
      // In é usado pra mexer dentro do repositório, funções próprias de typeorm pra mexer
      // In permite que faça uma comparação com todos itens "IN" um array
      // SELECT * FROM "Product" WHERE "id" IN ('item[0].id','item[1].id' ...)
      where: { id: In(products.map(item => item.id)) },
    });

    if (findProducts.length !== products.length) {
      throw new AppError('One or more products was not found!');
    }
    return findProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const updatedProducts: Product[] = [];
    products.forEach(async product => {
      const stockProduct = await this.ormRepository.findOne(product.id);

      if (stockProduct && product.quantity > 0) {
        if (product.quantity > stockProduct.quantity) {
          throw new AppError(
            `insufficient stock for product ${stockProduct.name}, only ${stockProduct.quantity}`,
          );
        }
        stockProduct.quantity -= product.quantity;
        await this.ormRepository.save(stockProduct);
        updatedProducts.push(stockProduct);
      }
    });
    return updatedProducts;
  }
}

export default ProductsRepository;
