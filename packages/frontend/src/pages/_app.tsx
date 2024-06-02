import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3000/local/desafio', // Your GraphQL server URI
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }: AppProps) {
  return (
     <ApolloProvider client={client}>
    <Component {...pageProps} />
     </ApolloProvider>
    )
}
