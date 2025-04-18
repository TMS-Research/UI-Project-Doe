import { Button } from "./ui/button";

interface PromotionalCTAProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function PromotionalCTA({
  title = "Your First Month is on Us!",
  subtitle = "Get the most out of your teaching with Plus.",
  buttonText = "Claim Your Free Month",
  onButtonClick,
}: PromotionalCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-pink-600 opacity-90" />

      {/* Content */}
      <div className="relative px-8 py-12 sm:px-12 sm:py-16">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
          <p className="text-lg text-gray-100">{subtitle}</p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-2 bg-background text-gray-900 hover:bg-gray-100"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
