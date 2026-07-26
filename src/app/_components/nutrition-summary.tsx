import { roundNutrition, type Nutrition } from "@/lib/meal-plan";

interface NutritionSummaryProps {
  nutrition: Nutrition;
  label: string;
  target?: Nutrition;
}

export function NutritionSummary({
  nutrition,
  label,
  target,
}: NutritionSummaryProps) {
  const values = roundNutrition(nutrition);

  return (
    <div className="nutrition-summary" aria-label={label}>
      <p>{label}</p>
      <dl>
        <div>
          <dt>Energi</dt>
          <dd>
            {values.calories}
            {target ? ` / ${target.calories}` : ""} <span>kcal</span>
          </dd>
        </div>
        <div>
          <dt>Protein</dt>
          <dd>
            {values.protein}
            {target ? ` / ${target.protein}` : ""} <span>g</span>
          </dd>
        </div>
        <div>
          <dt>Fett</dt>
          <dd>
            {values.fat}
            {target ? ` / ${target.fat}` : ""} <span>g</span>
          </dd>
        </div>
        <div>
          <dt>Karbohydrat</dt>
          <dd>
            {values.carbs}
            {target ? ` / ${target.carbs}` : ""} <span>g</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
