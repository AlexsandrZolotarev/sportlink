import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Observable, of, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IconService {
  private readonly http  = inject(HttpClient);
  private readonly svgCache = new Map<string, string>();
  private readonly reqCache = new Map<string, Observable<string>>();

  load(name: string): Observable<string> {
    const cachedSvg = this.svgCache.get(name);
    if (cachedSvg) {
      return of(cachedSvg);
    }

    if (!this.reqCache.has(name)) {
      const req = this.http.get(`assets/icons/${name}.svg`, { responseType: 'text' }).pipe(
        map((svg) =>
          svg
            .replace(/stroke="#818189"/g, 'stroke="currentColor"')
            .replace(/fill="#818189"/g,   'fill="currentColor"')
            .replace(/fill="#3C3C3C"/g,   'fill="currentColor"'),
        ),
        tap((svg) => {
          this.svgCache.set(name, svg);
        }),
        catchError((error) => {
          this.reqCache.delete(name);
          return throwError(() => error);
        }),
        shareReplay(1),
      );
      this.reqCache.set(name, req);
    }
    return this.reqCache.get(name)!;
  }
}
