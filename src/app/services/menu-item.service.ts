import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../domain/menu-item';
import { MenuItemVariant } from '../domain/menu-item-variant';
import { MenuCategory } from '../domain/menu-category';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {

  private apiUrl = 'http://localhost:8081/api/menu';

  constructor(private http: HttpClient) { }

  // Menu Item operations
  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items`);
  }

  getMenuItemsByCategory(categoryId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/items/category/${categoryId}`);
  }

  getMenuItem(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/items/${id}`);
  }

  createMenuItem(menuItem: any): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.apiUrl}/items`, menuItem);
  }

  updateMenuItem(id: number, menuItem: any): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/items/${id}`, menuItem);
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${id}`);
  }

  updateMenuItemAvailability(id: number, available: boolean): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/items/${id}/availability?available=${available}`, {});
  }

  // Menu Item Variant operations
  getAllMenuItemVariants(): Observable<MenuItemVariant[]> {
    return this.http.get<MenuItemVariant[]>(`${this.apiUrl}/menu-item-variants`);
  }

  getMenuItemVariant(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/menu-item-variants/${id}`);
  }

  getVariantsByMenuItem(menuItemId: number): Observable<MenuItemVariant[]> {
    return this.http.get<MenuItemVariant[]>(`${this.apiUrl}/menu-item-variants/menu-item/${menuItemId}`);
  }

  createMenuItemVariant(variant: any): Observable<MenuItemVariant> {
    return this.http.post<MenuItemVariant>(`${this.apiUrl}/menu-item-variants`, variant);
  }

  updateMenuItemVariant(id: number, variant: any): Observable<MenuItemVariant> {
    return this.http.put<MenuItemVariant>(`${this.apiUrl}/menu-item-variants/${id}`, variant);
  }

  deleteMenuItemVariant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/menu-item-variants/${id}`);
  }

  updateMenuItemStock(menuItemId: number, variantId: number, stockUpdateRequest: any): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/items/${menuItemId}/variants/${variantId}/stock`, stockUpdateRequest);
  }

  getAvailableQuantity(variantId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/menu-item-variants/${variantId}/available-quantity`);
  }

  reduceMenuItemVariantQuantity(variantId: number, amount: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/menu-item-variants/${variantId}/quantity/reduce?amount=${amount}`, {});
  }

  

  // private apiUrl = 'http://localhost:8081/api/menu/items'; 

  // constructor(private http: HttpClient) { }

  // getMenuItems(): Observable<MenuItem[]> {
  //   return this.http.get<MenuItem[]>(this.apiUrl);
  // }

  // getMenuItem(id: number): Observable<MenuItem> {
  //   return this.http.get<MenuItem>(`${this.apiUrl}/${id}`);
  // }

  // createMenuItem(formData: FormData): Observable<MenuItem> {
  //   console.log('Creating menu item with formData:', formData); // Debugging line
  //   console.log('FormData keys:', Array.from(formData.keys())); // Debugging line
  //   console.log('FormData values:', Array.from(formData.values())); // Debugging line
  //   return this.http.post<MenuItem>(this.apiUrl, formData);
  // }

  // updateMenuItem(id: number, formData: FormData): Observable<MenuItem> {
  //   return this.http.put<MenuItem>(`${this.apiUrl}/${id}`, formData);
  // }

  // deleteMenuItem(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`);
  // }
}
