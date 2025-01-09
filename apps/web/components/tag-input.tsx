import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { tagApi } from '@/lib/api'


interface TagInputProps {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  isEditing: boolean
  eventId: string;
}

export function TagInput({ tags, setTags, isEditing, eventId }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault()
      await addTag(inputValue)
    }
  }

  const createTag = async (tagName: string) => {
    try {
      await tagApi.create({ name: tagName, eventId: eventId }) 
      return true
    } catch (error) {
      console.error('Failed to create tag:', error)
      return false
    }
  }

  const addTag = async (tag: string) => {
    if (tag.trim() !== '' && !tags.includes(tag.trim())) {
      setIsLoading(true)
      const success = await createTag(tag.trim())
      if (success) {
        setTags([...tags, tag.trim()])
        setInputValue('')
      }
      setIsLoading(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <span key={tag} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 focus:outline-none" disabled={isLoading}>
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Add a tag..."
          className="flex-grow"
          disabled={isLoading}
        />
        <Button type="button" onClick={() => addTag(inputValue)} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Tag'}
        </Button>
      </div>
    </div>
  )
}

