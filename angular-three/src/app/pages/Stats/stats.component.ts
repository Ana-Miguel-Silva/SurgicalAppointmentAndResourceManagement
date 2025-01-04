import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Importar HttpClient

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  stats: any;

  constructor(private http: HttpClient) {}  // Injetar HttpClient

  ngOnInit(): void {
    // Alterar para fazer uma requisição HTTP, não usar o roteamento do Angular
    this.http.get('http://51.120.112.94:4200/haproxy?stats', { responseType: 'text' })
      .subscribe(
        data => {
          this.stats = data;  // Salvar os dados na variável 'stats'
          console.log('HAProxy Stats:', this.stats);  // Exibir no console
        },
        error => {
          console.error('Erro ao acessar as estatísticas', error);  // Se houver erro, mostre no console
        }
      );
  }
}