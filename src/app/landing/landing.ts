import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [ButtonModule],
  selector: 'app-landing',
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  protected readonly message = signal('');
  protected readonly isDark = signal(false);
  protected readonly signingIn = signal(false);
  private readonly document = inject(DOCUMENT);

  constructor() {
    afterNextRender(() => {
      const view = this.document.defaultView;
      let preference: string | null = null;

      try {
        preference = view?.localStorage.getItem('articulate-theme') ?? null;
      } catch {
        // Storage may be unavailable; fall back to the system preference.
        preference = 'light';
      }

      this.isDark.set(
        preference === 'dark' ||
          (preference !== 'light' &&
            (view?.matchMedia('(prefers-color-scheme: dark)').matches ?? false)),
      );
      this.syncThemeClass();
    });
  }

  protected async signInWithGoogle(): Promise<void> {
    this.signingIn.set(true);
    this.message.set('Connecting to Google…');

    try {
      const [{ GoogleAuthProvider, signInWithPopup }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('./firebase.config'),
      ]);
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const name = credential.user.displayName ?? credential.user.email ?? 'your Google account';
      this.message.set(`Signed in as ${name}.`);
    } catch (error) {
      const code = (error as { code?: string }).code;
      this.message.set(
        code === 'auth/popup-closed-by-user'
          ? 'Google sign-in was cancelled.'
          : 'Unable to sign in with Google. Please try again.',
      );
    } finally {
      this.signingIn.set(false);
    }
  }

  protected async logout(): Promise<void> {
    try {
      const [{ signOut }, { auth }] = await Promise.all([
        import('firebase/auth'),
        import('./firebase.config'),
      ]);
      await signOut(auth);
      this.message.set('You have been signed out.');
    } catch {
      this.message.set('Unable to sign out. Please try again.');
    }
  }

  protected toggleTheme(): void {
    const dark = !this.isDark();
    this.isDark.set(dark);
    this.syncThemeClass(dark);

    try {
      this.document.defaultView?.localStorage.setItem(
        'articulate-theme',
        dark ? 'dark' : 'light',
      );
    } catch {
      // The selected theme still applies for this page view.
    }
  }

  private syncThemeClass(dark = this.isDark()): void {
    this.document.documentElement.classList.toggle('app-dark', dark);
  }
}
