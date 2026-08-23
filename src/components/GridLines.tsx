import './GridLines.css'

interface GridLinesProps {
  visible?: boolean
}

export default function GridLines({ visible = true }: GridLinesProps) {
  return (
    <div className={`grid-lines ${visible ? 'visible' : ''}`}>
      <div className="grid-line" />
      <div className="grid-line" />
      <div className="grid-line" />
      <div className="grid-line" />
    </div>
  )
}
