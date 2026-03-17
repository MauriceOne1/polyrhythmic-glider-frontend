import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Footer } from '../../core/footer/footer';
import { Contact } from '../contact/contact';
import { Hero } from '../hero/hero';
import { About } from '../about/about';

@Component({
  selector: 'app-home',
  imports: [CommonModule, About, Hero, Contact, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
