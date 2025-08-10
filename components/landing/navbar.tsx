"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { Menu } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url?: string;
    title?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "#",
    title: "",
  },
  menu = [
    { title: "Features", url: "#features" },
    { title: "Pricing", url: "#pricing" },
    { title: "Contact us", url: "#contact" },
  ],
  auth = {
    login: { title: "Login", url: "#" },
    signup: { title: "Sign up", url: "#" },
  },
}: NavbarProps) => {
  const [startupName, setStartupName] = React.useState(
    logo.title || "Startups.do",
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const seg = window.location.pathname.split("/").filter(Boolean)[0];
      if (seg) {
        try {
          setStartupName(decodeURIComponent(seg));
        } catch {
          setStartupName(seg);
        }
      } else if (logo.title) {
        setStartupName(logo.title);
      }
    }
  }, [logo.title]);
  return (
    <section className="py-4 relative z-50 max-w-7xl mx-auto">
      <div className="container relative">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          {/* Logo */}
          <a href={logo.url ?? "#"} className="group group/item flex items-center gap-2">
            <div
              className='
                uppercase font-normal tracking-[0.2em] text-[1.1em]

                group-[:nth-child(3n+2)]/item:normal-case
                group-[:nth-child(3n+2)]/item:font-thin
                group-[:nth-child(3n+2)]/item:tracking-[0]
                group-[:nth-child(3n+2)]/item:text-[1.9em]

                group-[:nth-child(7n+3)]/item:normal-case
                group-[:nth-child(7n+3)]/item:font-bold
                group-[:nth-child(7n+3)]/item:tracking-[-0.05em]
                group-[:nth-child(7n+3)]/item:text-[1.7em]

                group-[:nth-child(4n+1)]/item:font-mono
                group-[:nth-child(4n+1)]/item:uppercase
                group-[:nth-child(4n+1)]/item:tracking-[0.3em]
                group-[:nth-child(4n+1)]/item:text-[1.15em]

                group-[:nth-child(6n+4)]/item:normal-case
                group-[:nth-child(6n+4)]/item:italic
                group-[:nth-child(6n+4)]/item:underline-offset-4
                group-[:nth-child(6n+4)]/item:tracking-[0.05em]
                group-[:nth-child(6n+4)]/item:text-[1.4em]

                group-[:nth-child(9n)]/item:bg-gradient-to-r
                group-[:nth-child(9n)]/item:from-primary
                group-[:nth-child(9n)]/item:to-primary/40
                group-[:nth-child(9n)]/item:text-transparent
                group-[:nth-child(9n)]/item:bg-clip-text
                group-[:nth-child(9n)]/item:font-extrabold
                group-[:nth-child(9n)]/item:tracking-tight
                group-[:nth-child(9n)]/item:text-[1.6em]
              '
            >
              {startupName}
            </div>
          </a>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <NavigationMenuWithoutViewport>
                <NavigationMenuList className="relative">
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenuWithoutViewport>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={auth.login.url}>{auth.login.title}</a>
            </Button>
            <Button asChild size="sm">
              <a href={auth.signup.url}>{auth.signup.title}</a>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url ?? "#"} className="group group/item flex items-center gap-2">
              <div
                className='
                  uppercase font-normal tracking-[0.2em] text-[1.1em]

                  group-[:nth-child(3n+2)]/item:normal-case
                  group-[:nth-child(3n+2)]/item:font-thin
                  group-[:nth-child(3n+2)]/item:tracking-[0]
                  group-[:nth-child(3n+2)]/item:text-[1.9em]

                  group-[:nth-child(7n+3)]/item:normal-case
                  group-[:nth-child(7n+3)]/item:font-bold
                  group-[:nth-child(7n+3)]/item:tracking-[-0.05em]
                  group-[:nth-child(7n+3)]/item:text-[1.7em]

                  group-[:nth-child(4n+1)]/item:font-mono
                  group-[:nth-child(4n+1)]/item:uppercase
                  group-[:nth-child(4n+1)]/item:tracking-[0.3em]
                  group-[:nth-child(4n+1)]/item:text-[1.15em]

                  group-[:nth-child(6n+4)]/item:normal-case
                  group-[:nth-child(6n+4)]/item:italic
                  group-[:nth-child(6n+4)]/item:underline-offset-4
                  group-[:nth-child(6n+4)]/item:tracking-[0.05em]
                  group-[:nth-child(6n+4)]/item:text-[1.4em]

                  group-[:nth-child(9n)]/item:bg-gradient-to-r
                  group-[:nth-child(9n)]/item:from-primary
                  group-[:nth-child(9n)]/item:to-primary/40
                  group-[:nth-child(9n)]/item:text-transparent
                  group-[:nth-child(9n)]/item:bg-clip-text
                  group-[:nth-child(9n)]/item:font-extrabold
                  group-[:nth-child(9n)]/item:tracking-tight
                  group-[:nth-child(9n)]/item:text-[1.6em]
                '
              >
                {startupName}
              </div>
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-3" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url ?? "#"} className="group group/item flex items-center gap-2">
                      <div
                        className='
                          uppercase font-normal tracking-[0.2em] text-[1.1em]

                          group-[:nth-child(3n+2)]/item:normal-case
                          group-[:nth-child(3n+2)]/item:font-thin
                          group-[:nth-child(3n+2)]/item:tracking-[0]
                          group-[:nth-child(3n+2)]/item:text-[1.9em]

                          group-[:nth-child(7n+3)]/item:normal-case
                          group-[:nth-child(7n+3)]/item:font-bold
                          group-[:nth-child(7n+3)]/item:tracking-[-0.05em]
                          group-[:nth-child(7n+3)]/item:text-[1.7em]

                          group-[:nth-child(4n+1)]/item:font-mono
                          group-[:nth-child(4n+1)]/item:uppercase
                          group-[:nth-child(4n+1)]/item:tracking-[0.3em]
                          group-[:nth-child(4n+1)]/item:text-[1.15em]

                          group-[:nth-child(6n+4)]/item:normal-case
                          group-[:nth-child(6n+4)]/item:italic
                          group-[:nth-child(6n+4)]/item:underline-offset-4
                          group-[:nth-child(6n+4)]/item:tracking-[0.05em]
                          group-[:nth-child(6n+4)]/item:text-[1.4em]

                          group-[:nth-child(9n)]/item:bg-gradient-to-r
                          group-[:nth-child(9n)]/item:from-primary
                          group-[:nth-child(9n)]/item:to-primary/40
                          group-[:nth-child(9n)]/item:text-transparent
                          group-[:nth-child(9n)]/item:bg-clip-text
                          group-[:nth-child(9n)]/item:font-extrabold
                          group-[:nth-child(9n)]/item:tracking-tight
                          group-[:nth-child(9n)]/item:text-[1.6em]
                        '
                      >
                        {startupName}
                      </div>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <a href={auth.login.url}>{auth.login.title}</a>
                    </Button>
                    <Button asChild>
                      <a href={auth.signup.url}>{auth.signup.title}</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="origin-top-center relative top-11 w-full overflow-hidden rounded-md border shadow backdrop-blur-sm data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 md:absolute md:left-0 md:w-80 z-[100]">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-full">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-muted-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

const NavigationMenuWithoutViewport = ({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean;
}) => {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center z-[99]",
        className,
      )}
      {...props}
    >
      {children}
      {/* The Viewport needs to be removed to center align submenus under their parents. You could remove this from the shadcn/ui component */}
      {/* {viewport && <NavigationMenuViewport />} */}
    </NavigationMenuPrimitive.Root>
  );
};

export { Navbar };
