import { useState, useEffect } from 'react';
import type { Project } from '@portfolio/shared';
import './App.css';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [selectedCategory, showFeaturedOnly]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_URL}/projects`;
      const params = new URLSearchParams();

      if (showFeaturedOnly) {
        params.append('featured', 'true');
      }

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch projects');

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web-development', label: 'Web Development' },
    { id: 'backend', label: 'Backend' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'data-science', label: 'Data Science' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'iot', label: 'IoT' },
    { id: 'other', label: 'Other' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1 className="header-title">Kong's Developer Portfolio</h1>
              <p className="header-subtitle">
                Physicist (University of Dortmund) | Software Developer with 15+ Years Experience
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <label className="filter-label">Category:</label>
              <div className="category-buttons">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                />
                <span>Show Featured Only</span>
              </label>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : projects.length === 0 ? (
            <div className="empty">No projects found</div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <article key={project.id} className="project-card">
                  {project.imageUrl && (
                    <div className="project-image">
                      <img src={project.imageUrl} alt={project.title} />
                    </div>
                  )}

                  <div className="project-content">
                    <div className="project-header">
                      <h2 className="project-title">
                        {project.title}
                        {project.featured && <span className="featured-badge">Featured</span>}
                      </h2>
                      <span className={`status-badge status-${project.status}`}>
                        {project.status}
                      </span>
                    </div>

                    <p className="project-description">{project.description}</p>

                    {project.highlights && project.highlights.length > 0 && (
                      <ul className="project-highlights">
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </ul>
                    )}

                    <div className="project-technologies">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="project-meta">
                      <span className="project-date">
                        {formatDate(project.startDate)}
                        {project.endDate && ` - ${formatDate(project.endDate)}`}
                      </span>
                      <span className="project-category">{project.category}</span>
                    </div>

                    <div className="project-links">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Kong. All rights reserved.</p>
          <p className="footer-tech">Built with React, TypeScript, Effect-TS, and AWS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
