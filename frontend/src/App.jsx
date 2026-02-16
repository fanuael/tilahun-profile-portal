import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout-new'
import { useProfileContent } from './content'
import ContactPage from './pages/ContactPage'
import EducationPage from './pages/EducationPage'
import ExperiencePage from './pages/ExperiencePage'
import HomePage from './pages/HomePage'
import IdeasPage from './pages/IdeasPage'
import InsightsPage from './pages/InsightsPage'
import NotFoundPage from './pages/NotFoundPage'
import PassionPage from './pages/PassionPage'
import ArticlesPage from './pages/ArticlesPage'
import ResearchPage from './pages/ResearchPage'
import ResumePage from './pages/ResumePage'
import SkillsPage from './pages/SkillsPage'
import StoryPage from './pages/StoryPage'
import WorkPage from './pages/WorkPage'

export default function App() {
  const { data, status, error, refresh, source } = useProfileContent()

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout data={data}>
        {status === 'error' && (
          <section className="py-3 section-surface" aria-label="Content sync error">
            <div className="container">
              <div className="alert alert-warning d-flex flex-column flex-md-row align-items-md-center gap-3 mb-0" role="alert">
                <span>{error || 'Unable to load live content from backend.'}</span>
                <button className="btn btn-outline-gold btn-sm" type="button" onClick={refresh}>
                  Retry Sync
                </button>
              </div>
            </div>
          </section>
        )}
        <Routes>
          <Route path="/" element={<HomePage data={data} />} />
          <Route path="/story" element={<StoryPage data={data} />} />
          <Route path="/experience" element={<ExperiencePage data={data} />} />
          <Route path="/education" element={<EducationPage data={data} />} />
          <Route path="/skills" element={<SkillsPage data={data} />} />
          <Route path="/resume" element={<ResumePage data={data} />} />
          <Route path="/passion" element={<PassionPage data={data} />} />
          <Route path="/publications" element={<Navigate to="/research" replace />} />
          <Route path="/articles" element={<ArticlesPage data={data} />} />
          <Route path="/insights" element={<InsightsPage data={data} />} />
          <Route path="/ideas" element={<IdeasPage data={data} />} />
          <Route path="/work" element={<WorkPage data={data} />} />
          <Route path="/research" element={<ResearchPage data={data} />} />
          <Route path="/contact" element={<ContactPage data={data} status={status} source={source} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
