import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider, type AuthResponse } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const providers = [{ id: 'credentials', name: 'Email and password' }];

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const signIn = async (_provider: AuthProvider, formData?: FormData): Promise<AuthResponse> => {
    try {
      const email = formData?.get('email')?.toString();
      const password = formData?.get('password')?.toString();

      // Replace this with your actual authentication logic
      if (email === 'admin@advaitias.co.in' && password === 'advait@123') {
        // Store authentication token or status (example using localStorage)
        localStorage.setItem('authToken', 'dummy-auth-token');
        
        // Redirect to home page after successful login
        navigate('/');
        
        return { type: 'success' };
      } else {
        return {
          type: 'CredentialsSignin',
          error: 'Invalid email or password',
        };
      }
    } catch (error) {
      return {
        type: 'error',
        error: 'An error occurred during sign in',
      };
    }
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{
          emailField: { autoFocus: true },
          form: { noValidate: true }
        }}
      />
    </AppProvider>
  );
};

export default Login;