'use client'

import { useState, useEffect } from 'react'
import { UserForm } from '@/components/user-form'
import { ProfileForm } from '@/components/profile-form'
import { userApi, profileApi } from '@/lib/api'
import { User, Profile, EditUserDto, UpdateProfileDto } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Moon, Sun } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/custom-button"
import { BackButton } from '@/components/back-button'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userApi.getMe()
        setUser(userData)
        try {
          const profileData = await profileApi.getMyProfile()
          setProfile(profileData)
        } catch (profileError) {
          console.error('Failed to fetch profile:', profileError)
          // If profile doesn't exist, set it to null
          setProfile(null)
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch user data",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleUserUpdate = async (data: EditUserDto) => {
    try {
      const updatedUser = await userApi.edit(data)
      setUser(updatedUser)
      toast({
        title: "Success",
        description: "User information updated successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user information",
      })
    }
  }

  const handleProfileUpdate = async (data: UpdateProfileDto) => {
    try {
      let updatedProfile: Profile
      if (profile) {
        updatedProfile = await profileApi.update(profile.id, data)
      } else {
        updatedProfile = await profileApi.create(data)
      }
      setProfile(updatedProfile)
      toast({
        title: "Success",
        description: profile ? "Profile updated successfully" : "Profile created successfully",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      })
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <BackButton />
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="mb-8">
        <Button onClick={toggleTheme} variant="outline">
          {theme === "light" ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
          {theme === "light" ? "Dark" : "Light"} Mode
        </Button>
      </div>
      <Tabs defaultValue="user">
        <TabsList className="mb-4">
          <TabsTrigger value="user">User Information</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Update your account details here.</CardDescription>
            </CardHeader>
            <CardContent>
              {user && <UserForm user={user} onSubmit={handleUserUpdate} />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your public profile information.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm profile={profile} onSubmit={handleProfileUpdate} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

