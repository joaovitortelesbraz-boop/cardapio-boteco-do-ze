import type { VenueOpeningSchedule } from "@/src/domain/venue/opening-hours";

const openingSchedule = {
  // Altere somente este valor caso o estabelecimento use outro fuso IANA.
  timeZone: "America/Sao_Paulo",
  periods: [
    {
      days: [1, 2, 3, 4, 5],
      opensAt: "19:00",
      closesAt: "02:00",
      closesDayOffset: 1,
    },
    {
      days: [6, 7],
      opensAt: "20:00",
      closesAt: "04:00",
      closesDayOffset: 1,
    },
  ],
} as const satisfies VenueOpeningSchedule;

export const venue = {
  name: "Boteco do Zé",
  tagline: "Se a semana foi pesada, o Boteco do Zé é o tratamento!",
  invitation: "Chama a galera e vem pro Zé!",
  openingHours: "Seg a sex: 19h às 02h • Sáb e dom: 20h às 04h",
  openingSchedule,
  instagram: {
    handle: "@botecodo_ze_",
    url: "https://www.instagram.com/botecodo_ze_?igsh=bzRxcDRiMWxwNmRx",
  },
} as const;
