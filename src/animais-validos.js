const animaisValidos = {
  LEAO: {
    tamanho: 3,
    bioma: { savana: "savana" },
    carnivoro: true
  },
  LEOPARDO: {
    tamanho: 2,
    bioma: { savana: "savana" },
    carnivoro: true
  },
  CROCODILO: {
    tamanho: 3,
    bioma: { rio: "rio" },
    carnivoro: true
  },
  MACACO: {
    tamanho: 1,
    bioma: { savana: "savana", floresta: "floresta" },
    carnivoro: false
  },
  GAZELA: {
    tamanho: 2,
    bioma: { savana: "savana" },
    carnivoro: false
  },
  HIPOPOTAMO: {
    tamanho: 4,
    bioma: { savana: "savana", rio: "rio" },
    carnivoro: false
  }
};

export { animaisValidos };