export default class Ball {
  public x: number = 0;
  public y: number = 0;
  public radius = 15;
  private ballRadius = 10;
  private canvasId: string = "";
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private dx: number = 2;
  private dy: number = -2;

  constructor(canvasId: string) {
    this.canvasId = canvasId;
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
        canvas.height = mainHeight - headerHeight;
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
  setDx(dx: number): void {
    this.dx = dx;
  }

  /**
   * @description движение по y
   */
  setDy(dy: number): void {
    this.dy = dy;
  }

  public draw(gX: number, gY: number) {
    if (gX !== this.dx) {
      this.setDx(gX);
    }
    if (gY !== this.dy) {
      this.setDy(gY);
    }
    if (this.context && this.canvas) {
      this.context.lineWidth = 1;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBall();

      if (
        this.x + this.dx > this.canvas.width - this.ballRadius ||
        this.x + this.dx < this.ballRadius
      ) {
        this.setDx(-this.dx);
      }
      if (
        this.y + this.dy > this.canvas.height - this.ballRadius ||
        this.y + this.dy < this.ballRadius
      ) {
        this.setDy(-this.dy);
      }

      this.setX(this.x + this.dx);
      this.setY(this.y + this.dy);
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
