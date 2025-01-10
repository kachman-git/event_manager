"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { userApi, profileApi, eventApi } from "@/lib/api";
import {
  User,
  Profile,
  Event,
  UpdateProfileDto,
  CreateProfileDto,
} from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/back-button";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userApi.getMe();
        setUser(userData);
        const profileData = await profileApi.getMyProfile();
        setProfile(profileData);
        const eventsData = await eventApi.getMyEvents();
        setEvents(eventsData);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleDelete = async (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await eventApi.delete(eventId);
        setEvents(events.filter((event) => event.id !== eventId));
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete event. Please try again.",
        });
      }
    }
  };

  const handleProfileUpdate = async (
    data: CreateProfileDto | UpdateProfileDto
  ) => {
    try {
      if (profile?.id) {
        const updatedProfile = await profileApi.update(profile.id, data);
        setProfile(updatedProfile);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        const newProfile = await profileApi.create(data);
        setProfile(newProfile);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile created successfully",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <BackButton />
      <Card className="max-w-2xl mx-auto mb-8">
        {isEditing ? (
          <CardContent className="pt-6">
            <ProfileForm profile={profile} onSubmit={handleProfileUpdate} />
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </CardContent>
        ) : (
          <>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile?.avatarUrl} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
              <CardDescription>{profile?.bio}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{user?.email}</span>
              </div>
              {profile?.phoneNumber && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span>{profile?.phoneNumber}</span>
                </div>
              )}
              {profile?.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{profile?.address}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>
                  Joined {new Date(user?.createdAt || "").toLocaleDateString()}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </CardFooter>
          </>
        )}
      </Card>

      <h2 className="text-2xl font-bold mb-4">My Events</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                {new Date(event.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">{event.description}</p>
              <p className="text-sm font-semibold">{event.location}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/edit-event/${event.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(event.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
