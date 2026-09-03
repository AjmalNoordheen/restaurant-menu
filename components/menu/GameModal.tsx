"use client";

import { useEffect, useState } from "react";
import { Ban, Gamepad2, RotateCcw, Trophy, X } from "lucide-react";
import { motion } from "framer-motion";

type GameMode = "memory" | "difference";

type GameModalProps = {
  onClose: () => void;
};

type MemoryCard = {
  id: number;
  icon: string;
  matched: boolean;
};

const memoryIcons = ["🍚", "🌶️", "🥤", "🍦", "🍚", "🌶️", "🥤", "🍦"];

export default function GameModal({ onClose }: GameModalProps) {
  const [game, setGame] = useState<GameMode>("memory");

  useEffect(() => {
    const scrollY = window.scrollY;
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;

    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overscrollBehavior = "none";

    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-contain bg-[#102b24]/60 p-2 backdrop-blur-sm sm:p-5">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        role="dialog"
        aria-modal="true"
        aria-label="Restaurant games"
        className="max-h-[calc(100dvh-1rem)] w-full max-w-lg overscroll-contain overflow-x-hidden overflow-y-auto rounded-3xl bg-[#fffdf9] p-4 shadow-2xl sm:max-h-[92vh] sm:rounded-4xl sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#d8784b]">
              <Gamepad2 size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Table games
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-black text-[#183c32]">
              Take a quick break
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close games"
            className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-[#f0e8db] hover:text-[#183c32]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-[#f5efe5] p-1 sm:mt-6 sm:gap-2">
          <GameChoice
            active={game === "memory"}
            label="Memory match"
            onClick={() => setGame("memory")}
          />
          <GameChoice
            active={game === "difference"}
            label="Find difference"
            onClick={() => setGame("difference")}
          />
        </div>

        {game === "memory" ? <MemoryGame /> : <DifferenceGame />}
      </motion.div>
    </div>
  );
}

function GameChoice({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-0 truncate rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
        active
          ? "bg-[#183c32] text-white shadow-sm"
          : "text-neutral-500 hover:text-[#183c32]"
      }`}
    >
      {label}
    </button>
  );
}

function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>(() => shuffleMemoryCards());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const matchedCount = cards.filter((card) => card.matched).length;
  const finished = matchedCount === cards.length;

  useEffect(() => {
    if (flipped.length !== 2) return;

    const [firstId, secondId] = flipped;
    const first = cards.find((card) => card.id === firstId);
    const second = cards.find((card) => card.id === secondId);

    if (!first || !second) return;

    if (first.icon === second.icon) {
      setCards((current) =>
        current.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, matched: true }
            : card
        )
      );
      setFlipped([]);
      return;
    }

    const timer = window.setTimeout(() => setFlipped([]), 650);
    return () => window.clearTimeout(timer);
  }, [cards, flipped]);

  function flipCard(id: number) {
    if (flipped.length === 2 || flipped.includes(id)) return;
    if (cards.find((card) => card.id === id)?.matched) return;

    setFlipped((current) => [...current, id]);
    setMoves((current) => current + 1);
  }

  function reset() {
    setCards(shuffleMemoryCards());
    setFlipped([]);
    setMoves(0);
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-black text-[#183c32]">Kerala Memory Match</p>
          <p className="mt-1 text-sm text-neutral-500">Find all four pairs.</p>
        </div>
        <div className="text-right text-xs font-bold uppercase tracking-wider text-neutral-400">
          <p>{moves} moves</p>
          <p className="mt-1">{matchedCount / 2}/4 pairs</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const visible = flipped.includes(card.id) || card.matched;

          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => flipCard(card.id)}
              whileTap={{ scale: 0.92 }}
              className={`flex aspect-square items-center justify-center rounded-2xl text-2xl transition-colors sm:text-3xl ${
                visible
                  ? "bg-[#e4b85f] shadow-inner"
                  : "bg-[#183c32] text-[#e4b85f] shadow-md hover:bg-[#285f4e]"
              }`}
              aria-label={visible ? `Food tile ${card.icon}` : "Hidden food tile"}
            >
              {visible ? card.icon : "?"}
            </motion.button>
          );
        })}
      </div>

      {finished && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800"
        >
          <Trophy size={20} />
          <p className="text-sm font-bold">Excellent! You matched every flavour.</p>
        </motion.div>
      )}

      <button
        type="button"
        onClick={reset}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#e8ddce] py-3 text-sm font-bold text-[#183c32] transition-colors hover:bg-[#f5efe5]"
      >
        <RotateCcw size={16} />
        Restart game
      </button>
    </div>
  );
}

function DifferenceGame() {
  const pictureTiles = ["🍚", "🌶️", "🥤", "🍦", "🍋", "☕", "🥥", "🍛", "🌿", "🧂"];
  const [difference, setDifference] = useState(() => randomIndex(30));
  const [round, setRound] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState("");
  const finished = round > 3;

  function chooseTile(picture: number, index: number) {
    if (finished) return;

    if (picture === 1 && index === difference) {
      setMessage("Correct! A new picture is ready.");
      setRound((current) => current + 1);
      setDifference(randomIndex(30));
    } else {
      setMistakes((current) => current + 1);
      setMessage("Not this tile. Look closely.");
    }
  }

  function reset() {
    setDifference(randomIndex(30));
    setRound(1);
    setMistakes(0);
    setMessage("");
  }

  return (
    <div className="mt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-black text-[#183c32]">Find the Difference</p>
          <p className="mt-1 text-sm text-neutral-500">Compare both pictures carefully.</p>
        </div>
        <div className="text-right text-xs font-bold uppercase tracking-wider text-neutral-400">
          <p>Round {Math.min(round, 3)} / 3</p>
          <p className="mt-1">{mistakes} misses</p>
        </div>
      </div>

      {!finished ? (
        <div className="mt-5">
          <div className="mb-2 hidden grid-cols-2 gap-2 text-center text-[10px] font-bold uppercase tracking-widest text-[#9a8f80] sm:grid">
            <span>Picture A · view only</span>
            <span>Picture B · tap here</span>
          </div>
          <div className="grid grid-cols-1 gap-3 rounded-3xl bg-[#c5f1e5] p-2 sm:grid-cols-2 sm:gap-3 sm:p-3">
            {[0, 1].map((picture) => (
              <div
                key={picture}
                aria-disabled={picture === 0}
                className={`relative grid grid-cols-6 gap-1 rounded-2xl bg-[#f5efe5] p-1.5 sm:grid-cols-5 sm:gap-1.5 sm:p-2 ${
                  picture === 0 ? "opacity-80" : ""
                }`}
              >
                {Array.from({ length: 30 }, (_, index) => {
                  const isDifferent = picture === 1 && index === difference;
                  const tile = pictureTiles[(index + round) % pictureTiles.length];

                  const tileContent = isDifferent
                    ? pictureTiles[(index + round + 3) % pictureTiles.length]
                    : tile;
                  const tileClassName = "cursor-pointer flex aspect-square items-center justify-center rounded-md bg-[#fffdf9] text-xl sm:rounded-lg sm:text-xl";

                  if (picture === 0) {
                    return (
                      <div
                        key={`${picture}-${index}`}
                        className={tileClassName}
                      >
                        {tileContent}
                      </div>
                    );
                  }

                  return (
                    <motion.button
                      key={`${picture}-${index}`}
                      type="button"
                      onClick={() => chooseTile(picture, index)}
                      whileTap={{ scale: 0.82 }}
                      className={tileClassName}
                      aria-label={`Picture B, tile ${index + 1}`}
                    >
                      {tileContent}
                    </motion.button>
                  );
                })}
                {picture === 0 && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full bg-white/85 p-2 text-neutral-500 shadow-md">
                      <Ban size={20} />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {message && <p className="mt-3 text-center text-xs font-bold text-[#d8784b]">{message}</p>}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 rounded-3xl bg-[#f5efe5] p-6 text-center"
        >
          <Trophy className="mx-auto text-[#d8784b]" size={38} />
          <p className="mt-3 text-2xl font-black text-[#183c32]">Picture perfect!</p>
          <p className="mt-1 text-sm text-neutral-500">You found all three differences with {mistakes} misses.</p>
        </motion.div>
      )}

      <button
        type="button"
        onClick={reset}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#e8ddce] py-3 text-sm font-bold text-[#183c32] transition-colors hover:bg-[#f5efe5]"
      >
        <RotateCcw size={16} />
        {finished ? "Play again" : "Restart game"}
      </button>
    </div>
  );
}

function shuffleMemoryCards(): MemoryCard[] {
  return memoryIcons
    .map((icon, index) => ({ id: index, icon, matched: false }))
    .sort(() => Math.random() - 0.5);
}

function randomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

