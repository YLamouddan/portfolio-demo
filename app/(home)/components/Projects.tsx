import React from "react";
import Title from "./Title";
import { cn } from "@/lib/utils";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import Link from "next/link";
import { SiReact, SiNextdotjs, SiTailwindcss } from "react-icons/si";

export default function Projects() {
  const projects = [
    {
      title: "Portfolio Website",
      tech: [SiReact, SiNextdotjs, SiTailwindcss],
      link: "https://ylamouddan.com/",
      cover: "/Portfolio.png",
      background: "bg-indigo-500",
    },
    // {
    //   title: "Portfolio Website",
    //   tech: [SiReact, SiNextdotjs, SiTailwindcss],
    //   link: "https://ylamouddan.com/",
    //   cover: "/Portfolio.png",
    //   background: "bg-indigo-500",
    // },
  ];

  return (
    <>
      <div className=" py-10 p-5 sm:p-0"></div>
      <Title
        text="Projects 🎨"
        className="flex flex-col items-center justify-center transform rotate-6"
      />
      <div className=" grid grid-cols-1 sm:grid-cols-2 pt-20 gap-5">
        {projects.map((project, index) => {
          return (
            <Link href={project.link} key={index}>
              <div className={cn("p-5 rounded-md", project.background)}>
                <DirectionAwareHover
                  imageUrl={project.cover}
                  className=" w-full space-y-5 cursor-pointer"
                >
                  <div className="space-y-5">
                    <h1 className="text-2xl font-bold">{project.title}</h1>

                    <div className=" flex items-center gap-5">
                      {project.tech.map((Icon, index) => {
                        return <Icon className="w-8 h-8" key={index} />;
                      })}
                    </div>
                  </div>
                </DirectionAwareHover>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
