import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface LinkInfo {
  originalLink: string;
  shortenedLink: string;
  dateAdded: string;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit {
  linkInfo: LinkInfo = {
    originalLink: '',
    shortenedLink: '',
    dateAdded: ''
  };

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const linkId = +params['id'];

      // Виконуємо GET-запит для отримання інформації про лінк
      this.http.get<LinkInfo>(`https://localhost:44305/GetLinkInfo/${linkId}`)
        .subscribe(data => {
        this.linkInfo = data;
      });
    });
  }
}
