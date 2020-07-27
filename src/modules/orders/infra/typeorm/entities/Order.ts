import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import OrdersProducts from '@modules/orders/infra/typeorm/entities/OrdersProducts';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, customer => customer.id, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  // eager serve pra carregar a orders_products automaticamente quando a order for chamada
  // é usado aqui pra conseguir ver as informações dos produtos

  // cascade permite que as alterações feitas em order reflitam em orders_products automaticamente
  // é usado aqui porque vai modificar a quantidade de produtos na order e tem q mudar nos produtos
  @OneToMany(() => OrdersProducts, order_products => order_products.order, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'orders_products', // name of the colum
    joinColumns: [{ name: 'order_id' }], // first column of the join table
    inverseJoinColumns: [{ name: 'product_id' }], // second column of the join table(inverse)
  })
  order_products: OrdersProducts[];

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}

export default Order;
