import { Component , ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild('menuContainer', { static: false }) menuContainer!: ElementRef;

  slides = [
    { image: 'assets/image1.jpg', title: 'Discover Delicious Meals Online', text: 'Experience seamless navigation and secure payments for a delightful dining experience.' },
    { image: 'assets/image2.jpg', title: 'Explore Our Diverse Menu', text: 'Choose from a wide range of authentic dishes prepared by expert chefs.' },
    { image: 'assets/image3.jpg', title: 'Savor Every Bite', text: 'Enjoy the perfect blend of flavors in every meal.' }
  ];

  menuItems = [
    { image: 'assets/drinks2.jpg', title: 'Drinks', buttonText: 'Shop Now' },
    { image: 'assets/rnc2.jpg', title: 'Rice & Curry', buttonText: 'Shop Now' },
    { image: 'assets/sides1.jpg', title: 'Sides', buttonText: 'Shop Now' },
    { image: 'assets/desserts1.jpg', title: 'Desserts', buttonText: 'Shop Now' },
    { image: 'assets/salads1.jpg', title: 'Salads', buttonText: 'Shop Now' }
  ];

  currentSlide = 0;
  interval: any;
  menuScrollInterval: any;



  constructor() {
    this.startAutoSlide();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Auto-slide every 5 seconds
  }

  stopAutoSlide() {
    clearInterval(this.interval);
  }

    // Auto-scroll for the Menu Section
    startAutoScrollMenu() {
      this.menuScrollInterval = setInterval(() => {
        if (this.menuContainer) {
          const container = this.menuContainer.nativeElement;
          const scrollAmount = 300; // Adjust as needed
          if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
            container.scrollTo({ left: 0, behavior: 'smooth' }); // Reset to start
          } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, 3000); // Auto-scroll every 3 seconds
    }


  stopAutoScrollMenu() {
    clearInterval(this.menuScrollInterval);
  }


  // menu scroll
  scrollMenu(direction: number) {
    const container = this.menuContainer.nativeElement;
    const scrollAmount = 300; // Adjust this value for smoother scrolling
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }
}
