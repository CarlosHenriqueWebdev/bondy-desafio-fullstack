// withAuthRedirect.tsx
import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";

const withAuthRedirect = (WrappedComponent: React.FC) => {
  const RedirectComponent: React.FC = (props) => {
    return <WrappedComponent {...props} />;
  };

  RedirectComponent.getInitialProps = async (
    ctx: GetServerSidePropsContext,
  ) => {
    const cookies = parseCookies(ctx);
    const token = cookies.token;

    if (token) {
      // User is logged in, redirect to another page (e.g., dashboard)
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
    }

    let pageProps = {};
    if (WrappedComponent.getInitialProps) {
      pageProps = await WrappedComponent.getInitialProps(ctx);
    }

    return { ...pageProps };
  };

  return RedirectComponent;
};

export default withAuthRedirect;
