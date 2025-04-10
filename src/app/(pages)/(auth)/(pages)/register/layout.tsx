import RegistrationStepper from "./components/registration-stepper";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <RegistrationStepper />
        {children}
    </div>
  );
}
