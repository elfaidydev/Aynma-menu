import './ScrollRails.css'

interface ScrollRailsProps {
  activeIndex: number
  itemCount: number
}

function Rail({ canUp, canDown }: { canUp: boolean; canDown: boolean }) {
  return (
    <div className="scroll-rail__capsule" aria-hidden>
      <div className={`scroll-rail__node scroll-rail__node--up${canUp ? '' : ' is-off'}`}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 6 L12 16 M7 11 L12 6 L17 11"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="scroll-rail__label">أعلى</span>
      </div>

      <div className="scroll-rail__track">
        <span className="scroll-rail__beam scroll-rail__beam--down" />
        <span className="scroll-rail__beam scroll-rail__beam--up" />
      </div>

      <div className={`scroll-rail__node scroll-rail__node--down${canDown ? '' : ' is-off'}`}>
        <span className="scroll-rail__label">أسفل</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 18 L12 8 M7 13 L12 18 L17 13"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default function ScrollRails({ activeIndex, itemCount }: ScrollRailsProps) {
  const canDown = activeIndex < itemCount - 1
  const canUp = true

  return (
    <>
      <aside className="scroll-rail scroll-rail--left" aria-label="اسحب للأعلى أو للأسفل">
        <Rail canUp={canUp} canDown={canDown} />
      </aside>
      <aside className="scroll-rail scroll-rail--right" aria-hidden>
        <Rail canUp={canUp} canDown={canDown} />
      </aside>
    </>
  )
}
