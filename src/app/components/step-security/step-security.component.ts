import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SecurityMethod } from '../../services/security.service';

export interface SecurityData {
  method: SecurityMethod;
  pinValue?: string;
  patternPoints?: number[];
  securityQuestion?: string;
  securityAnswer?: string;
}

@Component({
  selector: 'app-step-security',
  templateUrl: './step-security.component.html',
  styleUrls: ['./step-security.component.scss'],
  standalone: false
})
export class StepSecurityComponent {
  @Input() isSaving = false;
  @Input() error = '';

  @Output() save = new EventEmitter<SecurityData>();
  @Output() back = new EventEmitter<void>();

  selectedMethod: SecurityMethod | null = null;

  // PIN
  pinValue = '';
  pinConfirm = '';

  // Patrón
  patternPoints: number[] = [];
  patternConfirm: number[] = [];
  patternPhase: 'draw' | 'confirm' = 'draw';
  patternLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  pointPositions: { [key: number]: { x: number; y: number } } = {};
  isDrawing = false;

  // Pregunta
  securityQuestion = '';
  securityAnswer = '';
  securityAnswerConfirm = '';

  localError = '';

  selectMethod(method: SecurityMethod) {
    this.selectedMethod = method;
    this.localError = '';
    this.resetAll();
  }

  resetAll() {
    this.pinValue = ''; this.pinConfirm = '';
    this.patternPoints = []; this.patternConfirm = [];
    this.patternPhase = 'draw'; this.patternLines = [];
    this.pointPositions = {};
    this.securityQuestion = ''; this.securityAnswer = ''; this.securityAnswerConfirm = '';
  }

  // ── Patrón ──
  startPattern(point: number, event: any) {
    this.resetPattern();
    this.isDrawing = true;
    this.addPoint(point, event);
  }

  movePattern(event: any) {
    if (!this.isDrawing) return;
    const touch = event.touches ? event.touches[0] : event;
    const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
    if (!element) return;
    const pointAttr = element.getAttribute('data-point');
    if (!pointAttr) return;
    this.addPoint(Number(pointAttr), { target: element });
  }

  endPattern() { this.isDrawing = false; }

  addPoint(point: number, event: any) {
    const current = this.patternPhase === 'draw' ? this.patternPoints : this.patternConfirm;
    if (current.includes(point)) return;
    const rect = event.target.getBoundingClientRect();
    const newPos = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    this.pointPositions[point] = newPos;
    if (current.length > 0) {
      const prev = this.pointPositions[current[current.length - 1]];
      this.patternLines.push({ x1: prev.x, y1: prev.y, x2: newPos.x, y2: newPos.y });
    }
    current.push(point);
  }

  resetPattern() {
    if (this.patternPhase === 'draw') this.patternPoints = [];
    else this.patternConfirm = [];
    this.patternLines = [];
    this.pointPositions = {};
  }

  confirmPattern() {
    if (this.patternPoints.length < 4) {
      this.localError = 'El patrón debe tener al menos 4 puntos.';
      return;
    }
    this.localError = '';
    this.patternPhase = 'confirm';
  }

  isPointActive(point: number): boolean {
    const current = this.patternPhase === 'draw' ? this.patternPoints : this.patternConfirm;
    return current.includes(point);
  }

  getPointOrder(point: number): number {
    const current = this.patternPhase === 'draw' ? this.patternPoints : this.patternConfirm;
    return current.indexOf(point) + 1;
  }

  patternToString(points: number[]): string {
    return points.join('-');
  }

  onSave() {
    this.localError = '';

    if (!this.selectedMethod) {
      this.localError = 'Debes elegir un método de seguridad.';
      return;
    }

    if (this.selectedMethod === 'pin') {
      if (!/^\d{4}$/.test(this.pinValue)) { this.localError = 'El PIN debe tener exactamente 4 dígitos.'; return; }
      if (this.pinValue !== this.pinConfirm) { this.localError = 'Los PINs no coinciden.'; return; }
    }

    if (this.selectedMethod === 'pattern') {
      if (this.patternPoints.length < 4) { this.localError = 'El patrón debe tener al menos 4 puntos.'; return; }
      if (this.patternToString(this.patternPoints) !== this.patternToString(this.patternConfirm)) {
        this.localError = 'Los patrones no coinciden.'; return;
      }
    }

    if (this.selectedMethod === 'question') {
      if (!this.securityQuestion.trim() || !this.securityAnswer.trim()) { this.localError = 'Completa la pregunta y la respuesta.'; return; }
      if (this.securityAnswer.trim() !== this.securityAnswerConfirm.trim()) { this.localError = 'Las respuestas no coinciden.'; return; }
    }

    this.save.emit({
      method: this.selectedMethod,
      pinValue: this.pinValue,
      patternPoints: this.patternPoints,
      securityQuestion: this.securityQuestion,
      securityAnswer: this.securityAnswer,
    });
  }
}