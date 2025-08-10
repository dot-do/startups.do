'use client'
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { LuArrowRight } from "react-icons/lu";

import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DynamicDotGrid = dynamic(() => import("@/components/blocks/Backgrounds/DotGrid/DotGrid"), { ssr: false });
const DynamicLightRays = dynamic(() => import("@/components/blocks/Backgrounds/LightRays/LightRays"), { ssr: false });
const DynamicDarkVeil = dynamic(() => import("@/components/blocks/Backgrounds/DarkVeil/DarkVeil"), { ssr: false });
const DynamicDither = dynamic(() => import("@/components/blocks/Backgrounds/Dither/Dither"), { ssr: false });

interface Hero1Props {
  badge?: {
    text?: string;
    href?: string;
    show?: boolean;
  };
  heading?: {
    text?: string;
    highlightedText?: string;
  };
  description?: string;
  buttons?: {
    primary?: {
      text?: string;
      href?: string;
    };
    secondary?: {
      text?: string;
      href?: string;
    };
  };
  className?: string;
}

const Hero1: React.FC<Hero1Props> = ({
  badge = {
    text: "Check out our new features",
    href: "#",
    show: true,
  },
  heading = {
    text: "The Best Developer Friendly",
    highlightedText: "Framework",
  },
  description = "This is an open-source framework that simplifies web development while packing a punch. Build high-performance, production-ready full-stack web apps and websites with ease and confidence.",
  buttons = {
    primary: {
      text: "Get Started",
      href: "#",
    },
    secondary: {
      text: "Learn more",
      href: "#",
    },
  },
  className = "",
}) => {
  // Ensure nested object properties have defaults
  const badgeConfig = {
    text: badge?.text || "Check out our new features",
    href: badge?.href || "#",
    show: badge?.show !== false,
  };

  const headingConfig = {
    text: heading?.text || "Build Autonomous Businesses",
    highlightedText: heading?.highlightedText || "Framework",
  };

  const buttonConfig = {
    primary: {
      text: buttons?.primary?.text || "Get Started",
      href: buttons?.primary?.href || "#",
    },
    secondary: {
      text: buttons?.secondary?.text || "Learn more",
      href: buttons?.secondary?.href || "#",
    },
  };

  // Random background selection
  const backgroundOptions = useMemo(
    () => [
      <DynamicDotGrid key="dotgrid" />,
      <DynamicLightRays key="lightrays" />,
      <DynamicDarkVeil key="darkveil" />,
      <DynamicDither key="dither" enableMouseInteraction={false} />,
    ],
    []
  );
  const [bgIndex, setBgIndex] = useState<number | null>(null);
  useEffect(() => {
    setBgIndex(Math.floor(Math.random() * backgroundOptions.length));
    // backgroundOptions is stable due to empty deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section 
      className={`dark font-public_sans relative bg-background min-h-screen lg:min-h-[900px] xl:min-h-[960px] flex items-center -mt-20 py-12 before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-[15rem] before:w-full before:bg-linear-to-b before:from-muted before:to-transparent before:content-[''] md:py-32 ${className}`}
    >
      {/* Randomized background from components/blocks with 70% opacity */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        {bgIndex !== null ? backgroundOptions[bgIndex] : null}
      </div>
      <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative z-20 mx-auto flex max-w-[56.25rem] flex-col items-center gap-6">
          {badgeConfig.show && (
            <a
              href={badgeConfig.href}
              className={`${badgeVariants({ variant: "outline" })} border-muted2 mb-4 flex w-fit items-center gap-1 rounded-full border bg-muted px-2.5 py-1.5 hover:border-primary/20`}
            >
              <p className="text-sm font-medium text-primary">
                {badgeConfig.text}
              </p>
              <LuArrowRight className="h-4 w-4 stroke-primary" />
            </a>
          )}
          <h1 className="w-full text-center text-5xl font-semibold text-foreground md:text-6xl">
            {headingConfig.text}{" "}
            {headingConfig.highlightedText && (
              <span className="text-primary">{headingConfig.highlightedText}</span>
            )}
          </h1>
          <p className="text-center text-lg text-muted-foreground">
            {description}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button
              asChild
              className="flex h-fit items-center gap-2 rounded-md px-3.5 py-2.5 text-sm font-medium"
            >
              <a href={buttonConfig.primary.href}>
                <div>{buttonConfig.primary.text}</div>
                <LuArrowRight className="size-5!" />
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="flex h-fit items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium text-white"
            >
              <a href={buttonConfig.secondary.href}>
                <div>{buttonConfig.secondary.text}</div>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero1 };
export type { Hero1Props };
