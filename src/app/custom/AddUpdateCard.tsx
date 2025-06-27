import { Card, CardContent, CardHeader } from "../../components/ui/card";
import AddUpdateHeader from "./AddUpdateHeader";

import React from "react";

interface AddUpdateCardProps {
  name: string;
  children: React.ReactNode;
}

 function AddUpdateCard({ name, children  }: AddUpdateCardProps){
   return (
        <>
            <Card className="@container/card">
                <CardHeader>
                    <AddUpdateHeader 
                    name={name} 
                    />
                </CardHeader>

                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </>
   );
}

export default AddUpdateCard;