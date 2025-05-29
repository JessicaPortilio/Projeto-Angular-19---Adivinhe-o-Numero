import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoDoJogo } from '../../models/game-state.model';
import { GameService } from '../../services/game.service';


@Component({
  selector: 'app-game',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  // Variável que armazenará nosso formulário de palpite
  formularioDoJogo!: FormGroup;

  // Variável que armazenará todo o estado atual do jogo
  estadoDoJogo!: EstadoDoJogo;

  public tentativasMaximas: number;
  

  // Construtor - onde injetamos as dependências necessárias
  constructor(
    private fb: FormBuilder, // Serviço para criar formulários reativos
    private jogoService: GameService // Nosso serviço de lógica do jogo
  ) {
    this.tentativasMaximas = this.jogoService.tentativasMaximas;
  }

  
  // Método que roda quando o componente é inicializado
  ngOnInit(): void {
    this.inicializarJogo(); // Prepara o estado inicial do jogo
    this.inicializarFormulario(); // Configura o formulário de palpite
  }
  
  /**
    * Inicializa o jogo criando um novo estado através do GameService
    * Exemplo: Gera um novo número secreto, reseta tentativas, etc.
  */
  private inicializarJogo(): void {
    this.estadoDoJogo = this.jogoService.inicializarEstadoDoJogo();
  }

  /**
     * Configura o formulário de palpite com validações
     * O campo 'guess' (palpite) tem as seguintes regras:
     * - Obrigatório (não pode ser vazio)
     * - Valor mínimo 1
     * - Valor máximo 100
     * - Apenas números são permitidos
  */
  private inicializarFormulario(): void {
    this.formularioDoJogo = this.fb.group({
      chute: ['', [ // Valor inicial vazio com validadores
        Validators.required, // Campo obrigatório
        Validators.min(1),   // Número não pode ser menor que 1
        Validators.max(100), // Número não pode ser maior que 100
        Validators.pattern('^[0-9]*$') // Apenas dígitos numéricos
      ]]
    });
  }

  /**
   * Getter (acessador) conveniente para o campo 'chute' do formulário
   * Facilita o acesso ao controle do campo no template HTML
   * Exemplo: Podemos usar chute.errors no HTML para mostrar mensagens
   */
  get chute() {
    return this.formularioDoJogo.get('chute') as FormControl;
  }

  /**
    * Método chamado quando o jogador envia um palpite
    * 1. Verifica se o formulário é válido
    * 2. Converte o valor para número
    * 3. Atualiza o estado do jogo com o palpite
    * 4. Reseta o formulário para o próximo palpite
  */
  aoEnviar(): void {
    // Se o formulário for inválido, não faz nada
    if (this.formularioDoJogo.invalid) return;

    // Converte o valor do formulário para número
    const chute = Number(this.formularioDoJogo.value.chute);
    
    // Atualiza o estado do jogo avaliando o palpite
    this.estadoDoJogo = this.jogoService.avaliarChute(this.estadoDoJogo, chute);
    
    // Limpa o formulário para o próximo palpite
    this.formularioDoJogo.reset();
  }

  /**
   * Reinicia o jogo completamente
   * 1. Cria um novo estado de jogo
   * 2. Reseta o formulário
   */
  restartGame(): void {
    this.inicializarJogo(); // Gera novo número secreto e reseta estado
    this.formularioDoJogo.reset(); // Limpa o formulário
  }

  /**
    * Calcula a porcentagem de tentativas já utilizadas
    * @returns Porcentagem (0-100) de tentativas usadas
    * Exemplo: Se já foram 5 tentativas de 10, retorna 50
  */
  obterPorcentagemDeTentativas(): number {
    return (this.estadoDoJogo.historicoDeTentativas.length / this.jogoService.tentativasMaximas) * 100;
  }

  // this.estadoDoJogo.historicoDeTentativas.length conta quantas tentativas já foram feitas
  // Dividindo pelo tentativasMaximas obtemos a fração de tentativas usadas
  // Multiplicando por 100 convertemos para porcentagem

}
