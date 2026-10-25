"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor } from "lucide-react";
export default function AppearanceControls() {
  const {theme,setTheme}=useTheme();
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  return <label className="appearance-control"><Monitor size={15} aria-hidden="true"/><span className="sr-only">Appearance</span><select aria-label="Appearance" value={mounted?theme:"system"} onChange={e=>setTheme(e.target.value)}><option value="system">System</option><option value="dark">Dark</option><option value="light">Light</option></select></label>;
}
