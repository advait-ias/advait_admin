import api from "../axiosConfig";

export const fetchAllWhatsNew = async () => {
  const res = await api.get("https://api.advaitias.co.in/whats-new");
  return res.data;
};

export const addWhatsNew = async (id: string) => {
  const res = await api.post("https://api.advaitias.co.in/whats-new", {
    id,
    type: "article",
  });
  return res.data;
};

export const deleteWhatsNew = async (id: string) => {
  const res = await api.delete(
    `https://api.advaitias.co.in/whats-new/id/${id}`
  );
  return res.data;
};