import { LuCheck } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PricingProps {
  title?: string;
  description?: string;
  cardTitle?: string;
  priceValue?: string;
  pricePeriod?: string;
  currency?: string;
  billing?: string;
  trialText?: string;
  buttonText?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  featuresTitle?: string;
  features?: string[];
  className?: string;
  onButtonClick?: () => void;
}

const defaultFeatures = [
  "Automated backups",
  "24/7 support",
  "Unlimited projects",
  "Unlimited users",
  "Custom domain",
  "Custom branding",
  "Advanced analytics",
  "Custom permissions",
  "Advanced reports",
];

const Pricing = ({
  // title = "Simple Pricing",
  // description = "Flexible pricing to match any budget or team size.",
  // cardTitle = "Starting at",
  priceValue = "16",
  pricePeriod = "/mo",
  // currency = "$",
  // billing = "",
  trialText = "With a 7-day free trial",
  buttonText = "TRY FOR FREE",
  buttonVariant = "default",
  featuresTitle = "What's included in the plan",
  features = defaultFeatures,
  className = "",
  onButtonClick,
}: PricingProps) => {
  return (
    <section className={`py-32 ${className}`}>
      <div className="container">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="mb-2 text-3xl font-medium lg:text-5xl">Simple Pricing</h2>
          <p className="max-w-lg text-muted-foreground">
          Flexible pricing to match any budget or team size.
          </p>
        </div>
        <div className="mt-10">
          <Card className="mx-auto flex w-full max-w-sm flex-col justify-between gap-10 rounded-md p-6 text-center">
            <p className="text-xl">Starting at</p>
            <div>
              <div className="flex justify-center">
                <span className="text-2xl">$</span>
                <span className="text-4xl font-base font-mono tracking-tighter">
                  {priceValue}
                </span>
                <span className="text-lg ml-1 self-end">{pricePeriod}</span>
                {/* {billing && <span className="text-sm text-muted-foreground ml-1 self-end">{billing}</span>} */}
              </div>
              {trialText && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {trialText}
                </p>
              )}
            </div>
            <Button 
              className="w-full" 
              size="lg"
              variant={buttonVariant}
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          </Card>
          <p className="mt-8 text-center text-md sm:text-lg font-medium lg:mt-10">
            {featuresTitle}
          </p>
          <ul className="mx-auto mt-4 grid w-fit md:w-auto md:max-w-2xl md:grid-cols-2 md:pl-14 lg:max-w-4xl lg:grid-cols-3">
            {features.map((feature, index) => (
              <li
                key={index}
                className="mt-4 flex items-center gap-2 text-sm font-medium"
              >
                <LuCheck className="size-4" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export { Pricing };
export type { PricingProps };
