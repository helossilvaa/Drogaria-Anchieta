import { create, readAll, update, deleteRecord } from "../config/database.js";

export const Conta = {
  create: async (data) => {
    return await create("contas", data);
  },

  getAll: async () => {
    return await readAll("contas");
    
  },

  update: async (id, data) => {
    return await update("contas", data, `id = ${id}`);
  },

  delete: async (id) => {
    return await deleteRecord("contas", `id = ${id}`);
  },

};
