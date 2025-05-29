/**
    * Interface que representa o estado atual do jogo "Adivinhe o Número".
    * Armazena todas as informações necessárias para controlar o progresso do jogo.
*/
export interface EstadoDoJogo {
    /**
        * O número secreto que o jogador está tentando adivinhar.
        * Este é um número aleatório gerado quando o jogo começa.
        * Exemplo: Se o número secreto for 42, o jogador precisa descobrir esse valor.
     */
    numeroSecreto: number;

    /**
        * Quantas tentativas o jogador ainda tem antes do jogo acabar.
        * Esse valor diminui a cada palpite errado.
        * Exemplo: Começa com 10 e vai para 9, 8, etc., a cada palpite.
    */
    tentativasRestantes: number;

    /**
        * O último número que o jogador tentou adivinhar.
        * É "opcional" (representado pelo ?) porque no início do jogo o jogador ainda não fez nenhum palpite.
        * Exemplo: Se o jogador chutou 50, este valor será 50.
    */
    numeroChutado?: number;

    /**
        * Mensagem de feedback para o jogador, mostrando se o palpite foi alto, baixo ou correto.
        * Exemplo: "Muito alto! Tente novamente." ou "Parabéns! Você acertou!"
    */
    mensagem: string;

    /**
        * Indica se o jogo terminou (verdadeiro ou falso).
        * O jogo termina quando o jogador acerta o número ou quando as tentativas acabam.
        * Exemplo: Será true se o jogador acertou ou se usou todas as tentativas.
    */
    jogoEncerrado: boolean;

    /**
        * Indica se o jogador venceu o jogo.
        * É "opcional" porque só é relevante quando o jogo termina (jogoVencido = true).
        * Exemplo: Será true se o jogador acertou o número, false se perdeu.
    */
    jogoVencido?: boolean;

    /**
        * Um histórico com todos os números que o jogador já tentou.
        * Isso ajuda o jogador a lembrar quais números já foram testados.
        * Exemplo: [25, 50, 38] mostra os palpites na ordem que foram feitos.
    */
    historicoDeTentativas: number[];
}