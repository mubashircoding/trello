"use client";
import { useEffect, useState } from "react";

import { unsplash } from "@/lib/unsplash";
import { Check, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FormErrors } from "./form-errors";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

const Formpicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [images, setImages] = useState<Array<Record<string, any>>>([]);
  const [isloading, setIsLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });
        console.log(images);

        if (result && result.response) {
          const newImages = result.response as Array<Record<string, any>>;
          setImages(newImages);
        } else {
          console.error("Failed TO GET IMAGES");
        }
      } catch (error) {
        console.log(error);
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);
  if (isloading) {
    return (
      <div className="p-6 flex items-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }
  console.log(images);

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => {
              if (pending) return;

              setSelectedImageId(image.id);
            }}
          >
            <input 
            type="radio" 
            id={id} 
            name={id} 
            className="hidden"
            checked={selectedImageId === image.id}
            disabled={pending}
            value={`${image.id} | ${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`} 
            />
            <Image
              src={image.urls.thumb}
              alt="unsplash Image"
              className="object-cover rounded-sm"
              fill
            />
            {selectedImageId === image.id && (
              <div className=" absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="
              opacity-0 group-hover:opacity-100 absolute
              bottom-0 w-full text-[10px] truncate text-white
              hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};

export default Formpicker;
