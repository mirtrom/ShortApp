import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthorizeService } from '../authorize.service';

interface LinkModel {
  id: number;
  originalLink: string;
  shortenedLink: string;
}

interface LinkDto {
  OriginalLink: string;
}

interface RedirectDto {
  id: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  links: LinkModel[] = [];
  showForm = false;
  originalLink = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthorizeService 
    ) { } 
  showAddUrlForm(): void {
    this.showForm = true;
  }

  addUrl(): void {
    if (!this.originalLink.trim()) {
      console.error('Original link is empty');
      return;
    }

    const linkDto: LinkDto = { OriginalLink: this.originalLink };

    this.http.post('https://localhost:44305/Add', linkDto)
      .pipe(
        tap(() => this.fetchLinks()),   
        catchError(this.handleError)
      )
      .subscribe(() => {
        this.showForm = false;
        this.originalLink = '';
      });
  }

  deleteLink(id: number): void {
    this.http.delete(`https://localhost:44305/Delete/${id}`)
      .pipe(
        tap(() => this.fetchLinks()),
        catchError(this.handleError)
      )
      .subscribe(() => {
        // Обробка успішного видалення (необов'язково)
      });
  }

  openLinkInfo(linkId: number): void {
    this.router.navigate(['/info', linkId]);
  }

  ngOnInit(): void {
    this.fetchLinks();
  }

  fetchLinks(): void {
    this.http.get<LinkModel[]>('https://localhost:44305/List')
      .subscribe(data => this.links = data);
  }

  redirectUrl(id: number): void {
    const redirectDto: RedirectDto = { id: id };

    this.http.post<any>('https://localhost:44305/Redirect', redirectDto)
      .pipe(
        catchError(this.handleError)
      )
      .subscribe((response: any) => {
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        } else {
          console.error('Invalid short link');
        }
      });
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }
}
