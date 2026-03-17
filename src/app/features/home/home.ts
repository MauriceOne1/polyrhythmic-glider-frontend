import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Footer } from '../../core/footer/footer';
import { AboutSection } from '../about-section/about-section';
import { ContactSection } from '../contact-section/contact-section';
import { HeroSection } from '../hero-section/hero-section';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AboutSection, HeroSection, ContactSection, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
