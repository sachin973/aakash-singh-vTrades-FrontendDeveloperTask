interface Window {
    google: typeof google;
  }
  
  declare namespace google {
    namespace accounts.id {
      function initialize(config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }): void;
  
      function prompt(callback?: (notification: PromptMomentNotification) => void): void;
    }
  }
  