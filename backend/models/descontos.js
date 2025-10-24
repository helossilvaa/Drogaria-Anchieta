import { create, readAll, read, update, deleteRecord } from "../config/database.js";

export const Descontos = {
  create: async (data) => {
    return await create("descontos", data);
  },

  getAll: async () => {
    const result = await readAll("descontos");
    return Array.isArray(result) ? result : [];
  },

  getByNome: async (nome) => {
    const where = `LOWER(TRIM(nome)) = LOWER(TRIM('${nome}'))`;
    const result = await read("descontos", where);
    return result || null;
  },

  update: async (id, data) => {
    return await update("descontos", data, `id = ${id}`);
  },
  
  delete: async (id) => {
    return await deleteRecord("descontos", `id = ${id}`);
  },
};
