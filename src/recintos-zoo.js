import { animaisValidos } from "./animais-validos";
import { recintosViaveis } from "./recintos-viaveis";

class RecintosZoo {

  constructor() {
    this.recintosViaveis = recintosViaveis;
    this.animaisValidos = animaisValidos;
  }

/**
 * Verifica se o bioma do recinto é adequado para o animal informado.
 * Retorna `true` se o bioma for adequado, caso contrário, retorna `false`.
 * 
 * @param {Object} animalInfo - Objeto que contém informações sobre o animal informado.
 * @param {Object} animalInfo.bioma - Bioma de origem do animal.
 * 
 * @param {string[]} biomasDoRecinto - Lista de biomas presentes no recinto.
 * 
 * @returns {boolean} Retorna `true` se o bioma do recinto for adequado para o animal, `false` caso contrário.
 */
  verificaBiomaAdequado(animalInfo, biomasDoRecinto) {
    return biomasDoRecinto.some(bioma => animalInfo.bioma[bioma]);
  }

/**
 * Retorna uma lista contendo os nomes dos animais já presentes no recinto.
 * 
 * @param {Object} recinto - Objeto que contém informações sobre o recinto.
 * @param {string[]} recinto.animaisExistentes - Lista de nomes dos animais atualmente presentes no recinto.
 * 
 * @returns {string[]} Lista de nomes dos animais presentes no recinto.
 */
  obterAnimaisNoRecinto(recinto) {
    return recinto.animaisExistentes !== "vazio" ? recinto.animaisExistentes.split(" ") : [];
  }

/**
 * Verifica se o animal informado, caso seja carnívoro, pertence à mesma espécie que o animal presente no recinto.
 * Retorna `true` se pertencer à mesma espécie, caso contrário, retorna `false`.
 * 
 * @param {string} animal - Nome do animal informado.
 * 
 * @param {Object} animalInfo - Informações detalhadas sobre o animal informado.
 * @param {boolean} animalInfo.carnivoro - Define se o animal é carnívoro (true) ou não (false).
 * 
 * @param {Object} animalExistenteInfo - Informações detalhadas sobre o animal existente no recinto.
 * @param {boolean} animalExistenteInfo.carnivoro - Define se o animal presente no recinto é carnívoro (true) ou não (false).
 * 
 * @param {string} especieExistente - Espécie do animal presente no recinto.
 * 
 * @returns {boolean} Retorna `true` se o animal informado for carnívoro e pertencer à mesma espécie do animal no recinto; caso contrário, `false`.
 */
  verificaConvivenciaCarnivoros(animal, animalInfo, animalExistenteInfo, especieExistente) {
    if (animalInfo["carnivoro"] || animalExistenteInfo["carnivoro"]) {
      if (animal.toUpperCase() !== especieExistente.toUpperCase()) 
        return false;
    }
    return true;
  }

  /**
 * Verifica se um hipopótamo pode conviver adequadamente no recinto, considerando os biomas presentes.
 * Retorna `false` se o animal informado ou a espécie existente for um hipopótamo e o bioma do recinto não incluir "savana" ou "rio".
 * Caso contrário, retorna `true`.
 * 
 * @param {string} animal - Nome do animal informado.
 * @param {string} especieExistente - Espécie do animal já presente no recinto.
 * @param {string[]} biomasDoRecinto - Lista de biomas presentes no recinto.
 * 
 * @returns {boolean} Retorna `true` se as condições de bioma forem adequadas para um hipopótamo, caso contrário, `false`.
 */
  verificaConvivenciaHipopotamos(animal, especieExistente, biomasDoRecinto) {
    if (animal.toUpperCase() === "HIPOPOTAMO" || especieExistente.toUpperCase === "HIPOPOTAMO") {
      if (!biomasDoRecinto.includes("savana") && !biomasDoRecinto.includes("rio")) 
        return false;
    }
    return true;
  }

  /**
 * Analisa os recintos disponíveis para determinar quais são viáveis para abrigar o animal informado, levando em conta o espaço disponível, bioma e compatibilidade entre as espécies.
 * Retorna uma lista dos recintos viáveis ou um erro, caso não haja recintos adequados.
 * 
 * @param {string} animal - Nome do animal a ser alocado.
 * @param {number} quantidade - Quantidade de animais a serem alocados.
 * 
 * @returns {Object} Retorna um objeto contendo uma lista de recintos viáveis ou um erro.
 * @returns {string[]} [recintosViaveis] - Lista de recintos viáveis, formatada com número do recinto, espaço livre e espaço total. 
 * @returns {Object} [erro] - Objeto com mensagem de erro, caso o animal ou quantidade sejam inválidos, ou se não houver recintos viáveis.
 * @returns {string} erro.mensagem - Descrição do erro (ex.: "Animal inválido", "Quantidade inválida", "Não há recinto viável").
 */
  analisaRecintos(animal, quantidade) {
    const animalInfo = this.animaisValidos[animal.toUpperCase()];

    if (animalInfo == undefined) 
      return { erro: "Animal inválido" };

    if (!Number.isInteger(quantidade) || quantidade <= 0) 
      return { erro: "Quantidade inválida" };

    const recintosViaveis = [];

    for (const recinto of this.recintosViaveis) {
      let espacoTotal = recinto.tamanhoTotal;
      const biomasDoRecinto = recinto.bioma.split(" e ");

      if (!this.verificaBiomaAdequado(animalInfo, biomasDoRecinto)) continue;

      let animaisNoRecinto = this.obterAnimaisNoRecinto(recinto);

      if (animaisNoRecinto.length > 0) {
        const quantidadeExistentes = parseInt(animaisNoRecinto[0]);
        const especieExistente = animaisNoRecinto[1].toUpperCase();
        const animalExistenteInfo = this.animaisValidos[especieExistente.toUpperCase()];

        espacoTotal -= (quantidadeExistentes * animalExistenteInfo.tamanho);

        if (!this.verificaConvivenciaCarnivoros(animal, animalInfo, animalExistenteInfo, especieExistente)) continue;
        if (!this.verificaConvivenciaHipopotamos(animal, especieExistente, biomasDoRecinto)) continue;
        if (especieExistente.toUpperCase() !== animal.toUpperCase()) espacoTotal -= 1;
      }

      const espacoNecessario = (animalInfo.tamanho * quantidade);

      if (espacoTotal >= espacoNecessario) {
        const espacoLivre = espacoTotal - espacoNecessario;

        recintosViaveis.push({
          "numero": recinto.numero,
          "espaçoLivre": espacoLivre,
          "espaçoTotal": recinto.tamanhoTotal,
        });
      }
    }

    if (recintosViaveis.length === 0)
      return { erro: "Não há recinto viável" };

    // Ordena os recintos viáveis pelo número do recinto
    recintosViaveis.sort((a, b) => a.numero - b.numero);
    const listaRecintos = recintosViaveis.map(recinto => `Recinto ${recinto["numero"]} (espaço livre: ${recinto["espaçoLivre"]} total: ${recinto["espaçoTotal"]})`);

    return { recintosViaveis: listaRecintos }
  }
}

export { RecintosZoo as RecintosZoo };