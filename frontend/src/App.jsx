import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useProfileContent } from './content'
import ContactPage from './pages/ContactPage'
import EducationPage from './pages/EducationPage'
import ExperiencePage from './pages/ExperiencePage'
import HomePage from './pages/HomePage'
import IdeasPage from './pages/IdeasPage'
import NotFoundPage from './pages/NotFoundPage'
import PublicationsPage from './pages/PublicationsPage'
import ResearchPage from './pages/ResearchPage'
import SkillsPage from './pages/SkillsPage'
import StoryPage from './pages/StoryPage'
import WorkPage from './pages/WorkPage'

export default function App() {
  const { data, status } = useProfileContent()

  return (
    <BrowserRouter>
      <Layout data={data}>
        <Routes>
          <Route path="/" element={<HomePage data={data} />} />
          <Route path="/story" element={<StoryPage data={data} />} />
          <Route path="/experience" element={<ExperiencePage data={data} />} />
          <Route path="/education" element={<EducationPage data={data} />} />
          <Route path="/skills" element={<SkillsPage data={data} />} />
          <Route path="/publications" element={<PublicationsPage data={data} />} />
          <Route path="/ideas" element={<IdeasPage data={data} />} />
          <Route path="/work" element={<WorkPage data={data} />} />
          <Route path="/research" element={<ResearchPage data={data} />} />
          <Route path="/contact" element={<ContactPage data={data} status={status} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
