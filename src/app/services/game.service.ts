// Importa o decorador Injectable do Angular, que permite que este serviço seja 
// injetado em outros componentes
import { Injectable } from '@angular/core';
// Importa a interface EstadoDoJogo que define a estrutura dos dados do jogo
import { EstadoDoJogo } from '../models/game-state.model';

// O decorador @Injectable marca esta classe como um serviço que pode ser injetado 
// em qualquer parte da aplicação
// providedIn: 'root' significa que será criada uma única instância compartilhada 
// por toda a aplicação
@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Constante que define o número máximo que pode ser adivinhado (100)
  private readonly NUMERO_MAXIMO = 100;
  // Constante que define o número máximo de tentativas que o jogador tem (10)
  private readonly TENTATIVAS_MAXIMAS = 10;

  // Adiciona um getter público
  get tentativasMaximas(): number {
    return this.TENTATIVAS_MAXIMAS;
  }

  

  /**
    * Gera um número aleatório entre 1 e NUMERO_MAXIMO (100) que será o número secreto
    * @returns Um número inteiro aleatório entre 1 e 100
    * Exemplo: Pode retornar 42, 73, ou qualquer número nesse intervalo
  */
  gerarNumeroAleatorio(): number {
    // Math.random() gera um número decimal entre 0 (inclusive) e 1 (exclusive)
    // Multiplicamos por NUMERO_MAXIMO para obter um número entre 0 e 99.999...
    // Math.floor arredonda para baixo, resultando em 0 a 99
    // +1 ajusta para o intervalo desejado de 1 a 100
    return Math.floor(Math.random() * this.NUMERO_MAXIMO) + 1;
  }

  /**
   * Cria um novo estado inicial do jogo com valores padrão
   * @returns Um objeto GameState com o jogo pronto para começar
   * Exemplo: 
   * {
   *   numeroSecreto: 57,
   *   tentativasRestantes: 10,
   *   mensagem: '',
   *   jogoVencido: false,
   *   historicoDeTentativas: []
   * }
   */
  inicializarEstadoDoJogo(): EstadoDoJogo {
    return {
      numeroSecreto: this.gerarNumeroAleatorio(), // Gera um novo número secreto
      tentativasRestantes: this.TENTATIVAS_MAXIMAS,      // Começa com 10 tentativas
      numeroChutado: undefined,                 // Nenhum palpite ainda
      mensagem: '',                             // Mensagem vazia no início
      jogoEncerrado: false,                         // Jogo começa ativo
      jogoVencido: undefined,                      // Ainda não há vitória/derrota
      historicoDeTentativas: []                      // Lista vazia de palpites anteriores
    };
  }

  /**
   * Verifica se um palpite do jogador é válido
   * @param chute O número que o jogador está tentando
   * @returns true se o palpite estiver entre 1 e 100, false caso contrário
   * Exemplo: 
   * - validarChute(50) → true
   * - validarChute(0) → false
   * - validarChute(101) → false
   */
  validarChute(chute: number): boolean {
    return chute >= 1 && chute <= this.NUMERO_MAXIMO;
  }

  /**
   * Avalia o palpite do jogador e atualiza o estado do jogo
   * @param estadoAtual O estado atual do jogo antes do palpite
   * @param chute O número que o jogador tentou
   * @returns Um NOVO estado do jogo atualizado com o resultado do palpite
   * Exemplo: Se o número secreto for 42 e o palpite for 50:
   * - tentativasRestantes diminui de 10 para 9
   * - mensagem será "Muito alto! Tente novamente."
   * - historicoDeTentativas incluirá 50
   */
  avaliarChute(estadoAtual: EstadoDoJogo, chute: number): EstadoDoJogo {
    // Cria uma cópia do estado atual para não modificar o original diretamente
    const novoEstado = { ...estadoAtual };
    
    // Atualiza o último palpite do jogador
    novoEstado.numeroChutado = chute;
    
    // Adiciona o novo palpite ao histórico (criando um novo array para imutabilidade)
    novoEstado.historicoDeTentativas = [...estadoAtual.historicoDeTentativas, chute];
    
    // Diminui o número de tentativas restantes
    novoEstado.tentativasRestantes--;

  

    // Verifica se o jogador acertou o número secreto
    if (chute === estadoAtual.numeroSecreto) {
      novoEstado.jogoEncerrado = true;      // Termina o jogo
      novoEstado.jogoVencido = true;     // Marca como vitória
      novoEstado.mensagem = 'Parabéns! Você acertou o número!';
    } 
    // Verifica se as tentativas acabaram
    else if (novoEstado.tentativasRestantes === 0) {
      novoEstado.jogoEncerrado = true;      // Termina o jogo
      novoEstado.jogoVencido = false;     // Marca como derrota
      novoEstado.mensagem = `Fim de jogo! O número correto era ${estadoAtual.numeroSecreto}`;
    } 
    // Se o jogo continua, dá uma dica se o palpite foi alto ou baixo
    else {
      novoEstado.mensagem = chute > estadoAtual.numeroSecreto 
        ? 'Muito alto! Tente novamente.' 
        : 'Muito baixo! Tente novamente.';
    }

    // Retorna o novo estado atualizado
    return novoEstado;
  }
}
