import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Option } from '../models/option';
import { Category } from '../models/category';
import { RankSession } from '../models/rankSession';

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

  private categoriesUrl = 'http://127.0.0.1:9001/rankData/categories'; // URL to web api
  private optionsUrl = 'http://127.0.0.1:9001/rankData/options'; // URL to web api
  private rankUrl = 'http://127.0.0.1:9001/ranking';

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
    this.log('hi');
    return this.http.get<Category[]>(this.categoriesUrl).pipe(
      tap((_) => this.log('fetched categories')),
      catchError(this.handleError<Category[]>('getCategories', []))
    );
  }

  /** GET heroes from the server */
  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.categoriesUrl}/${id}`).pipe(
      tap((_) => this.log('fetched category')),
      catchError(this.handleError<Category>('getCategory'))
    );
  }

  /** POST category to the server */
  createCategory(category: Category): Observable<Category> {
    console.log('creating category');
    return this.http.post<Category>(this.categoriesUrl, category).pipe(
      tap((_) => this.log('created category')),
      catchError(this.handleError<Category>('addCategory'))
    );
  }

  /** PUT: update the hero on the server */
  updateOption(hero: Option): Observable<any> {
    return this.http.put(this.optionsUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated option id=${hero.id}`)),
      catchError(this.handleError<any>('updateOption'))
    );
  }

  /** PUT: update the hero on the server */
  updateCategory(category: Category): Observable<any> {
    return this.http.put(this.optionsUrl, category, this.httpOptions).pipe(
      tap((_) => this.log(`updated option id=${category.id}`)),
      catchError(this.handleError<any>('updateOption'))
    );
  }

  submitRankSession(rankSession: RankSession): Observable<RankSession> {
    return this.http
      .post<RankSession>(this.rankUrl, rankSession, this.httpOptions)
      .pipe(
        tap((savedSession) =>
          this.log(`created session id=${savedSession.id}`)
        ),
        catchError(this.handleError<RankSession>('submitRankSession'))
      );
  }

  getRankSession(id: number): Observable<RankSession> {
    return this.http.get<RankSession>(`${this.rankUrl}/${id}`).pipe(
      tap((_) => this.log('fetched rank session')),
      catchError(this.handleError<RankSession>('getRankSession'))
    );
  }

  getRankSessionsForCategory(id: number): Observable<RankSession[]> {
    console.log(`sending get request for id ${id}`);
    return this.http.get<RankSession[]>(`${this.rankUrl}/category/${id}`).pipe(
      tap((_) => this.log('fetched rank sessions for category')),
      catchError(this.handleError<RankSession[]>('getRankSessionsForCategory'))
    );
  }
}
