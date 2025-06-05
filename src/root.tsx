import { Outlet, Scripts, Links, Meta, ScrollRestoration } from "react-router";
import CssBaseline from "@mui/material/CssBaseline";
import { store } from "./store/store";
import { Provider } from "react-redux";
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <CssBaseline />
        <Provider store={store}>{children}</Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
