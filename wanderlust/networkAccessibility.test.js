import axios from 'axios';

describe('Network Accessibility', () => {
  it('should return a successful response from the server', async () => {
    const baseURL = 'http://192.168.1.190:5173/';

    try {
      const response = await axios.get(baseURL);
      expect(response.status).toBe(200); // Ensure server responds with HTTP 200
      expect(response.data).toBeDefined(); // Confirm that the server sends back data
    } catch (error) {
      console.error('Error accessing the server:', error.message);
      throw new Error('Failed to access the network URL');
    }
  });
});