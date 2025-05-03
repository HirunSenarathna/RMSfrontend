import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuCategory } from '../domain/menu-category';

@Injectable({
  providedIn: 'root'
})
export class MenuCategoryService {

  private apiUrl = 'http://localhost:8081/api/menu/categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<MenuCategory[]> {
    return this.http.get<MenuCategory[]>(this.apiUrl);
  }

  getCategory(id: number): Observable<MenuCategory> {
    return this.http.get<MenuCategory>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: MenuCategory): Observable<MenuCategory> {
    return this.http.post<MenuCategory>(this.apiUrl, category);
  }

  updateCategory(id: number, category: MenuCategory): Observable<MenuCategory> {
    return this.http.put<MenuCategory>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
