'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Eraser, ZoomIn, ZoomOut, Minus, Equal } from 'lucide-react';

interface Atom {
  id: number;
  element: string;
  x: number;
  y: number;
}

interface Bond {
  id: number;
  from: number;
  to: number;
  type: 1 | 2 | 3; // single, double, triple
}

interface StructureEditorProps {
  onStructureChange?: (atoms: Atom[], bonds: Bond[]) => void;
}

const ELEMENTS = ['C', 'N', 'O', 'S', 'P', 'F', 'Cl', 'Br', 'H', 'I'];
const ELEMENT_COLORS: Record<string, string> = {
  C: '#333333', H: '#666666', N: '#3b82f6', O: '#ef4444',
  S: '#eab308', P: '#f97316', F: '#10b981', Cl: '#22c55e',
  Br: '#a855f7', I: '#8b5cf6',
};

const ATOM_RADIUS = 16;
const SNAP_DISTANCE = 25;

export function StructureEditor({ onStructureChange }: StructureEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [atoms, setAtoms] = useState<Atom[]>([]);
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [selectedElement, setSelectedElement] = useState('C');
  const [bondType, setBondType] = useState<1 | 2 | 3>(1);
  const [tool, setTool] = useState<'atom' | 'bond' | 'erase'>('atom');
  const [dragging, setDragging] = useState<{ fromAtomId: number; x: number; y: number } | null>(null);
  const [hoveredAtom, setHoveredAtom] = useState<number | null>(null);
  const [history, setHistory] = useState<{ atoms: Atom[]; bonds: Bond[] }[]>([]);
  const [nextId, setNextId] = useState(1);
  const [scale, setScale] = useState(1);

  const saveHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-20), { atoms: [...atoms], bonds: [...bonds] }]);
  }, [atoms, bonds]);

  const findAtomAt = useCallback((x: number, y: number): Atom | null => {
    return atoms.find((a) => Math.hypot(a.x - x, a.y - y) < SNAP_DISTANCE) || null;
  }, [atoms]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.scale(scale, scale);

    // Grid
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x < w / scale; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h / scale); ctx.stroke();
    }
    for (let y = 0; y < h / scale; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w / scale, y); ctx.stroke();
    }

    // Bonds
    bonds.forEach((bond) => {
      const from = atoms.find((a) => a.id === bond.from);
      const to = atoms.find((a) => a.id === bond.to);
      if (!from || !to) return;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy);
      const nx = -dy / len * 4;
      const ny = dx / len * 4;

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';

      if (bond.type === 1) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      } else if (bond.type === 2) {
        ctx.beginPath();
        ctx.moveTo(from.x + nx, from.y + ny);
        ctx.lineTo(to.x + nx, to.y + ny);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(from.x - nx, from.y - ny);
        ctx.lineTo(to.x - nx, to.y - ny);
        ctx.stroke();
      } else if (bond.type === 3) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(from.x + nx * 1.5, from.y + ny * 1.5);
        ctx.lineTo(to.x + nx * 1.5, to.y + ny * 1.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(from.x - nx * 1.5, from.y - ny * 1.5);
        ctx.lineTo(to.x - nx * 1.5, to.y - ny * 1.5);
        ctx.stroke();
      }
    });

    // Dragging bond preview
    if (dragging) {
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      const fromAtom = atoms.find((a) => a.id === dragging.fromAtomId);
      if (fromAtom) {
        ctx.beginPath();
        ctx.moveTo(fromAtom.x, fromAtom.y);
        ctx.lineTo(dragging.x, dragging.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Atoms
    atoms.forEach((atom) => {
      const isHovered = hoveredAtom === atom.id;
      const color = ELEMENT_COLORS[atom.element] || '#333';

      // Background circle
      ctx.beginPath();
      ctx.arc(atom.x, atom.y, ATOM_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#eff6ff' : '#ffffff';
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#3b82f6' : '#cbd5e1';
      ctx.lineWidth = isHovered ? 2 : 1.5;
      ctx.stroke();

      // Element label
      ctx.fillStyle = color;
      ctx.font = 'bold 14px "Noto Sans KR", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(atom.element, atom.x, atom.y);
    });

    ctx.restore();
  }, [atoms, bonds, dragging, hoveredAtom, scale]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => { onStructureChange?.(atoms, bonds); }, [atoms, bonds, onStructureChange]);

  const getCanvasCoords = (e: React.MouseEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoords(e);
    const atom = findAtomAt(x, y);

    if (tool === 'erase') {
      if (atom) {
        saveHistory();
        setAtoms((prev) => prev.filter((a) => a.id !== atom.id));
        setBonds((prev) => prev.filter((b) => b.from !== atom.id && b.to !== atom.id));
      }
      return;
    }

    if (tool === 'bond' && atom) {
      setDragging({ fromAtomId: atom.id, x: atom.x, y: atom.y });
      return;
    }

    if (tool === 'atom') {
      if (atom) {
        // Start bond from existing atom
        setDragging({ fromAtomId: atom.id, x: atom.x, y: atom.y });
      } else {
        // Place new atom
        saveHistory();
        const newAtom: Atom = { id: nextId, element: selectedElement, x, y };
        setAtoms((prev) => [...prev, newAtom]);
        setNextId((prev) => prev + 1);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoords(e);
    const atom = findAtomAt(x, y);
    setHoveredAtom(atom?.id ?? null);

    if (dragging) {
      setDragging((prev) => prev ? { ...prev, x, y } : null);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragging) return;
    const { x, y } = getCanvasCoords(e);
    const targetAtom = findAtomAt(x, y);

    if (targetAtom && targetAtom.id !== dragging.fromAtomId) {
      // Create bond to existing atom
      const exists = bonds.some(
        (b) => (b.from === dragging.fromAtomId && b.to === targetAtom.id) ||
               (b.from === targetAtom.id && b.to === dragging.fromAtomId)
      );
      if (!exists) {
        saveHistory();
        setBonds((prev) => [...prev, { id: nextId, from: dragging.fromAtomId, to: targetAtom.id, type: bondType }]);
        setNextId((prev) => prev + 1);
      }
    } else if (!targetAtom && Math.hypot(x - atoms.find((a) => a.id === dragging.fromAtomId)!.x, y - atoms.find((a) => a.id === dragging.fromAtomId)!.y) > SNAP_DISTANCE) {
      // Create new atom + bond
      saveHistory();
      const newAtom: Atom = { id: nextId, element: selectedElement, x, y };
      const newBond: Bond = { id: nextId + 1, from: dragging.fromAtomId, to: nextId, type: bondType };
      setAtoms((prev) => [...prev, newAtom]);
      setBonds((prev) => [...prev, newBond]);
      setNextId((prev) => prev + 2);
    }

    setDragging(null);
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (last) {
      setAtoms(last.atoms);
      setBonds(last.bonds);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const clearAll = () => {
    saveHistory();
    setAtoms([]);
    setBonds([]);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-3 p-2 bg-gray-50 rounded-lg border border-[var(--border)] flex-wrap">
        {/* Tool selection */}
        <div className="flex items-center gap-0.5 mr-2">
          {(['atom', 'bond', 'erase'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={`h-8 px-3 text-xs font-medium rounded transition-colors ${
                tool === t ? 'bg-blue-600 text-white' : 'bg-white border border-[var(--border)] text-[var(--text)] hover:bg-blue-50'
              }`}
            >
              {t === 'atom' ? '원소' : t === 'bond' ? '결합' : '지우기'}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        {/* Element buttons */}
        {ELEMENTS.map((el) => (
          <button
            key={el}
            onClick={() => { setSelectedElement(el); setTool('atom'); }}
            className={`w-8 h-8 text-xs font-bold rounded transition-colors ${
              selectedElement === el && tool === 'atom'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-[var(--border)] hover:bg-blue-50'
            }`}
            style={{ color: selectedElement === el && tool === 'atom' ? 'white' : ELEMENT_COLORS[el] }}
          >
            {el}
          </button>
        ))}

        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        {/* Bond type */}
        {([1, 2, 3] as const).map((bt) => (
          <button
            key={bt}
            onClick={() => { setBondType(bt); setTool('bond'); }}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
              bondType === bt && tool === 'bond'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-[var(--border)] text-[var(--text)] hover:bg-blue-50'
            }`}
            title={bt === 1 ? '단일 결합' : bt === 2 ? '이중 결합' : '삼중 결합'}
          >
            {bt === 1 ? <Minus size={14} /> : bt === 2 ? <Equal size={14} /> : <span className="text-[10px] font-bold">///</span>}
          </button>
        ))}

        <div className="w-px h-6 bg-[var(--border)] mx-1" />

        {/* Actions */}
        <button onClick={undo} className="w-8 h-8 flex items-center justify-center bg-white border border-[var(--border)] rounded hover:bg-blue-50" title="되돌리기">
          <RotateCcw size={14} className="text-[var(--text-secondary)]" />
        </button>
        <button onClick={clearAll} className="w-8 h-8 flex items-center justify-center bg-white border border-[var(--border)] rounded hover:bg-red-50" title="전체 지우기">
          <Eraser size={14} className="text-[var(--text-secondary)]" />
        </button>
        <button onClick={() => setScale((s) => Math.min(2, s + 0.1))} className="w-8 h-8 flex items-center justify-center bg-white border border-[var(--border)] rounded hover:bg-blue-50" title="확대">
          <ZoomIn size={14} className="text-[var(--text-secondary)]" />
        </button>
        <button onClick={() => setScale((s) => Math.max(0.5, s - 0.1))} className="w-8 h-8 flex items-center justify-center bg-white border border-[var(--border)] rounded hover:bg-blue-50" title="축소">
          <ZoomOut size={14} className="text-[var(--text-secondary)]" />
        </button>

        {/* Stats */}
        <span className="ml-auto text-[10px] text-[var(--text-secondary)]">
          원자 {atoms.length}개 / 결합 {bonds.length}개
        </span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={660}
        height={280}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setDragging(null); setHoveredAtom(null); }}
        className="w-full border-2 border-[var(--border)] rounded-xl bg-white cursor-crosshair"
        style={{ height: '280px' }}
      />

      {/* Help */}
      <div className="mt-2 flex items-center gap-4 text-[10px] text-[var(--text-secondary)]">
        <span>클릭: 원소 배치</span>
        <span>드래그: 결합 생성</span>
        <span>원소 위에서 드래그: 기존 원소에 결합</span>
      </div>
    </div>
  );
}
