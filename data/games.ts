export interface GameItem {
  name: string;
  nameEn: string;
  nameVi: string;
  description: string;
  descriptionEn: string;
  descriptionVi: string;
  url: string;
  image?: string;
  category: string;
  categoryEn: string;
  categoryVi: string;
  isMine?: boolean;
}

export const GAMES: GameItem[] = [
  {
    name: "Chinese Chess",
    nameEn: "Chinese Chess",
    nameVi: "Cờ Tướng",
    description: "Play Chinese Chess (Xiangqi) online - a traditional Chinese strategy board game. Challenge players from around the world in this classic game of tactics and skill.",
    descriptionEn: "Play Chinese Chess (Xiangqi) online - a traditional Chinese strategy board game. Challenge players from around the world in this classic game of tactics and skill.",
    descriptionVi: "Chơi Cờ Tướng trực tuyến - một trò chơi chiến thuật truyền thống của Trung Quốc. Thách thức người chơi từ khắp nơi trên thế giới trong trò chơi cổ điển này.",
    url: "https://chinese-chess.vinhtieng.com",
    image: "/images/game/chinese-chess.webp",
    category: "Board Game",
    categoryEn: "Board Game",
    categoryVi: "Cờ",
    isMine: true,
  },
  {
    name: "Venge.io",
    nameEn: "Venge.io",
    nameVi: "Venge.io",
    description: "Best FPS shooter io game! Fast-paced online multiplayer shooter with unique heroes, custom weapons, and thousands of community-made maps. Join 3+ million monthly players!",
    descriptionEn: "Best FPS shooter io game! Fast-paced online multiplayer shooter with unique heroes, custom weapons, and thousands of community-made maps. Join 3+ million monthly players!",
    descriptionVi: "Game bắn súng FPS io hay nhất! Game bắn súng nhiều người chơi nhanh với các nhân vật độc đáo, vũ khí tùy chỉnh, và hàng ngàn bản đồ do cộng đồng tạo ra. Tham gia cùng 3+ triệu người chơi mỗi tháng!",
    url: "https://venge.io",
    category: "Shooter",
    categoryEn: "Shooter",
    categoryVi: "Bắn súng",
  },
];
