import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateSocialAndSEOMutation } from "../../api/ProfessionalApi";
import {
  type Professional,
  updateSocialAndSEOSchema,
  type UpdateSocialAndSEO,
} from "../../schema-types/professional-schema";

interface SocialAndSEOTabProps {
  professional: Professional;
}

export default function SocialAndSEOTab({
  professional,
}: SocialAndSEOTabProps) {
  const [updateSocialAndSEO, { isLoading }] = useUpdateSocialAndSEOMutation();

  const form = useForm<UpdateSocialAndSEO>({
    resolver: zodResolver(updateSocialAndSEOSchema),
    defaultValues: {
      id: professional.id,
      officeWebsite: professional.officeWebsite,
      linkedInProfile: professional.linkedInProfile,
      twitterProfile: professional.twitterProfile,
      facebookProfile: professional.facebookProfile,
      instagramProfile: professional.instagramProfile
    },
  });


  const handleSubmit = async (data: UpdateSocialAndSEO) => {
    if (!professional.id) {
      toast.error("Invalid professional ID");
      return;
    }

    try {
      await updateSocialAndSEO({
        id: professional.id,
        officeWebsite: data.officeWebsite,
        linkedInProfile: data.linkedInProfile,
        twitterProfile: data.twitterProfile,
        facebookProfile: data.facebookProfile,
        instagramProfile: data.instagramProfile,
      }).unwrap();

      toast.success("Social & SEO information updated successfully!");
    } catch (error: any) {
      console.error("Error updating social & SEO:", error);
      toast.error(
        error?.data?.message ||
        "Failed to update social & SEO. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Profiles</CardTitle>
          <CardDescription>
            Add your social media profiles and website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="officeWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedInProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitterProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://twitter.com/username"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebookProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://facebook.com/username"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagramProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://instagram.com/username"
                        type="url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
