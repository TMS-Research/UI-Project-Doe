import { Suspense } from "react";
import AcademicProfileForm from "./components/academic-profile-form";

export default function AcademicProfilePage() {
  return (
    <Suspense fallback={<p>Loading form...</p>}>
      <AcademicProfileForm />
    </Suspense>
  );
}
