import './Decorations.css'

interface DecorationsProps {
  visible: boolean
}

export default function Decorations({ visible }: DecorationsProps) {
  return (
    <div className={`decorations ${visible ? 'visible' : ''}`}>
      <img src="/assets/shrimp.png" alt="" className="decoration decoration-shrimp" />
      <img src="/assets/tomatoes.png" alt="" className="decoration decoration-tomatoes" />
    </div>
  )
}
