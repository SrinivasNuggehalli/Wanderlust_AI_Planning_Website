import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateTrip from '@/components/CreateTrip'; // Adjust import based on your structure
import { chatSession } from "@/service/AIModel";
import { setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

jest.mock('firebase/firestore', () => ({
  setDoc: jest.fn(),
}));

jest.mock('@/service/AIModel', () => ({
  chatSession: {
    sendMessage: jest.fn(),
  },
}));

jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('CreateTrip Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form with necessary fields', () => {
    render(<CreateTrip />);
    
    // Check that all required fields and elements are rendered
    expect(screen.getByText('What is your destination of choice?')).toBeInTheDocument();
    expect(screen.getByText('How many days are you planning your trip?')).toBeInTheDocument();
    expect(screen.getByText('Preferred Mode of Transportation')).toBeInTheDocument();
    expect(screen.getByText('What is Your Budget?')).toBeInTheDocument();
    expect(screen.getByText('Who do you plan on traveling with on your next adventure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Trip/i })).toBeInTheDocument();
  });

  test('handles input changes and updates state', () => {
    render(<CreateTrip />);
    
    const daysInput = screen.getByPlaceholderText('Ex.3');
    fireEvent.change(daysInput, { target: { value: '5' } });

    expect(daysInput.value).toBe('5'); // Test that state update works

    const budgetOption = screen.getByText('Budget'); // Assume one of the budget options is named "Budget"
    fireEvent.click(budgetOption);
    
    expect(budgetOption).toHaveClass('shadow-lg border-black');
  });

  test('validates the form and shows toast on missing fields', async () => {
    render(<CreateTrip />);
    
    const generateButton = screen.getByRole('button', { name: /Generate Trip/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Please fill all details');
    });
  });

  test('calls AI model and saves trip on valid input', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    
    chatSession.sendMessage.mockResolvedValue({ response: { text: jest.fn().mockReturnValue('{"trip":"data"}') } });
    
    render(<CreateTrip />);

    // Mock inputs to simulate a valid form submission
    fireEvent.change(screen.getByPlaceholderText('Ex.3'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Budget')); // Click a budget option
    fireEvent.click(screen.getByText('Flight')); // Click a transport option

    const generateButton = screen.getByRole('button', { name: /Generate Trip/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(chatSession.sendMessage).toHaveBeenCalled();
      expect(setDoc).toHaveBeenCalled();
      expect(toast).toHaveBeenCalledWith('Trip saved successfully.');
      expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining('/view-trip/'));
    });
  });

  test('handles Google login and proceeds to generate trip', async () => {
    const mockLogin = jest.fn();
    useGoogleLogin.mockReturnValue({ onSuccess: mockLogin });
    
    render(<CreateTrip />);
    
    fireEvent.click(screen.getByText('Sign In With Google'));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  test('displays loading spinner during API call', async () => {
    render(<CreateTrip />);
    
    chatSession.sendMessage.mockResolvedValue({ response: { text: jest.fn().mockReturnValue('{"trip":"data"}') } });

    fireEvent.change(screen.getByPlaceholderText('Ex.3'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Flight')); // Select a transport option
    fireEvent.click(screen.getByText('Budget')); // Select a budget option

    const generateButton = screen.getByRole('button', { name: /Generate Trip/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByRole('button')).toContainHTML('animate-spin'); // Checks for loading spinner
    });

    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toContainHTML('animate-spin'); // No spinner after loading
    });
  });

  test('handles errors during AI trip generation', async () => {
    chatSession.sendMessage.mockRejectedValue(new Error('AI Error'));

    render(<CreateTrip />);

    fireEvent.change(screen.getByPlaceholderText('Ex.3'), { target: { value: '5' } });
    fireEvent.click(screen.getByText('Flight'));
    fireEvent.click(screen.getByText('Budget'));

    const generateButton = screen.getByRole('button', { name: /Generate Trip/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith('Failed to generate the trip.');
    });
  });
});
