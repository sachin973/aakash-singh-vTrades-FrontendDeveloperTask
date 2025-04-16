type GoogleCredentialResponse = {
    credential: string;
    select_by: string;
    clientId?: string;
  };
  
  type PromptMomentNotification = {
    isDisplayed: () => boolean;
    isNotDisplayed: () => boolean;
    getNotDisplayedReason: () => string;
    isSkippedMoment: () => boolean;
    getSkippedReason: () => string;
    isDismissedMoment: () => boolean;
    getDismissedReason: () => string;
  };
  
  export const initializeGoogle = (
    clientId: string,
    callback: (response: GoogleCredentialResponse) => void
  ): void => {
    const existing = document.querySelector(
      "script[src='https://accounts.google.com/gsi/client']"
    );
    if (existing) return;
  
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback,
        });
      }
    };
    document.body.appendChild(script);
  };
  
  export const promptGoogleSignIn = (): void => {
    if (window.google) {
      window.google.accounts.id.prompt((notification: PromptMomentNotification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.warn("Google Sign-In not displayed or skipped.");
        }
      });
    }
  };
  
  