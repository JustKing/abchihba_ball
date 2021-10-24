export default class Ball {
  public x: number = 0;
  public y: number = 0;
  public radius = 15;
  private ballRadius = 10;
  private canvasId: string = "";
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private dx: number = 0;
  private dy: number = 0;
  private vx: number = 0;
  private vy: number = 0;
  private ui = 0;
  private maxV = 100;

  constructor(canvasId: string, ui: number) {
    this.canvasId = canvasId;
    this.ui = ui;
  }

  get hasCanvas(): boolean {
    return !!this.canvas;
  }

  /**
   * @description Получение canvas и canvas context
   */
  setCanvas() {
    const canvas: HTMLCanvasElement | null = document.querySelector(
      this.canvasId
    );
    if (canvas) {
      this.canvas = canvas;
      const main = document.querySelector("#main");
      let mainHeight = main?.getBoundingClientRect().height;
      let mainWidth = main?.getBoundingClientRect().width;
      let headerHeight = document
        .querySelector("header")
        ?.getBoundingClientRect().height;
      if (mainWidth && mainHeight && headerHeight) {
        canvas.height = mainHeight - headerHeight - 20;
        canvas.width = mainWidth;
      }
    }
    if (this.canvas) {
      this.context = this.canvas.getContext("2d");
      this.setX(this.canvas.width / 2);
      this.setY(this.canvas.height - 30);
    }
  }

  /**
   * @description Установка координаты шара по x
   */
  setX(x: number): void {
    this.x = x;
  }

  /**
   * @description Установка координаты шара по y
   */
  setY(y: number): void {
    this.y = y;
  }

  /**
   * @description движение по x
   */
  setDx(gamma: number): void {
    this.dx = 100 * Math.sin(gamma);
  }

  /**
   * @description движение по y
   */
  setDy(beta: number): void {
    this.dy = 100 * Math.sin(beta);
  }

  updateVx(): void {
    if (Math.abs(this.vx + (this.dx * this.ui) / 1000) <= this.maxV) {
      this.vx += (this.dx * this.ui) / 1000;
    }
  }

  updateVy(): void {
    if (Math.abs(this.vy + (this.dy * this.ui) / 1000) <= this.maxV) {
      this.vy += (this.dy * this.ui) / 1000;
    }
  }

  lossEnergy(v: number): number {
    return -1 * Math.sign(v) * Math.sqrt(0.8 * Math.pow(v, 2));
  }

  private drawMaze() {
    if (this.context && this.canvas) {
      this.context.lineWidth = 4;
      this.context.strokeStyle = "black";
      this.context.beginPath();
      this.context.moveTo(0, 0);
      this.context.lineTo(this.canvas.width, 0);
      this.context.lineTo(this.canvas.width, this.canvas.height);
      this.context.lineTo(0, this.canvas.height);
      this.context.lineTo(0, 0);
      this.context.stroke();
      this.context.beginPath();
      this.context.moveTo(this.canvas.width / 2 + 30, this.canvas.height);
      this.context.lineTo(this.canvas.width / 2 + 30, this.canvas.height - 70);
      this.context.lineTo(this.canvas.width / 2 - 30, this.canvas.height - 70);
      this.context.lineTo(this.canvas.width / 2 - 30, this.canvas.height - 70);
      this.context.moveTo(this.canvas.width / 2 - 30, this.canvas.height);
      this.context.lineTo(this.canvas.width / 2 - 30, this.canvas.height - 20);
      this.context.lineTo(this.canvas.width / 2 - 100, this.canvas.height - 20);
      this.context.lineTo(this.canvas.width / 2 - 100, this.canvas.height);
      this.context.moveTo(this.canvas.width / 2 - 150, this.canvas.height);
      this.context.lineTo(this.canvas.width / 2 - 150, 0);
      this.context.moveTo(this.canvas.width / 2 - 100, 0);
      this.context.lineTo(this.canvas.width / 2 - 100, this.canvas.height - 50);
      this.context.lineTo(this.canvas.width / 2 - 80, this.canvas.height - 50);
      this.context.lineTo(this.canvas.width / 2 - 80, this.canvas.height - 120);
      this.context.lineTo(this.canvas.width / 2, this.canvas.height - 120);
      this.context.stroke();
    }
  }

  private checkCollision(): boolean {
    if (this.context) {
      let imgData = this.context.getImageData(
        this.x - this.ballRadius / 2 - 2,
        this.y - this.ballRadius / 2 - 2,
        this.ballRadius / 2 + 2,
        this.ballRadius / 2 + 2
      );
      let pixels = imgData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        if (r === 0 && g === 0 && b === 0) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  public draw(beta: number, gamma: number) {
    if (this.context && this.canvas) {
      this.context.lineWidth = 1;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawMaze();
      this.context.font = "12px serif";
      this.context.fillText(`Скорость X ${Math.abs(this.vx)}`, 5, 10);
      this.context.fillText(`Скорость Y ${Math.abs(this.vy)}`, 5, 20);
      this.setDx(gamma);
      this.setDy(beta);
      this.updateVx();
      this.updateVy();
      this.drawBall();
      const vx = (this.vx * this.ui) / 1000;
      const vy = (this.vy * this.ui) / 1000;
      this.setX(this.x + vx);
      this.setY(this.y + vy);
      if (
        this.x > this.canvas.width - this.ballRadius ||
        this.x < this.ballRadius ||
        this.checkCollision()
      ) {
        this.setX(this.x - vx);
        this.vx = this.lossEnergy(this.vx);
      }
      if (
        this.y > this.canvas.height - this.ballRadius ||
        this.y < this.ballRadius ||
        this.checkCollision()
      ) {
        this.setY(this.y - vy);
        this.vy = this.lossEnergy(this.vy);
      }
    }
  }

  private drawBall() {
    if (this.context && this.canvas) {
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
      this.context.fillStyle = "#2688eb";
      this.context.fill();
      this.context.closePath();
    }
  }
}
