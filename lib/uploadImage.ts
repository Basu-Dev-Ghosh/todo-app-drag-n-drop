import { ID, storage } from "@/appwrite";

export const uploadImage = (file: File) => {
  if (!file) return;

  const fileUploaded = storage.createFile(
    process.env.NEXT_PUBLIC_IMAGE_BUCKET_ID!,
    ID.unique(),
    file
  );

  return fileUploaded;
};
