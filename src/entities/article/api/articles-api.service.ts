import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../model/article.model';
import { SportType, Tag } from '../model/filter.model';
import { PaginatedResponse, QueryParams } from '../../../shared/types/pagination.types';

@Injectable({ providedIn: 'root' })
export class ArticlesApiService {
  private readonly http = inject(HttpClient);

  getArticles(query: QueryParams): Observable<PaginatedResponse<Article>> {
    let params = new HttpParams()
      .set('page', String(query.page ?? 1))
      .set('perPage', String(query.perPage ?? 8));

    if (query.search) params = params.set('search', query.search);
    if (query.sport) params = params.set('sport', query.sport);
    (query.tags ?? []).forEach((tag) => {
      params = params.append('tags', tag);
    });

    return this.http.get<PaginatedResponse<Article>>('/api/articles', { params });
  }

  toggleLike(articleId: number): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(
      `/api/articles/${articleId}/like`,
      {}
    );
  }

  toggleComments(articleId: number): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(
      `/api/articles/${articleId}/comments`,
      {}
    );
  }

  deleteArticle(articleId: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `/api/articles/${articleId}`
    );
  }

  getSports(): Observable<SportType[]> {
    return this.http.get<SportType[]>('/api/sports');
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>('/api/tags');
  }
}
