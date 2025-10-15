import { create, readAll } from "../config/database.js";

export const Fornecedores = {
  create: async (data) => {
    return await create("fornecedores", data);
  },

  getAll: async () => {
    return await readAll("fornecedores");
  }
};
