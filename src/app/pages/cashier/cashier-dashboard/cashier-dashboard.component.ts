import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service'; // Adjust the import path as necessary

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { MenuItemService } from '../../../services/menu-item.service';
import { PaymentService } from '../../../services/payment.service'; // Adjust the import path as necessary
import { Button, ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber'; // Import InputNumberModule for number input
import { TableModule } from 'primeng/table'; // Import TableModule for table component
import { DialogModule } from 'primeng/dialog';
import { catchError, finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { MenuCategory } from '../../../domain/menu-category';
import { MenuItem } from '../../../domain/menu-item';
import { MenuItemVariant } from '../../../domain/menu-item-variant';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReactiveFormsModule } from '@angular/forms';
import { Order } from '../../../domain/pos/Order';
import { OrderStatus } from '../../../domain/pos/OrderStatus';
import { OrderItem } from '../../../domain/pos/OrderItem';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-cashier-dashboard',
  imports: [CommonModule,RouterModule,FormsModule,ButtonModule,ToolbarModule,InputNumberModule,TableModule,DialogModule,RadioButtonModule,ReactiveFormsModule,ToastModule],
  templateUrl: './cashier-dashboard.component.html',
  styleUrl: './cashier-dashboard.component.css',
  providers: [MessageService]
})
export class CashierDashboardComponent implements OnInit {

   categories: MenuCategory[] = [];
  menuItems: MenuItem[] = [];
  selectedCategory: MenuCategory | null = null;
  selectedMenuItem: MenuItem | null = null;
  selectedVariant: MenuItemVariant | null = null;
  
  currentOrder: Order = this.initializeNewOrder();
  quantity: number = 1;
  
  paymentDialog: boolean = false;
  paymentMethod: 'CASH' | 'CARD' = 'CASH';
  cashAmount: number = 0;
  changeAmount: number = 0;
  
  loading: boolean = false;
  error: string = '';
  
  constructor(
    private menuService: MenuItemService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  initializeNewOrder(): Order {
    return {
      id: 0,
      orderStatus: OrderStatus.PENDING,
      totalAmount: 0,
      isPaid: false,
      isOnline: false,
      orderTime: new Date().toISOString(),
      // createdAt: new Date(),
      items: [],
    };
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';
    
    this.menuService.getCategories().pipe(
      catchError(err => {
        this.error = 'Failed to load menu categories. Please try again.';
        console.error('Error loading categories:', err);
        return [];
      }),
      finalize(() => this.loading = false)
    ).subscribe(data => {
      this.categories = data;
      if (this.categories.length > 0) {
        this.selectCategory(this.categories[0]);
      }
    });
  }

  selectCategory(category: MenuCategory): void {
    this.selectedCategory = category;
    this.selectedMenuItem = null;
    this.selectedVariant = null;
    this.loading = true;
    
    this.menuService.getMenuItemsByCategory(category.id).pipe(
      catchError(err => {
        this.error = 'Failed to load menu items. Please try again.';
        console.error('Error loading menu items:', err);
        return [];
      }),
      finalize(() => this.loading = false)
    ).subscribe(data => {
      this.menuItems = data;
    });
  }

  selectMenuItem(item: MenuItem): void {
    this.selectedMenuItem = { ...item };
    this.selectedVariant = null;
    this.loading = true;
    
    this.menuService.getVariantsByMenuItem(item.id).pipe(
      catchError(err => {
        this.error = 'Failed to load item variants. Please try again.';
        console.error('Error loading variants:', err);
        return [];
      }),
      finalize(() => this.loading = false)
    ).subscribe(variants => {
      if (this.selectedMenuItem) {
        this.selectedMenuItem.variants = variants;
      }
    });
  }

  selectVariant(variant: MenuItemVariant): void {
    this.selectedVariant = variant;
  }

  addToOrder(): void {
    if (!this.selectedMenuItem || !this.selectedVariant) return;

    const existingItemIndex = this.currentOrder.items.findIndex(
      item => this.selectedVariant && item.menuItemId === this.selectedVariant.id
    );

    if (existingItemIndex > -1) {
      // Update existing item quantity
      this.currentOrder.items[existingItemIndex].quantity += this.quantity;
      // this.currentOrder.items[existingItemIndex].subtotal = 
        this.currentOrder.items[existingItemIndex].quantity * this.currentOrder.items[existingItemIndex].unitPrice;
    } else {
      // Add new item to order
      const newItem: OrderItem = {
        id: 0,
        orderId: this.currentOrder.id,
        menuItemId: this.selectedMenuItem.id,
        menuItemVariantId: this.selectedVariant.id,
        quantity: this.quantity,
        unitPrice: this.selectedVariant.price,
        subTotal: this.quantity * this.selectedVariant.price,
        menuItemName: this.selectedMenuItem.name,
        size: this.selectedVariant.size as 'SMALL' | 'LARGE',
        variant: this.selectedVariant.variant
      };
      
      this.currentOrder.items.push(newItem);
    }
    
    // Recalculate total
    this.updateOrderTotal();
    
    // Reset selection
    this.quantity = 1;
  }
  
  updateOrderTotal(): void {
    this.currentOrder.totalAmount = this.currentOrder.items.reduce(
      (total, item) => total + item.subTotal, 0
    );
  }
  
  removeItem(index: number): void {
    this.currentOrder.items.splice(index, 1);
    this.updateOrderTotal();
  }
  
  updateItemQuantity(index: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(index);
      return;
    }
    
    this.currentOrder.items[index].quantity = newQuantity;
    this.currentOrder.items[index].subTotal = 
      this.currentOrder.items[index].quantity * this.currentOrder.items[index].unitPrice;
    
    this.updateOrderTotal();
  }
  
  openPaymentDialog(): void {
    if (this.currentOrder.items.length === 0) return;
    
    this.paymentDialog = true;
    this.cashAmount = this.currentOrder.totalAmount;
    this.calculateChange();
  }
  
  calculateChange(): void {
    this.changeAmount = this.cashAmount - this.currentOrder.totalAmount;
  }
  
  // processPayment(): void {
  //   this.loading = true;
  //   this.error = '';

  //   if (!this.currentOrder.isOnline) {
  //     const orderData = {
  //       customerId: this.currentOrder.customerId || null,
  //       tableNumber: this.currentOrder.tableNumber || null,
  //       paymentMethod: this.paymentMethod,
  //       totalAmount: this.currentOrder.totalAmount,
  //       orderStatus: this.currentOrder.orderStatus,
  //       orderTime: this.currentOrder.orderTime,
  //       specialInstructions: this.currentOrder.specialInstructions,
  //       isOnline: false,
  //       items: this.currentOrder.items.map((item: OrderItem) => ({
  //         id: item.menuItemId,
  //         variant: { id: item.menuItemVariantId },
  //         quantity: item.quantity,
  //         specialInstructions: item.specialInstructions || ''
  //       }))
  //     };

  //     this.orderService.createOrder(orderData).pipe(
  //       catchError(err => {
  //         this.error = err.message || 'Failed to save order. Please try again.';
  //         console.error('Error saving order with orderdata:', err);
  //         this.loading = false;
  //         return [];
  //       })
  //     ).subscribe(savedOrder => {
  //       if (!savedOrder || !savedOrder.orderId) {
  //         this.error = 'Failed to save order. Please try again.';
  //         console.error('Error saving order data:', savedOrder);
  //         this.loading = false;
  //         return;
  //       }
  //       this.currentOrder.id = savedOrder.orderId;
  //       this.processPaymentForOrder(savedOrder);
  //     });
  //   } else {
  //     this.processPaymentForOrder(this.currentOrder);
  //   }
  // }

  processPayment(): void {
  this.loading = true;
  this.error = '';

  // Construct the order data to send to the backend
  const orderData = {
    customerId: this.currentOrder.customerId || null,
    tableNumber: this.currentOrder.tableNumber || null,
    paymentMethod: this.paymentMethod,
    totalAmount: this.currentOrder.totalAmount,
    orderStatus: this.currentOrder.orderStatus,
    orderTime: this.currentOrder.orderTime,
    specialInstructions: this.currentOrder.specialInstructions,
    isOnline: false,
    items: this.currentOrder.items.map((item: OrderItem) => ({
      id: item.menuItemId,
      variant: { id: item.menuItemVariantId },
      quantity: item.quantity,
      specialInstructions: item.specialInstructions || ''
    }))
  };

  // Step 1: Create order
  this.orderService.createOrder(orderData).pipe(
    catchError(err => {
      this.error = err.message || 'Failed to save order. Please try again.';
      console.error('Error saving order:', err);
      this.loading = false;
      return []; // Empty observable to stop further operations
    })
  ).subscribe(savedOrder => {
    if (!savedOrder || !savedOrder.orderId) {
      this.error = 'Failed to save order. Please try again.';
      this.loading = false;
      return;
    }

    // Save the returned orderId to currentOrder for tracking
    this.currentOrder.id = savedOrder.orderId;

    // Step 2: Process payment using saved orderId
    const paymentDetails = {
      orderId: savedOrder.orderId,
      amount: this.currentOrder.totalAmount,
      paymentMethod: this.paymentMethod,
      cashReceived: this.paymentMethod === 'CASH' ? this.cashAmount : undefined,
      change: this.paymentMethod === 'CASH' ? this.changeAmount : undefined,
      isOnline: false
    };

    this.orderService.processInPersonPayment(savedOrder.orderId, paymentDetails).pipe(
      catchError(err => {
        this.error = err.message || `Failed to process ${this.paymentMethod} payment.`;
        this.loading = false;
        return [];
      }),
      finalize(() => this.loading = false)
    ).subscribe(order => {
      if (order) {
        this.finishTransaction(order);
      } else {
        this.error = 'Payment processing failed. Please try again.';
      }
    });
  });
}


  processPaymentForOrder(order: Order): void {
    const paymentDetails = {
      orderId: order.id!,
      amount: order.totalAmount,
      paymentMethod: this.paymentMethod,
      cashReceived: this.paymentMethod === 'CASH' ? this.cashAmount : undefined,
      change: this.paymentMethod === 'CASH' ? this.changeAmount : undefined,
      isOnline: false
    };
    

    this.orderService.processInPersonPayment(order.id!, paymentDetails).pipe(
      catchError(err => {
        this.error = err.message || `Failed to process ${this.paymentMethod} payment.`;
        this.loading = false;
        return [];
      }),
      finalize(() => this.loading = false)
    ).subscribe(order => {
      if (order) {
        this.finishTransaction(order);
      } else {
        this.error = 'Payment processing failed. Please try again.';
      }
    });
  }

  finishTransaction(order: Order): void {
    this.paymentDialog = false;

     // Show toast notification
  this.messageService.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Order processed successfully!',
    life: 3000 // milliseconds
  });

  // Clear the order and reset selections
  this.currentOrder = this.initializeNewOrder();
  this.selectedMenuItem = null;
  this.selectedVariant = null;

  // Navigate based on order type
  if (order.isOnline) {
    this.router.navigate(['/cashier/onlineOrders']);
  } else {
    this.router.navigate(['/cashier']);
  }
  }

  cancelOrder(): void {
    this.currentOrder = this.initializeNewOrder();
    this.selectedMenuItem = null;
    this.selectedVariant = null;
  }


  // processPayment(): void {
  //   this.loading = true;
  //   this.error = '';

  //   // Prepare order data
  //   const orderData = {
  //     ...this.currentOrder,
  //     paymentMethod: this.paymentMethod,
  //     items: this.currentOrder.items.map((item: OrderItem) => ({
  //       id: item.menuItemId,
  //       variant: { id: item.menuItemVariantId },
  //       quantity: item.quantity,
  //       specialInstructions: item.specialInstructions || '',
  //     })),
  //     userId: null, // Set based on auth service if needed
  //     tableNumber: this.currentOrder.tableNumber || 1,
  //     totalAmount: this.currentOrder.totalAmount,
  //   };

  //   // Create order
  //   this.orderService.createOrder(orderData).pipe(
  //     catchError((err) => {
  //       this.error = err.message || 'Failed to save order. Please try again.';
  //       this.loading = false;
  //       return [];
  //     })
  //   ).subscribe((savedOrder) => {
  //     if (!savedOrder || !savedOrder.id) {
  //       this.error = 'Failed to save order. Please try again.';
  //       this.loading = false;
  //       return;
  //     }

  //     // Process payment
  //     const paymentDetails = {
  //       orderId: savedOrder.id,
  //       amount: this.currentOrder.totalAmount,
  //       paymentMethod: this.paymentMethod,
  //       cashReceived: this.paymentMethod === 'CASH' ? this.cashAmount : undefined,
  //       change: this.paymentMethod === 'CASH' ? this.changeAmount : undefined,
  //     };

  //     this.processPaymentForOrder(savedOrder, paymentDetails);
  //   });
  // }

  // processPaymentForOrder(order: Order, paymentDetails: any): void {
  //   const paymentObservable =
  //     this.paymentMethod === 'CASH'
  //       ? this.paymentService.processCashPayment(order.id!, paymentDetails)
  //       : this.paymentService.processCardPayment(order.id!, paymentDetails.amount, { cardNumber: '****1234' });

  //   paymentObservable.pipe(
  //     catchError((err) => {
  //       this.error = err.message || `Failed to process ${this.paymentMethod} payment.`;
  //       this.loading = false;
  //       return [];
  //     }),
  //     finalize(() => (this.loading = false))
  //   ).subscribe((payment) => {
  //     if (payment) {
  //       this.finishTransaction(order);
  //     } else {
  //       this.error = 'Payment processing failed. Please try again.';
  //     }
  //   });
  // }

  // finishTransaction(order: Order): void {
  //   this.paymentDialog = false;

  //   // Update inventory
  //   const stockUpdateObservables = this.currentOrder.items.map((item) =>
  //     this.menuService.reduceMenuItemVariantQuantity(item.menuItemVariantId, item.quantity)
  //   );

  //   forkJoin(stockUpdateObservables).pipe(
  //     catchError((err) => {
  //       console.error('Error updating inventory:', err);
  //       return [];
  //     })
  //   ).subscribe(() => {
  //     this.currentOrder = this.initializeNewOrder();
  //     this.selectedMenuItem = null;
  //     this.selectedVariant = null;
  //     this.router.navigate(['/receipt', order.id]);
  //   });
  // }
  
  // cancelOrder(): void {
  //   this.currentOrder = this.initializeNewOrder();
  //   this.selectedMenuItem = null;
  //   this.selectedVariant = null;
  // }

  
  // processPayment(): void {
  //   this.loading = true;
  //   this.error = '';
    
  //   this.currentOrder.paymentMethod = this.paymentMethod as any;
    
  //   // First create/save the order
  //   this.orderService.createOrder(this.currentOrder).pipe(
  //     catchError(err => {
  //       this.error = 'Failed to save order. Please try again.';
  //       console.error('Error saving order:', err);
  //       return [];
  //     })
  //   ).subscribe(savedOrder => {
  //     if (!savedOrder || !savedOrder.id) {
  //       this.error = 'Failed to save order. Please try again.';
  //       this.loading = false;
  //       return;
  //     }
      
  //     // Process payment based on payment method
  //     if (this.paymentMethod === 'CASH') {
  //       const paymentDetails = {
  //         orderId: savedOrder.id,
  //         amount: this.currentOrder.total_amount,
  //         cashReceived: this.cashAmount,
  //         change: this.changeAmount
  //       };
        
  //       this.processPaymentForOrder(savedOrder, paymentDetails);
  //     } else if (this.paymentMethod === 'CARD') {
  //       const paymentDetails = {
  //         orderId: savedOrder.id,
  //         amount: this.currentOrder.total_amount,
  //         cardDetails: { cardNumber: '****1234' } // Mock card details
  //       };
        
  //       this.processPaymentForOrder(savedOrder, paymentDetails);
  //     }
  //   });
  // }
  
  // processPaymentForOrder(order: Order, paymentDetails: any): void {
  //   const paymentObservable = this.paymentMethod === 'CASH' 
  //     ? this.paymentService.processCashPayment(order.id, paymentDetails)
  //      : this.paymentService.processCardPayment(
  //       order.id, 
  //       paymentDetails.amount, 
  //       paymentDetails.cardDetails
  //     );
    
  //   paymentObservable.pipe(
  //     catchError(err => {
  //       this.error = 'Failed to process payment. Please try again.';
  //       console.error(`Error processing ${this.paymentMethod} payment:`, err);
  //       return [];
  //     }),
  //     finalize(() => this.loading = false)
  //   ).subscribe(payment => {
  //     if (payment) {
  //       this.finishTransaction(order);
  //     } else {
  //       this.error = 'Payment processing failed. Please try again.';
  //     }
  //   });
  // }
  
  // finishTransaction(order: Order): void {
  //   this.paymentDialog = false;
    
  //   // Update inventory after successful payment
  //   const stockUpdateObservables = this.currentOrder.items.map(item => 
  //     this.menuService.reduceMenuItemVariantQuantity(
  //       item.menu_item_variant_id, 
  //       item.quantity
  //     )
  //   );
    
  //   // Execute all stock updates in parallel
  //   forkJoin(stockUpdateObservables).pipe(
  //     catchError(err => {
  //       console.error('Error updating inventory:', err);
  //       return [];
  //     })
  //   ).subscribe(() => {
  //     // Print receipt functionality would go here
      
  //     // Reset for new order
  //     this.currentOrder = this.initializeNewOrder();
  //     this.selectedMenuItem = null;
  //     this.selectedVariant = null;
      
  //     // Optionally navigate to receipt view
  //     // this.router.navigate(['/receipt', order.id]);
  //   });
  // }
  //

  // categories: MenuCategory[] = [];
  // menuItems: MenuItem[] = [];
  // selectedCategory: MenuCategory | null = null;
  // selectedMenuItem: MenuItem | null = null;
  // selectedVariant: MenuItemVariant | null = null;
  
  // currentOrder: Order = this.initializeNewOrder();
  // quantity: number = 1;
  
  // paymentDialog: boolean = false;
  // paymentMethod: 'CASH' | 'CARD' = 'CASH';
  // cashAmount: number = 0;
  // changeAmount: number = 0;
  
  // constructor(
  //   private menuService: MenuItemService,
  //   private orderService: OrderService,
  //   private paymentService: PaymentService
  // ) {}

  // // ngOnInit(): void {
  // //   this.loadCategories();
  // // }

  // initializeNewOrder(): Order {
  //   return {
  //     id: 0,
  //     order_type: 'IN_RESTAURANT',
  //     status: 'PENDING',
  //     total_amount: 0,
  //     payment_status: 'PENDING',
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //     items: []
  //   };
  // }

  // loadCategories(): void {
  //   this.menuService.getCategories().subscribe(
  //     (data) => {
  //       this.categories = data;
  //       if (this.categories.length > 0) {
  //         this.selectCategory(this.categories[0]);
  //       }
  //     },
  //     (error) => console.error('Error loading categories:', error)
  //   );
  // }

  // selectCategory(category: MenuCategory): void {
  //   this.selectedCategory = category;
  //   this.selectedMenuItem = null;
  //   this.selectedVariant = null;
    
  //   this.menuService.getMenuItemsByCategory(category.id).subscribe(
  //     (data) => {
  //       // this.menuItems = data;
  //     },
  //     (error) => console.error('Error loading menu items:', error)
  //   );
  // }

  // selectMenuItem(item: MenuItem): void {
  //   this.selectedMenuItem = item;
  //   this.selectedVariant = null;
    
  //   this.menuService.getMenuItemVariants(item.id).subscribe(
  //     (variants) => {
  //       // this.selectedMenuItem.variants = variants;
  //     },
  //     (error) => console.error('Error loading variants:', error)
  //   );
  // }

  // ngOnInit(): void {
  //   this.loadDummyData();
  // }
  
  // loadDummyData(): void {
  //   this.categories = [
  //     { id: 1, name: 'Burgers' },
  //     { id: 2, name: 'Pizzas' },
  //     { id: 3, name: 'Drinks' }
  //   ];
  
  //   this.selectCategory(this.categories[0]); // auto-select first
  // }
  
  // selectCategory(category: MenuCategory): void {
  //   this.selectedCategory = category;
  //   this.selectedMenuItem = null;
  //   this.selectedVariant = null;
  
  //   // Dummy menu items
  //   this.menuItems = [
  //     {
  //       id: 1,
  //       name: 'Cheeseburger',
  //       description: 'Juicy grilled cheeseburger',
  //       categoryid: category.id,
  //       available: true,
  //       variants: [
  //         { id: 101, menu_item_id: 1, size: 'SMALL', variant: 'Beef', price: 450, stock_quantity: 10, available: true },
  //         { id: 102, menu_item_id: 1, size: 'LARGE', variant: 'Beef', price: 650, stock_quantity: 5, available: true }
  //       ]
  //     },
  //     {
  //       id: 2,
  //       name: 'Veggie Burger',
  //       description: 'Fresh and healthy',
  //       categoryid: category.id,
  //       available: true,
  //       variants: [
  //         { id: 201, menu_item_id: 2, size: 'SMALL', variant: 'Paneer', price: 400, stock_quantity: 8, available: true }
  //       ]
  //     }
  //   ];
  // }
  
  // selectMenuItem(item: MenuItem): void {
  //   this.selectedMenuItem = item;
  //   this.selectedVariant = null;
  
  //   // Directly assign dummy variants from the item
  //   if (item.variants) {
  //     this.selectedMenuItem.variants = item.variants;
  //   }
  // }
  

  // selectVariant(variant: MenuItemVariant): void {
  //   this.selectedVariant = variant;
  // }

  // addToOrder(): void {
  //   if (!this.selectedMenuItem || !this.selectedVariant) return;

  //   const existingItemIndex = this.currentOrder.items.findIndex(
  //     item => this.selectedVariant && item.menu_item_variant_id === this.selectedVariant.id
  //   );

  //   if (existingItemIndex > -1) {
  //     // Update existing item quantity
  //     this.currentOrder.items[existingItemIndex].quantity += this.quantity;
  //     this.currentOrder.items[existingItemIndex].subtotal = 
  //       this.currentOrder.items[existingItemIndex].quantity * this.currentOrder.items[existingItemIndex].unit_price;
  //   } else {
  //     // Add new item to order
  //     const newItem: OrderItem = {
  //       id: 0,
  //       order_id: this.currentOrder.id,
  //       menu_item_id: this.selectedMenuItem.id,
  //       menu_item_variant_id: this.selectedVariant.id,
  //       quantity: this.quantity,
  //       unit_price: this.selectedVariant.price,
  //       subtotal: this.quantity * this.selectedVariant.price,
  //       item_name: this.selectedMenuItem.name,
  //       size: this.selectedVariant.size,
  //       variant: this.selectedVariant.variant
  //     };
      
  //     this.currentOrder.items.push(newItem);
  //   }
    
  //   // Recalculate total
  //   this.updateOrderTotal();
    
  //   // Reset selection
  //   this.quantity = 1;
  // }
  
  // updateOrderTotal(): void {
  //   this.currentOrder.total_amount = this.currentOrder.items.reduce(
  //     (total, item) => total + item.subtotal, 0
  //   );
  // }
  
  // removeItem(index: number): void {
  //   this.currentOrder.items.splice(index, 1);
  //   this.updateOrderTotal();
  // }
  
  // updateItemQuantity(index: number, newQuantity: number): void {
  //   if (newQuantity <= 0) {
  //     this.removeItem(index);
  //     return;
  //   }
    
  //   this.currentOrder.items[index].quantity = newQuantity;
  //   this.currentOrder.items[index].subtotal = 
  //     this.currentOrder.items[index].quantity * this.currentOrder.items[index].unit_price;
    
  //   this.updateOrderTotal();
  // }
  
  // openPaymentDialog(): void {
  //   if (this.currentOrder.items.length === 0) return;
    
  //   this.paymentDialog = true;
  //   this.cashAmount = this.currentOrder.total_amount;
  //   this.calculateChange();
  // }
  
  // calculateChange(): void {
  //   this.changeAmount = this.cashAmount - this.currentOrder.total_amount;
  // }
  
  // processPayment(): void {
  //   this.currentOrder.payment_method = this.paymentMethod;
    
  //   // First create/save the order
  //   this.orderService.createOrder(this.currentOrder).subscribe(
  //     (savedOrder) => {
  //       // Then process the payment
  //       if (this.paymentMethod === 'CASH') {
  //         this.paymentService.processCashPayment(
  //           savedOrder.id, 
  //           this.currentOrder.total_amount
  //         ).subscribe(
  //           (payment) => {
  //             this.finishTransaction(savedOrder);
  //           },
  //           (error) => console.error('Error processing cash payment:', error)
  //         );
  //       } else if (this.paymentMethod === 'CARD') {
  //         // In real implementation you'd collect card details
  //         const mockCardDetails = { cardNumber: '****1234' };
          
  //         this.paymentService.processCardPayment(
  //           savedOrder.id,
  //           this.currentOrder.total_amount,
  //           mockCardDetails
  //         ).subscribe(
  //           (payment) => {
  //             this.finishTransaction(savedOrder);
  //           },
  //           (error) => console.error('Error processing card payment:', error)
  //         );
  //       }
  //     },
  //     (error) => console.error('Error saving order:', error)
  //   );
  // }
  
  // finishTransaction(order: Order): void {
  //   this.paymentDialog = false;
    
  //   // Print receipt functionality would go here
    
  //   // Reset for new order
  //   this.currentOrder = this.initializeNewOrder();
  //   this.selectedMenuItem = null;
  //   this.selectedVariant = null;
  // }
  
  // cancelOrder(): void {
  //   this.currentOrder = this.initializeNewOrder();
  //   this.selectedMenuItem = null;
  //   this.selectedVariant = null;
  // }
}
