import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Movie {
  id: string;
  title: string;
  poster: string;
  year: string;
}

interface UserProfile {
  name: string;
  email: string;
  initials: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class Tab3Page implements OnInit {
  
  // User Profile
  userName = 'John Reddy';
  userEmail = 'john.reddy@hooperplay.com';
  userAvatar = 'JR';
  
  // Edit Profile Form
  editName = '';
  editEmail = '';
  
  // Interests
  interests = ['Action', 'Thriller', 'Sci-Fi', 'Drama'];
  
  // App Info
  appVersion = '1.0.0';
  
  // Language
  selectedLanguage = 'English';
  languages = ['English', 'Hindi', 'Telugu', 'Tamil', 'Malayalam'];
  
  // Modals
  isSettingsModalOpen = false;
  isLanguageModalOpen = false;
  isInterestsModalOpen = false;
  isEditProfileModalOpen = false;  // ← NEW!
  
  // Favorites (Dummy Data)
  favorites: Movie[] = [
    { id: 'tt0468569', title: 'The Dark Knight', poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg', year: '2008' },
    { id: 'tt0137523', title: 'Fight Club', poster: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg', year: '1999' },
    { id: 'tt0111161', title: 'The Shawshank Redemption', poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg', year: '1994' },
    { id: 'tt0109830', title: 'Forrest Gump', poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg', year: '1994' },
    { id: 'tt0167260', title: 'The Lord of the Rings', poster: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg', year: '2003' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserProfile();  // ← NEW!
    this.loadFavorites();
  }

  // ==========================================
  // USER PROFILE MANAGEMENT
  // ==========================================

  loadUserProfile() {
    const stored = localStorage.getItem('hooper_user_profile');
    if (stored) {
      try {
        const profile: UserProfile = JSON.parse(stored);
        this.userName = profile.name;
        this.userEmail = profile.email;
        this.userAvatar = profile.initials;
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
  }

  openEditProfile() {
    // Pre-fill form with current values
    this.editName = this.userName;
    this.editEmail = this.userEmail;
    this.isEditProfileModalOpen = true;
    this.isSettingsModalOpen = false;  // Close settings modal
  }

  saveProfile() {
    // Validate inputs
    if (!this.editName || !this.editEmail) {
      alert('Please fill in all fields!');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editEmail)) {
      alert('Please enter a valid email address!');
      return;
    }

    // Generate initials from name
    const initials = this.generateInitials(this.editName);

    // Update profile
    this.userName = this.editName;
    this.userEmail = this.editEmail;
    this.userAvatar = initials;

    // Save to localStorage
    const profile: UserProfile = {
      name: this.userName,
      email: this.userEmail,
      initials: this.userAvatar
    };
    localStorage.setItem('hooper_user_profile', JSON.stringify(profile));

    // Close modal and show success
    this.isEditProfileModalOpen = false;
    this.presentToast('Profile updated successfully!');
  }

  generateInitials(name: string): string {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      // Single word: take first 2 letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Multiple words: take first letter of first two words
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  }

  cancelEdit() {
    this.isEditProfileModalOpen = false;
    // Reset form
    this.editName = '';
    this.editEmail = '';
  }

  async presentToast(message: string) {
    // Simple alert for now (you can use ion-toast for better UX)
    alert(message);
  }

  // ==========================================
  // EXISTING METHODS
  // ==========================================

  loadFavorites() {
    const stored = localStorage.getItem('hooper_favorites');
    if (stored) {
      try {
        this.favorites = JSON.parse(stored);
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }

  // Modal Controls
  openSettings() {
    this.isSettingsModalOpen = true;
  }

  openLanguage() {
    this.isLanguageModalOpen = true;
  }

  openInterests() {
    this.isInterestsModalOpen = true;
  }

  // Language Selection
  selectLanguage(language: string) {
    this.selectedLanguage = language;
    localStorage.setItem('hooper_language', language);
    this.isLanguageModalOpen = false;
  }

  // Settings Actions
  clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      this.favorites = [];
      // Reset to defaults
      this.userName = 'John Reddy';
      this.userEmail = 'john.reddy@hooperplay.com';
      this.userAvatar = 'JR';
      alert('All data cleared successfully!');
    }
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('hooper_user_profile');
      alert('Logged out successfully!');
    }
  }

  // Navigation
  openMovieDetail(movieId: string) {
    this.router.navigate(['/movie-detail', movieId]);
  }

  removeFavorite(movieId: string, event: Event) {
    event.stopPropagation();
    this.favorites = this.favorites.filter(m => m.id !== movieId);
    localStorage.setItem('hooper_favorites', JSON.stringify(this.favorites));
  }

  // Interest Management
  toggleInterest(interest: string) {
    const index = this.interests.indexOf(interest);
    if (index > -1) {
      this.interests.splice(index, 1);
    } else {
      this.interests.push(interest);
    }
    localStorage.setItem('hooper_interests', JSON.stringify(this.interests));
  }

  isInterestSelected(interest: string): boolean {
    return this.interests.includes(interest);
  }
}