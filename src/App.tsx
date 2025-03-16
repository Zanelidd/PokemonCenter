import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Router from './router/Router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Login from './components/login/Login';
import { useUser } from './stores/UserStore';

function App() {
  const { showModal } = useUser();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {showModal && <Login />}
        <Router />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
