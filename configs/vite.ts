import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

export const vite = {
  plugins: [
    tailwindcss(),
    Icons({
      autoInstall: true,
      compiler: "vue3",
    }),
  ],
};
