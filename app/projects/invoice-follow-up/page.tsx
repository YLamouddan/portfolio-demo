import type { Metadata } from "next";
import InvoicePlanner from "./planner";

const title = "Invoice Follow-up Planner | Yassir Lamouddan";
const description = "Try a working invoice workflow demo: validate unpaid invoice CSV data, prioritise overdue payments, and export follow-up drafts.";
export const metadata: Metadata = { title, description, openGraph: { title, description, url: "https://ylamouddan.com/projects/invoice-follow-up", images: [] }, twitter: { card: "summary", title, description, images: [] } };
export default function Page() { return <InvoicePlanner />; }
