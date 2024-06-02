// withAuthProtection.tsx
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import Router from "next/router";

const withAuthProtection = (WrappedComponent: React.FC) => {
  const ProtectedComponent: React.FC = (props) => {
    return <WrappedComponent {...props} />;
  };

  ProtectedComponent.getInitialProps = async (
    ctx: GetServerSidePropsContext,
  ) => {
    const cookies = parseCookies(ctx);
    const token = cookies.token;

    if (!token) {
      if (ctx.res) {
        // Server-side redirection
        ctx.res.writeHead(302, { Location: "/login" });
        ctx.res.end();
      } else {
        // Client-side redirection
        Router.push("/login");
      }
    }

    let pageProps = {};
    if (WrappedComponent.getInitialProps) {
      pageProps = await WrappedComponent.getInitialProps(ctx);
    }

    return { ...pageProps };
  };

  return ProtectedComponent;
};

export default withAuthProtection;
