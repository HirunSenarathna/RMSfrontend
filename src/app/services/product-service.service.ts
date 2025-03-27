import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../domain/product';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {

  constructor() { }

  getProductsData() {
    return [
        {
            id: '1000',
            code: 'f230fh0g3',
            name: 'cheese kottu',
            description: 'Product Description',
            image: 'assets/kottu3.jpeg',
            price: 650,
            category: 'kottu',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1001',
            code: 'nvklal433',
            name: 'kottu',
            description: 'Product Description',
            image: 'assets/kottu1.jpeg',
            price: 72,
            category: 'kottu',
            quantity: 61,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 4
        },
        {
            id: '1002',
            code: 'zz21cz3c1',
            name: 'Rice and curry',
            description: 'Product Description',
            image: 'assets/rnc1.jpg',
            price: 79,
            category: 'Rice and curry',
            quantity: 2,
            inventoryStatus: 'LOWSTOCK',
            rating: 3
        },
        {
            id: '1003',
            code: '244wgerg2',
            name: 'kottu',
            description: 'Product Description',
            image: 'assets/kottu4.jpeg',
            price: 29,
            category: 'kottu',
            quantity: 25,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1004',
            code: 'h456wer53',
            name: 'Drink 1',
            description: 'Product Description',
            image: '/assets/drinks1.jpg',
            price: 15,
            category: 'Drinks',
            quantity: 73,
            inventoryStatus: 'INSTOCK',
            rating: 4
        },
        {
            id: '1005',
            code: 'av2231fwg',
            name: 'slide 1',
            description: 'Product Description',
            image: 'assets/sides1.jpg',
            price: 120,
            category: 'Slides',
            quantity: 0,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 4
        },
      ]
  }
  getProductsMini() {
    return Promise.resolve(this.getProductsData().slice(0, 5));
}

getProductsSmall() {
    return Promise.resolve(this.getProductsData().slice(0, 10));
}

getProducts() {
    return Promise.resolve(this.getProductsData());
}


}
