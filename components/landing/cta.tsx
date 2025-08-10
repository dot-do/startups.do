import { Button } from "@/components/ui/button";

interface CtaProps {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
}

const Cta = ({
  heading = "Ready to get started?",
  description = "Build autonomous businesses with do.industries. Speed up your development and ship real businesses in record time.",
  buttons = {
    primary: {
      text: "Get Started",
      url: "https://do.industries",
    },
    secondary: {
      text: "Contact Us",
      url: "https://do.industries",
    },
  },
}: CtaProps) => {
  return (
    <section className="pt-32">
      <div className="container">
        <div className="rounded-lg p-8 md:rounded-xl lg:py-32 bg-gradient-to-b from-muted/50 to-muted/5">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="mb-4 font-semibold text-4xl lg:mb-6 lg:text-5xl">
              {heading}
            </h3>
            <p className="text-muted-foreground mb-8 text-base">
              {description}
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              {buttons.primary && (
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Cta };
