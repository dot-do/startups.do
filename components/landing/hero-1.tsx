import { LuArrowRight, LuCirclePlay } from "react-icons/lu";

import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      text: "Watch Demo",
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
    text: heading?.text || "The Best Developer Friendly",
    highlightedText: heading?.highlightedText || "Framework",
  };

  const buttonConfig = {
    primary: {
      text: buttons?.primary?.text || "Get Started",
      href: buttons?.primary?.href || "#",
    },
    secondary: {
      text: buttons?.secondary?.text || "Watch Demo",
      href: buttons?.secondary?.href || "#",
    },
  };

  return (
    <section 
      className={`dark font-public_sans relative bg-background py-12 before:absolute before:top-0 before:left-0 before:z-10 before:block before:h-[15rem] before:w-full before:bg-linear-to-b before:from-muted before:to-transparent before:content-[''] md:py-32 ${className}`}
    >
      <div className="relative z-20 container">
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
                <LuCirclePlay className="size-4! stroke-white" />
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
