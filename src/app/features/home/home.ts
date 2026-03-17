import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Contact } from '../contact/contact';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Footer } from '../../core/layout/footer/footer';

@Component({
  selector: 'app-home',
  imports: [CommonModule, About, Hero, Contact, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
