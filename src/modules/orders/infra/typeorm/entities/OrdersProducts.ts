import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  @JoinTable({
    name: 'orders', // table name for the junction table of this relation
    joinColumn: {
      name: 'order_id', // name given to the column
      referencedColumnName: 'id', // Name of the column in the entity to which this column is referenced.
    },
  })
  order: Order;

  // é o "contraponto" da relação one to many no product
  // sem a propriedade 'name' ele ia criar um ProductId
  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  product_id: string;

  @Column()
  order_id: string;

  @Column('decimal', { precision: 8, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrdersProducts;
