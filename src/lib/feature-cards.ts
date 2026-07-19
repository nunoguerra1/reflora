export const FEATURE_CARDS = [
    {
        id: "diario",
        title: "Diário de crescimento",
        description: "Fotos e notas ao longo do tempo, numa timeline visual.",
        position: { top: "18%", left: "12%" },
    },
    {
        id: "lembretes",
        title: "Lembretes automáticos",
        description: "Rega e adubação chegam na hora certa, sem esforço.",
        position: { top: "14%", right: "10%" },
    },
    {
        id: "mapa",
        title: "Mapa da comunidade",
        description: "Descubra jardins e árvores plantadas perto de você.",
        position: { top: "56%", left: "18%" },
    },
    {
        id: "impacto",
        title: "Impacto coletivo",
        description: "Veja o CO₂ estimado que a comunidade já absorveu.",
        position: { top: "60%", right: "14%" },
    },
];

export function getRevealProgress(progress: number, index: number, total: number) {
    const segment = 1 / total;
    const start = index * segment;
    const end = start + segment * 0.55;

    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
}