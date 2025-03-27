import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

// PrimeNG Modules
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-large-orders',
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    TableModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    DialogModule,
  ],
  templateUrl: './large-orders.component.html',
  styleUrl: './large-orders.component.css',
  providers: [DatePipe, MessageService],
})
export class LargeOrdersComponent implements OnInit {
  largeOrders: any[] = [];
  filteredOrders: any[] = [];
  dateRange: Date[] = [
    new Date(new Date().setMonth(new Date().getMonth() - 1)),
    new Date(),
  ];
  loading = false;
  displayDialog = false;
  selectedOrder: any;
  cols: any[] = [];
  exportColumns: any[] = [];
  tableOptions: any[] = [];
  selectedTables: any[] = [];
  amountFilter: number | null = null;
  itemsFilter: number | null = null;

  // filteredOrders is already declared above, removing this duplicate declaration
  orders: any[] = []; // Assuming orders is the original array of orders

  constructor(
    private orderService: OrderService,
    private datePipe: DatePipe,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.setupColumns();
    this.loadLargeOrders();
  }

  setupColumns(): void {
    this.cols = [
      { field: 'orderDate', header: 'Date', dataKey: 'orderDate' },
      { field: 'tableNumber', header: 'Table', dataKey: 'tableNumber' },
      { field: 'customerName', header: 'Customer', dataKey: 'customerName' },
      { field: 'totalAmount', header: 'Amount', dataKey: 'totalAmount' },
      { field: 'items.length', header: 'Items', dataKey: 'items.length' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.dataKey,
    }));
  }

  filterOrders(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement && inputElement.value) {
      const searchTerm = inputElement.value.toLowerCase();
      this.filteredOrders = this.orders.filter((order) =>
        Object.values(order).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(searchTerm)
        )
      );
    } else {
      this.filteredOrders = [...this.orders]; // Reset to all orders if search is empty
    }
  }

  loadLargeOrders(): void {
    this.loading = true;

    const startDate = this.dateRange[0];
    const endDate = this.dateRange[1];

    if (!startDate || !endDate) {
        this.loading = false;
        return;
    }

    this.orderService.getLargeOrdersByDateRange(
        this.datePipe.transform(startDate, 'yyyy-MM-dd') || '',
        this.datePipe.transform(endDate, 'yyyy-MM-dd') || ''
    ).subscribe({
        next: (orders) => {
            // Filter orders within the selected date range
            this.largeOrders = orders.filter(order => {
                const orderDate = new Date(order.orderDate);
                return orderDate >= startDate && orderDate <= endDate;
            });

            this.filteredOrders = [...this.largeOrders];
            this.setupTableOptions();
            this.loading = false;
        },
        error: (err) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load large orders',
                life: 3000,
            });
            this.loading = false;
            console.error(err);
        },
    });
}


  setupTableOptions(): void {
    const uniqueTables = [
      ...new Set(this.largeOrders.map((order) => order.tableNumber)),
    ];
    this.tableOptions = uniqueTables
      .map((table) => ({
        label: `Table ${table}`,
        value: table,
      }))
      .sort((a, b) => a.value - b.value);
  }

  onDateRangeChange(): void {
    this.loadLargeOrders();
  }

  showOrderDetails(order: any): void {
    this.selectedOrder = order;
    this.displayDialog = true;
  }

  applyFilters(): void {
    this.filteredOrders = this.largeOrders.filter((order) => {
      // Table filter
      if (
        this.selectedTables.length > 0 &&
        !this.selectedTables.includes(order.tableNumber)
      ) {
        return false;
      }

      // Amount filter
      if (this.amountFilter && order.totalAmount < this.amountFilter) {
        return false;
      }

      // Items filter
      if (this.itemsFilter && order.items.length < this.itemsFilter) {
        return false;
      }

      return true;
    });
  }

  resetFilters(): void {
    this.selectedTables = [];
    this.amountFilter = null;
    this.itemsFilter = null;
    this.filteredOrders = [...this.largeOrders];
  }

  exportExcel(): void {
    // const worksheet = XLSX.utils.json_to_sheet(this.filteredOrders);
    // const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // this.saveAsExcelFile(excelBuffer, 'large_orders');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    // const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    // FileSaver.saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }

  exportPdf(): void {
    // import('jspdf').then(jsPDF => {
    //   import('jspdf-autotable').then(x => {
    //     const doc = new jsPDF.default('p', 'px');
    //     (doc as any).autoTable({
    //       head: [this.exportColumns.map(col => col.title)],
    //       body: this.filteredOrders.map(order => [
    //         this.datePipe.transform(order.orderDate, 'mediumDate'),
    //         order.tableNumber,
    //         order.customerName || 'N/A',
    //         '$' + order.totalAmount.toFixed(2),
    //         order.items.length
    //       ]),
    //       styles: { fontSize: 9 },
    //       headStyles: { fillColor: [41, 128, 185] }
    //     });
    //     doc.save('large_orders.pdf');
    //   });
    // });
  }
}
