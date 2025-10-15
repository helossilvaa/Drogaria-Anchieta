import { create, readAll, read } from "../config/database.js";

export const Filiado = {
  create: async (data) => {
    return await create("filiados", data);
  },

  getAll: async () => {
    return await readAll("filiados");
  },

  getByCPF: async (cpf) => {
    return await read("filiados", `cpf = '${cpf}'`);
  }
};