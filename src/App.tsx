import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./App.css";
import Router from "./router/Router";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import Login from "./components/login/Login";
import {useUser} from "./stores/UserStore";
import {Toaster} from "sonner";

function App() {
    const {showModal} = useUser();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    });

    return (
        <>
            <QueryClientProvider client={queryClient}>
                {showModal && <Login/>}
                <Router/>
                <Toaster
                    theme={"system"}
                    position="top-right"
                    richColors={true}
                    toastOptions={{
                        style: {
                            fontSize: "14px",
                        },
                        duration: 5000,
                    }}
                />
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        </>
    );
}

export default App;
