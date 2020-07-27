import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 8, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  // primeiro elemento é a tabela referencia
  // segundo elemento é o elemento da tabela a qual ta se referenciando
  // Uma relação one to many só existe se existir uma many to one
  @OneToMany(() => OrdersProducts, order_product => order_product.product)
  @JoinColumn()
  order_products: OrdersProducts[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
