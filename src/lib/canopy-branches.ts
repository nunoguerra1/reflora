export const BRANCHES = [
    {
        id: "diario",
        branchPos: [0, 1.3, 0] as [number, number, number],
        branchRot: [0, 0, 0.9] as [number, number, number],
        foliagePos: [-1.7, 2.1, 0.1] as [number, number, number],
        title: "Diário de crescimento",
        description: "Fotos e notas ao longo do tempo, numa timeline visual.",
    },
    {
        id: "lembretes",
        branchPos: [0, 1.7, 0] as [number, number, number],
        branchRot: [0, 0, -0.85] as [number, number, number],
        foliagePos: [1.8, 2.5, -0.15] as [number, number, number],
        title: "Lembretes automáticos",
        description: "Rega e adubação chegam na hora certa, sem esforço.",
    },
    {
        id: "mapa",
        branchPos: [0, 2.1, 0.1] as [number, number, number],
        branchRot: [0.15, 0, 0.75] as [number, number, number],
        foliagePos: [-1.4, 3.2, 0.4] as [number, number, number],
        title: "Mapa da comunidade",
        description: "Descubra jardins e árvores plantadas perto de você.",
    },
    {
        id: "impacto",
        branchPos: [0, 2.5, -0.1] as [number, number, number],
        branchRot: [-0.15, 0, -0.7] as [number, number, number],
        foliagePos: [1.3, 3.7, 0.35] as [number, number, number],
        title: "Impacto coletivo",
        description: "Veja o CO₂ estimado que a comunidade já absorveu.",
    },
];

export function getRevealProgress(progress: number, index: number, total: number) {
    const segment = 1 / total;
    const start = index * segment;
    const end = start + segment * 0.6;

    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
}