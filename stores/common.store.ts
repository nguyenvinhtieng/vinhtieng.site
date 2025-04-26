import { defineStore } from "pinia";

const useCommonStore = defineStore("common", {
  state: () => ({
    isOpenSearchDialog: false,
  }),
  getters: {
    getIsOpenSearchDialog: (state) => state.isOpenSearchDialog,
  },
  actions: {
    toggleOpenSearchDialog(isOpen?: boolean) {
      this.isOpenSearchDialog = isOpen ?? !this.isOpenSearchDialog;
    },
  },
});

export default useCommonStore;
