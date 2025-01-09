import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UpdateProfileDto, Profile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const isBrowser = typeof window !== "undefined";

const profileSchema = z.object({
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  avatar: isBrowser
    ? z
        .instanceof(FileList)
        .optional()
        .refine(
          (files) => !files || files.length === 0 || files.length === 1,
          "Please upload a single file"
        )
        .refine(
          (files) =>
            !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
          "Max file size is 5MB"
        )
        .refine(
          (files) =>
            !files ||
            files.length === 0 ||
            ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
          "Only .jpg, .jpeg, .png and .webp formats are supported"
        )
    : z.any().optional(),
});

interface ProfileFormProps {
  profile: Profile | null;
  onSubmit: (data: UpdateProfileDto) => Promise<void>;
}

export function ProfileForm({ profile, onSubmit }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile?.avatarUrl || null
  );
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: profile?.bio || "",
      phoneNumber: profile?.phoneNumber || "",
      address: profile?.address || "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof profileSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (data.bio) formData.append("bio", data.bio);
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
      if (data.address) formData.append("address", data.address);
      if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);

      await onSubmit(formData as unknown as UpdateProfileDto);
      toast({
        title: "Success",
        description: profile
          ? "Profile updated successfully"
          : "Profile created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: profile
          ? "Failed to update profile"
          : "Failed to create profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: FileList | null) => {
    if (e && e[0]) {
      const file = e[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={previewUrl || undefined} />
            <AvatarFallback>{profile?.userId?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <FormField
            control={form.control}
            name="avatar"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload avatar</span>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      onChange(e.target.files);
                      handleFileChange(e.target.files);
                    }}
                    {...field}
                    value={undefined}
                  />
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" loading={isSubmitting}>
          {profile ? "Update Profile" : "Create Profile"}
        </Button>
      </form>
    </Form>
  );
}
