'use client';

import { useState, useActionState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/ui/copy-button';
import { Upload } from 'lucide-react';
import { generateCaption, type FormState } from '../action';
import { useFormStatus } from 'react-dom';

export default function CaptionGeneratorForm() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  
    const initialState: FormState = {};
    const [formState, formAction] = useActionState<FormState, FormData>(
      generateCaption,
      initialState
    );
  
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <form action={formAction} encType="multipart/form-data">
        <Card>
          <CardHeader>
            <CardTitle>Generate AI-Powered Captions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="image-upload" className="mb-2">
                  Upload Image
                </Label>
                <div className="mt-2">
                  <input
                    id="image-upload"
                    type="file"
                    name="image"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          your image
                        </p>
                        <p className="text-xs text-gray-500">
                          JPG or PNG (MAX. 10MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="tone-style" className="mb-2">
                  Tone & Style Preferences
                </Label>
                <Textarea
                  id="tone-style"
                  name="tone"
                  placeholder="Describe the tone and style you want for your caption. For example: 'Professional and informative', 'Casual and fun', 'Inspirational and motivating', etc."
                  className="min-h-[120px] resize-y"
                />
              </div>
            </div>
            <SubmitButton />
            {formState.error && (
              <p className="text-red-500 text-sm">{formState.error}</p>
            )}
            {formState.captions && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {formState.captions.map((item, index) => (
                  <div key={`${item.platform}-${index}`} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold capitalize">{item.platform}</h3>
                      <CopyButton text={item.caption} />
                    </div>
                    <p className="mt-2 text-sm whitespace-pre-wrap leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    );
  }
  
  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white mt-4"
        disabled={pending}
      >
        Generate Caption
      </Button>
    );
  }