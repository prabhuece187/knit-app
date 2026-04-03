import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProfessionalByIdQuery } from "./api/ProfessionalApi";

import BasicInfoTab from "./component/edit/BasicInfoTab";
import SocialAndSEOTab from "./component/edit/SocialAndSEOTab";
import CommonHeader from "@/components/common/CommonHeader";
import LocationTab from "./component/edit/LocationTab";

export default function EditProfessional() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const professionalId = id ? parseInt(id, 10) : 0;

  const {
    data: professional,
    isLoading: isLoadingProfessional,
    isError,
  } = useGetProfessionalByIdQuery(professionalId, {
    skip: !professionalId || isNaN(professionalId),
  });

  if (!id || isNaN(professionalId)) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Professional ID</h1>
          <p className="text-muted-foreground mb-4">
            The professional ID provided is invalid.
          </p>
          <Button onClick={() => navigate("/professionals")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Professionals
          </Button>
        </div>
      </div>
    );
  }

  if (isLoadingProfessional) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <p className="text-muted-foreground">Loading professional data...</p>
        </div>
      </div>
    );
  }

  if (isError || !professional) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Professional Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The professional you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={() => navigate("/professionals")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Professionals
          </Button>
        </div>
      </div>
    );
  }

  const triggerButton = () => (
    <Button variant="ghost" onClick={() => navigate("/professionals")}>
      <ArrowLeft className="h-4 w-4 mr-2" />
      Back to Professionals
    </Button>
  );

  return (
    <>
      <CommonHeader name="Edit Profile" trigger={triggerButton()} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          {/* <TabsTrigger value="location">Location</TabsTrigger> */}
          <TabsTrigger value="social">Social & SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 pt-3">
          <BasicInfoTab professional={professional} />
          {/* <ProfessionalDetailsForm
            form={form}
            isReviewMode={isReviewMode}
            selectOptionFallbacks={selectOptionFallbacks}
          /> */}
        </TabsContent>

        <TabsContent value="location" className="space-y-6 pt-3">
          <LocationTab professional={professional} />
        </TabsContent>

        <TabsContent value="social" className="space-y-6 pt-3">
          <SocialAndSEOTab professional={professional} />
        </TabsContent>
      </Tabs>
    </>
  );
}
