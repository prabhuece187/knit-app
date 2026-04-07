import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetProfessionalByIdQuery } from "./api/ProfessionalApi";

import BasicInfoTab from "./component/edit/BasicInfoTab";
import SocialAndSEOTab from "./component/edit/SocialAndSEOTab";
import CommonHeader from "@/components/common/CommonHeader";
import { CommonDrawer } from "@/components/common/CommonDrawer";
import Profile from "./Profile";
import { useAppSelector } from "@/store/Store";


export default function EditProfessional({ ProfessionalId, hideHeader }: { ProfessionalId?: number, hideHeader?: boolean }) {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const authUserId = useAppSelector((state) => state.auth.user?.id)

  const [activeTab, setActiveTab] = useState("basic");
  const [profileOpen, setProfileOpen] = useState(false);

  const professionalId = ProfessionalId ? ProfessionalId : id ? parseInt(id, 10) : 0;


  const {
    data: professional,
    isLoading: isLoadingProfessional,
    isError,
  } = useGetProfessionalByIdQuery(professionalId, {
    skip: !professionalId || isNaN(professionalId),
  });

  if (!professionalId || isNaN(professionalId)) {
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
    <>
      {/* <Button variant="ghost" onClick={() => navigate("/profile")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Profile
      </Button> */}

      <Button variant="outline" size="sm" onClick={() => setProfileOpen(true)}>
        View Profile
      </Button>
    </>

  );

  return (
    <>
      {hideHeader ? <CommonHeader name="Edit Profile" /> : <CommonHeader name="Edit Profile" trigger={triggerButton()} />}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="social">Social & SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 pt-3">
          <BasicInfoTab professional={professional} />
        </TabsContent>



        <TabsContent value="social" className="space-y-6 pt-3">
          <SocialAndSEOTab professional={professional} />
        </TabsContent>
      </Tabs>

      {authUserId && profileOpen && (
        <CommonDrawer
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          side="right"
          size="lg"
        >
          <Profile userId={authUserId} />
        </CommonDrawer>
      )}
    </>
  );
}
