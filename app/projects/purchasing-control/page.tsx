import type { Metadata } from "next";
import Purchasing from "./workspace";
const title = "Purchasing Control | Yassir Lamouddan";
const description = "An interactive purchasing workflow with three-way invoice matching, exception review, approval gates, and an activity log.";
export const metadata: Metadata = { title, description, openGraph: { title, description, url: "https://ylamouddan.com/projects/purchasing-control", images: [] }, twitter: { card: "summary", title, description, images: [] } };
export default function Page() { return <Purchasing />; }
