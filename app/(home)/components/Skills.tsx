"use client";
import React from "react";
import Title from "./Title";
import { HoverEffect } from "../../../components/ui/card-hover-effect";
import {
  FileIconsMatlab,
  SimpleIconsAutocad,
} from "../../../components/ui/icons";
import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiMongodb,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiGit,
  SiGithub,
  SiPython,
  SiArduino,
  SiSupabase,
} from "react-icons/si";

export default function Skills() {
  const skills = [
    {
      title: "React",
      text: "React",
      icon: SiReact,
    },
    {
      title: "NextJS",
      text: "NextJS",
      icon: SiNextdotjs,
    },
    {
      title: "TailwindCSS",
      text: "TailwindCSS",
      icon: SiTailwindcss,
    },
    {
      title: "Supabase",
      text: "Supabase",
      icon: SiSupabase,
    },
    {
      title: "TypeScript",
      text: "TypeScript",
      icon: SiTypescript,
    },
    {
      title: "HTML",
      text: "HTML",
      icon: SiHtml5,
    },
    {
      title: "CSS",
      text: "CSS",
      icon: SiCss3,
    },
    {
      title: "JavaScript",
      text: "JavaScript",
      icon: SiJavascript,
    },
    {
      title: "Git",
      text: "Git",
      icon: SiGit,
    },
    {
      title: "MongoDB",
      text: "MongoDB",
      icon: SiMongodb,
    },
    {
      title: "GitHub",
      text: "GitHub",
      icon: SiGithub,
    },
    {
      title: "Python",
      text: "Python",
      icon: SiPython,
    },
    {
      title: "Arduino",
      text: "Arduino",
      icon: SiArduino,
    },
    {
      title: "Matlab",
      text: "Matlab",
      icon: FileIconsMatlab,
    },
    {
      title: "AutoCAD",
      text: "AutoCAD",
      icon: SimpleIconsAutocad,
    },
  ];
  return (
    <div className="max-w-5xl mx-auto px-8">
      <Title
        text="Skills 🔪"
        className="flex flex-col items-center justify-center transform -rotate-6"
      />
      <HoverEffect items={skills} />
    </div>
  );
}
