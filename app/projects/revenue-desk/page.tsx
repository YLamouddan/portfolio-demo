import type { Metadata } from "next";
import Revenue from "./workspace";
const title = "Revenue Desk | Yassir Lamouddan";
const description = "An interactive sales operations workspace: opportunity pipeline, configurable quotes, margin checks, approval gates, and weighted forecasting.";
export const metadata: Metadata = { title, description, openGraph: { title, description, url: "https://ylamouddan.com/projects/revenue-desk", images: [] }, twitter: { card: "summary", title, description, images: [] } };
export default function Page() { return <Revenue />; }
