import '../styles/globals.css'
import { FC } from "react";
import { AppPropsType } from "next/dist/next-server/lib/utils";

const MyApp: FC<AppPropsType> = ({ Component, pageProps }) =>  {
  return <Component {...pageProps} />
}

export default MyApp
