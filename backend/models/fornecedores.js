import { create, readAll, update, deleteRecord } from "../config/database.js";

export const Fornecedores = {
  create: async (data) => {
    return await create("fornecedores", data);
  },

  getAll: async () => {
    return await readAll("fornecedores");
  },

  update: async (id, data) => {
    return await update("fornecedores", data, `id = ${id}`);
  },

  delete: async (id) => {
    return await deleteRecord("fornecedores", `id = ${id}`);
  },
};
