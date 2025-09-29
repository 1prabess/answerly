import axios from "axios";

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("/api/upload", formData);

  return res.data.data.secure_url;
}
