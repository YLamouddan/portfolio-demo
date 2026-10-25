"use client";
import {useEffect,useState} from "react";
import {useTheme} from "next-themes";
import {MaterialSun,MaterialMoon} from "./material-theme-icons";
export default function AppearanceControls(){
 const {resolvedTheme,setTheme}=useTheme();const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);const dark=mounted?resolvedTheme!=="light":true;
 return <button type="button" role="switch" aria-label="Dark mode" aria-checked={dark} className="theme-switch appearance-control" disabled={!mounted} onClick={()=>setTheme(dark?"light":"dark")} title={dark?"Switch to light mode":"Switch to dark mode"}><span className="theme-switch-track"><span className="theme-switch-thumb"/><MaterialSun className="theme-sun"/><MaterialMoon className="theme-moon"/></span></button>;
}
