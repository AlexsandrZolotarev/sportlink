import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IconService {
  private readonly http  = inject(HttpClient);
  private readonly cache = new Map<string, Observable<string>>();

  load(name: string): Observable<string> {
    if (!this.cache.has(name)) {
      const req = this.http.get(`assets/icons/${name}.svg`, { responseType: 'text' }).pipe(
        map((svg) =>
          svg
            .replace(/stroke="#818189"/g, 'stroke="currentColor"')
            .replace(/fill="#818189"/g,   'fill="currentColor"')
            .replace(/fill="#3C3C3C"/g,   'fill="currentColor"'),
        ),
        shareReplay(1),
      );
      this.cache.set(name, req);
    }
    return this.cache.get(name)!;
  }
}
