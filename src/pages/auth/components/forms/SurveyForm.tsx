import { type UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { SelectPopover } from "@/components/custom/CustomPopover";
import {
  type Step2Registration,
  languageOptions,
  surveySourceOptions,
} from "../../types/registration.types";

interface SurveyFormProps {
  form: UseFormReturn<Step2Registration>;
}

export default function SurveyForm({ form }: SurveyFormProps) {
  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Selection */}
          <div className="space-y-2">
            <SelectPopover
              label="Select your language *"
              placeholder="Choose your preferred language..."
              options={languageOptions}
              valueKey="code"
              labelKey="name"
              name="language"
              control={form.control}
            />
            {form.formState.errors.language && (
              <p className="text-sm text-red-500">
                {form.formState.errors.language.message}
              </p>
            )}
          </div>

          {/* Survey Source Selection */}
          <div className="space-y-2">
            <SelectPopover
              label="How did you hear about us? (Optional)"
              placeholder="Select an option..."
              options={surveySourceOptions}
              valueKey="value"
              labelKey="name"
              name="surveySource"
              control={form.control}
            />
            {form.formState.errors.surveySource && (
              <p className="text-sm text-red-500">
                {form.formState.errors.surveySource.message}
              </p>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Registration Summary</h3>
          <p className="text-sm text-muted-foreground">
            You&apos;re almost done! Review your information and complete your
            registration.
          </p>
        </div>
      </div>
    </Form>
  );
}
