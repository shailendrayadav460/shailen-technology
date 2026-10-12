import { useCallback, useEffect, useState } from 'react';
import PostForm from '../../components/admin/PostForm.jsx';
import PostTable from '../../components/admin/PostTable.jsx';
import MessageList from '../../components/admin/MessageList.jsx';
import ServicesManager from '../../components/admin/ServicesManager.jsx';
import WhatWeDoManager from '../../components/admin/WhatWeDoManager.jsx';
import ProjectsManager from '../../components/admin/ProjectsManager.jsx';
import { adminService } from '../../services/adminService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useBlog } from '../../context/BlogContext.jsx';

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const { refresh: refreshPublic } = useBlog();
  const [tab, setTab] = useState('posts');

  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [services, setServices] = useState([]);
  const [whatWeDo, setWhatWeDo] = useState([]);
  const [projects, setProjects] = useState([]);

  const [editingPost, setEditingPost] = useState(null); // null | 'new' | post object
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [p, m, s, w, pr] = await Promise.all([
        adminService.listPosts(),
        adminService.listMessages(),
        adminService.listServices(),
        adminService.listWhatWeDo(),
        adminService.listProjects(),
      ]);
      setPosts(p.posts || []);
      setMessages(m.messages || []);
      setServices(s.services || []);
      setWhatWeDo(w.items || []);
      setProjects(pr.projects || []);
      setError('');
    } catch (err) {
      setError(err.isNetwork ? 'The server is not reachable, so the dashboard cannot load.' : err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ---------- Posts Actions ----------
  async function savePost(data) {
    if (editingPost === 'new') await adminService.createPost(data);
    else await adminService.updatePost(editingPost._id, data);
    setEditingPost(null);
    await Promise.all([load(), refreshPublic()]);
  }

  async function removePost(p) {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await adminService.deletePost(p._id);
      await Promise.all([load(), refreshPublic()]);
    } catch (err) {
      setError(err.message);
    }
  }

  // ---------- Messages Actions ----------
  async function readMsg(m) {
    try {
      await adminService.markRead(m._id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeMsg(m) {
    if (!window.confirm('Delete this message?')) return;
    try {
      await adminService.deleteMessage(m._id);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  // ---------- Services Actions ----------
  async function saveService(id, data) {
    if (!id) await adminService.createService(data);
    else await adminService.updateService(id, data);
    await load();
  }

  async function removeService(s) {
    if (!window.confirm(`Delete service "${s.title}"?`)) return;
    try {
      await adminService.deleteService(s._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  // ---------- What We Do Actions ----------
  async function saveWhatWeDo(id, data) {
    if (!id) await adminService.createWhatWeDo(data);
    else await adminService.updateWhatWeDo(id, data);
    await load();
  }

  async function removeWhatWeDo(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await adminService.deleteWhatWeDo(item._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  // ---------- Projects Actions ----------
  async function saveProject(id, data) {
    if (!id) await adminService.createProject(data);
    else await adminService.updateProject(id, data);
    await load();
  }

  async function removeProject(p) {
    if (!window.confirm(`Delete project "${p.name}"?`)) return;
    try {
      await adminService.deleteProject(p._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const unread = messages.filter((m) => !m.read).length;

  return (
    <section className="section">
      <div className="container">
        <div className="dash-head">
          <div>
            <h1>Dashboard</h1>
            <p className="muted" style={{ margin: 0 }}>
              Logged in as <strong>{admin?.email}</strong>
            </p>
          </div>
          <button className="btn ghost" onClick={logout}>
            Sign out
          </button>
        </div>

        {error && (
          <p className="err" role="alert" style={{ marginTop: '1rem' }}>
            {error}
          </p>
        )}

        <div className="tabs" role="tablist" style={{ marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button role="tab" aria-selected={tab === 'posts'} onClick={() => setTab('posts')}>
            Blog Posts ({posts.length})
          </button>
          <button role="tab" aria-selected={tab === 'services'} onClick={() => setTab('services')}>
            Services ({services.length})
          </button>
          <button role="tab" aria-selected={tab === 'whatwedo'} onClick={() => setTab('whatwedo')}>
            What We Do ({whatWeDo.length})
          </button>
          <button role="tab" aria-selected={tab === 'projects'} onClick={() => setTab('projects')}>
            Selected Work ({projects.length})
          </button>
          <button role="tab" aria-selected={tab === 'messages'} onClick={() => setTab('messages')}>
            Messages ({messages.length}
            {unread ? `, ${unread} new` : ''})
          </button>
        </div>

        {loading && <p className="muted">Loading dashboard data…</p>}

        {/* Tab 1: Posts */}
        {tab === 'posts' &&
          (editingPost ? (
            <PostForm
              initial={editingPost === 'new' ? null : editingPost}
              onSave={savePost}
              onCancel={() => setEditingPost(null)}
            />
          ) : (
            <>
              <p>
                <button className="btn" onClick={() => setEditingPost('new')}>
                  + New post
                </button>
              </p>
              <PostTable posts={posts} onEdit={setEditingPost} onDelete={removePost} />
            </>
          ))}

        {/* Tab 2: Services CRUD */}
        {tab === 'services' && (
          <ServicesManager services={services} onSave={saveService} onDelete={removeService} />
        )}

        {/* Tab 3: What We Do CRUD */}
        {tab === 'whatwedo' && (
          <WhatWeDoManager items={whatWeDo} onSave={saveWhatWeDo} onDelete={removeWhatWeDo} />
        )}

        {/* Tab 4: Selected Work CRUD */}
        {tab === 'projects' && (
          <ProjectsManager projects={projects} onSave={saveProject} onDelete={removeProject} />
        )}

        {/* Tab 5: Messages */}
        {tab === 'messages' && (
          <MessageList messages={messages} onRead={readMsg} onDelete={removeMsg} />
        )}
      </div>
    </section>
  );
}
