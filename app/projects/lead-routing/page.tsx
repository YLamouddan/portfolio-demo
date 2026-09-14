import type { Metadata } from "next";
import LeadRouter from "./router";

const title = "Lead Intake & Routing | Yassir Lamouddan";
const description = "Try a working business enquiry workflow: qualify a lead, choose the responsible team, draft a reply, and export a CRM-ready CSV.";
export const metadata: Metadata = { title, description, openGraph: { title, description, url: "https://ylamouddan.com/projects/lead-routing", images: [] }, twitter: { card: "summary", title, description, images: [] } };
export default function Page() { return <LeadRouter />; }
