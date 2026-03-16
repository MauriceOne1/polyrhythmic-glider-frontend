import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AboutSection } from '../about-section/about-section';
import { HeroSection } from '../hero-section/hero-section';
import { ContactSection } from "../contact-section/contact-section";

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, AboutSection, HeroSection, ContactSection],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
