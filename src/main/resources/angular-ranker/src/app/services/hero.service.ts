import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Hero } from '../models/hero';
import { HEROES } from '../data/mock-heroes';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private categoriesUrl = 'http://127.0.0.1:9000/data/categories'; // URL to web api
  private optionsUrl = 'http://127.0.0.1:9000/data/options'; // URL to web api

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl).pipe(
      tap((_) => this.log('fetched categories')),
      catchError(this.handleError<Category[]>('getCategories', []))
    );
  }

  /** GET heroes from the server */
  getCategory(id?: 1000): Observable<Category> {
    return this.http.get<Category>(`${this.categoriesUrl}/${id}`).pipe(
      tap((_) => this.log('fetched category')),
      catchError(this.handleError<Category>('getCategory'))
    );
  }

  /** POST category to the server */
  createCategory(category: Category): Observable<Category> {
    return this.http.get<Category>(this.categoriesUrl).pipe(
      tap((_) => this.log('created category')),
      catchError(this.handleError<Category>('addCategory'))
    );
  }

  /** PUT: update the hero on the server */
  updateOption(hero: Hero): Observable<any> {
    return this.http.put(this.optionsUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated option id=${hero.id}`)),
      catchError(this.handleError<any>('updateOption'))
    );
  }
}
