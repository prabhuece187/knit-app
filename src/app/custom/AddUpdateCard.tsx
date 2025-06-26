import { Card, CardContent, CardHeader } from "../components/ui/card";
import AddUpdateHeader from "./AddUpdateHeader";

import React from "react";

interface AddUpdateCardProps {
  name: string;
  children: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
}

 function AddUpdateCard({ name, children, onSave, onCancel  }: AddUpdateCardProps){
   return (
        <>
            <Card className="@container/card">
                <CardHeader>
                    <AddUpdateHeader 
                    name={name} 
                    onSave={onSave} 
                    onCancel={onCancel}
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