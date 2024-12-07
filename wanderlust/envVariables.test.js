describe('Environment Variables', () => {
    it('should correctly load Google Maps API Key', () => {
      expect(import.meta.env.VITE_GOOGLE_PLACE_API_KEY).toBe('TEST_PLACE_API_KEY');
    });
  
    it('should correctly load Google OAuth Client ID', () => {
      expect(import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID).toBe('TEST_AUTH_CLIENT_ID');
    });
  
    it('should correctly load Gemini AI API Key', () => {
      expect(import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY).toBe('TEST_GEMINI_API_KEY');
    });
  });