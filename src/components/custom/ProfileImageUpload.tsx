import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, User } from "lucide-react";

interface ProfileImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export default function ProfileImageUpload({
  value,
  onChange,
  error,
  className,
}: ProfileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>Profile Image (Optional)</Label>

      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                  onClick={handleRemoveImage}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {preview
                  ? "Click to change image"
                  : "Upload your profile picture"}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleUploadClick}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>{preview ? "Change Image" : "Choose File"}</span>
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <p className="text-xs text-muted-foreground text-center">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
