// components/Banner.tsx
import { Button } from "@/components/ui/button.tsx";

export const Banner = () => (
  <div className="bg-emerald-900 text-white rounded-md p-6 relative mb-6">
    <h2 className="text-lg font-semibold">Win work with a targeted boost</h2>
    <p className="text-sm mt-1">
      Boosting your profile increases your chance of getting hired by up to 2x.
    </p>
    <Button className="mt-3 bg-white text-emerald-900 hover:bg-gray-100">
      Boost now
    </Button>
  </div>
);
