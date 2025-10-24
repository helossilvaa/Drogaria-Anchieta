import { create, readAll, read, update, deleteRecord } from "../config/database.js";

export const Parcerias = {
  create: async (data) => {
    return await create("parcerias", data);
  },

  getAll: async () => {
    const result = await readAll("parcerias");
    return Array.isArray(result) ? result : [];
  },

  getByNome: async (parceiro) => {
    const where = `LOWER(TRIM(parceiro)) = LOWER(TRIM('${parceiro}'))`;
    const result = await read("parcerias", where);
    return result || null;
  },

  update: async (id, data) => {
    return await update("parcerias", data, `id = ${id}`);
  },

  delete: async (id) => {
    return await deleteRecord("parcerias", `id = ${id}`);
  },
};