import { createRoot } from 'react-dom/client'
import App from './App'
import AppLoader from './components/AppLoader'
import { useAppBoot } from './hooks/useAppBoot'
import './styles/theme.css'
import './index.css'

if (import.meta.env.PROD) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true })
  })
}

function Root() {
  const { ready, progress } = useAppBoot()

  return (
    <>
      <AppLoader visible={!ready} progress={progress} />
      <div className={`app-root${ready ? ' app-root--ready' : ''}`}>
        <App />
      </div>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <Root />,
)
