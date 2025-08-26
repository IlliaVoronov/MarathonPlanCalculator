import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import QuestionsPage from './pages/QuestionsPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import { QuestionsProvider } from './components/QuestionsContext.tsx'

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/questions", element: <QuestionsPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuestionsProvider>
      <RouterProvider router={router} />
    </QuestionsProvider>
  </StrictMode>,
)
