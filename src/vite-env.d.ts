
/// <reference types="vite/client" />

interface TurnstileObject {
  render: (
    container: HTMLElement, 
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      [key: string]: any;
    }
  ) => void;
}

interface Window {
  turnstile?: TurnstileObject;
}
