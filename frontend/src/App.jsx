import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Design the dashboard",
    description: "Create a clean and modern application layout.",
    priority: "High",
    status: "In Progress",
    category: "Design",
    dueDate: "2026-10-15",
  },
  {
    id: 2,
    title: "Learn React components",
    description: "Understand props, state, and reusable components.",
    priority: "Medium",
    status: "To Do",
    category: "Learning",
    dueDate: "2026-10-17",
  },
  {
    id: 3,
    title: "Set up the project",
    description: "Initialize the project and install dependencies.",
    priority: "High",
    status: "Completed",
    category: "Development",
    dueDate: "2026-10-12",
  },
  {
    id: 4,
    title: "Plan database structure",
    description: "Prepare the collections needed for task storage.",
    priority: "Low",
    status: "To Do",
    category: "Development",
    dueDate: "2026-10-20",
  },
];

const filters = ["All Tasks", "To Do", "In Progress", "Completed"];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeFilter, setActiveFilter] = useState("All Tasks");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Development",
    dueDate: "",
  });

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesFilter =
        activeFilter === "All Tasks" ||
        task.status === activeFilter;

      const query = search.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [tasks, activeFilter, search]);

  function handleAddTask(event) {
    event.preventDefault();

    if (!newTask.title.trim()) return;

    const task = {
      ...newTask,
      id: Date.now(),
      status: "To Do",
    };

    setTasks((current) => [task, ...current]);
    setNewTask({
      title: "",
      description: "",
      priority: "Medium",
      category: "Development",
      dueDate: "",
    });
    setShowForm(false);
    setActiveFilter("All Tasks");
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === "Completed"
                  ? "To Do"
                  : "Completed",
            }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home">
          <span className="brand-mark">T</span>
          <span>taskflow<span className="brand-dot">.</span></span>
        </a>

        <p className="sidebar-label">WORKSPACE</p>

        <button className="nav-item active">
          <span>▦</span> Overview
        </button>
        <button
          className={`nav-item ${
            activeFilter === "All Tasks" ? "" : ""
          }`}
          onClick={() => setActiveFilter("All Tasks")}
        >
          <span>☷</span> My Tasks
          <span className="nav-count">{tasks.length}</span>
        </button>
        <button
          className="nav-item"
          onClick={() => setActiveFilter("Completed")}
        >
          <span>✓</span> Completed
        </button>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <span className="upgrade-icon">✦</span>
            <h3>Stay on track</h3>
            <p>Small steps lead to big achievements.</p>
            <div className="upgrade-track">
              <span
                style={{
                  width: `${
                    tasks.length
                      ? (completedCount / tasks.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <small>
              {completedCount} of {tasks.length} tasks completed
            </small>
          </div>

          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <strong>My Workspace</strong>
              <small>Personal account</small>
            </div>
            <span className="profile-menu">···</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>Overview</strong>
          </div>
          <div className="topbar-right">
            <span className="date-label">{today}</span>
            <div className="top-avatar">S</div>
          </div>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
              <h1>Good work starts here<span>.</span></h1>
              <p className="welcome-subtitle">
                Organize your day, focus on what matters, and get things done.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => setShowForm(!showForm)}
            >
              <span>＋</span> New task
            </button>
          </div>

          <section className="stats-grid">
            <article className="stat-card">
              <div className="stat-top">
                <span>Total tasks</span>
                <span className="stat-icon purple">☷</span>
              </div>
              <strong>{tasks.length}</strong>
              <p>Tasks in your workspace</p>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>In progress</span>
                <span className="stat-icon blue">◷</span>
              </div>
              <strong>
                {tasks.filter((t) => t.status === "In Progress").length}
              </strong>
              <p>Work currently underway</p>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Completed</span>
                <span className="stat-icon green">✓</span>
              </div>
              <strong>{completedCount}</strong>
              <p>Tasks you've finished</p>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>To do</span>
                <span className="stat-icon orange">◎</span>
              </div>
              <strong>
                {tasks.filter((t) => t.status === "To Do").length}
              </strong>
              <p>Waiting for your attention</p>
            </article>
          </section>

          {showForm && (
            <section className="task-form-card">
              <div className="section-heading">
                <div>
                  <h2>Create a task</h2>
                  <p>Add something you want to accomplish.</p>
                </div>
                <button
                  className="close-button"
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddTask}>
                <label>
                  Task title *
                  <input
                    autoFocus
                    required
                    maxLength={120}
                    placeholder="e.g. Finish the homepage"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        title: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Description
                  <textarea
                    maxLength={500}
                    placeholder="What needs to get done?"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        description: e.target.value,
                      })
                    }
                  />
                </label>

                <div className="form-grid">
                  <label>
                    Priority
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          priority: e.target.value,
                        })
                      }
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </label>

                  <label>
                    Due date
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({
                          ...newTask,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <label>
                  Category
                  <select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        category: e.target.value,
                      })
                    }
                  >
                    <option>Development</option>
                    <option>Design</option>
                    <option>Learning</option>
                    <option>Personal</option>
                  </select>
                </label>

                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button className="primary-button" type="submit">
                    Create task
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="tasks-section">
            <div className="section-heading">
              <div>
                <h2>Your tasks</h2>
                <p>Keep your priorities clear and your progress moving.</p>
              </div>
              <span className="task-total">
                {filteredTasks.length} tasks
              </span>
            </div>

            <div className="task-toolbar">
              <div className="filter-tabs">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={
                      activeFilter === filter ? "filter active-filter" : "filter"
                    }
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                    {filter === "All Tasks" && (
                      <span className="filter-count">{tasks.length}</span>
                    )}
                  </button>
                ))}
              </div>

              <input
                className="search-input"
                type="search"
                placeholder="⌕  Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tasks"
              />
            </div>

            <div className="task-list">
              {filteredTasks.map((task) => (
                <article className="task-card" key={task.id}>
                  <button
                    className={`task-check ${
                      task.status === "Completed" ? "checked" : ""
                    }`}
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.status === "Completed"
                        ? "Mark task incomplete"
                        : "Complete task"
                    }
                  >
                    {task.status === "Completed" ? "✓" : ""}
                  </button>

                  <div className="task-main">
                    <h3
                      className={
                        task.status === "Completed" ? "completed-title" : ""
                      }
                    >
                      {task.title}
                    </h3>
                    <p>{task.description || "No description added."}</p>
                    <div className="task-meta">
                      <span className="category-tag">{task.category}</span>
                      {task.dueDate && (
                        <span className="due-date">
                          ◷{" "}
                          {new Date(
                            `${task.dueDate}T12:00:00`
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="task-right">
                    <span
                      className={`priority priority-${task.priority.toLowerCase()}`}
                    >
                      <span>●</span> {task.priority}
                    </span>
                    <span
                      className={`status status-${task.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {task.status}
                    </span>
                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete ${task.title}`}
                      title="Delete task"
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}

              {filteredTasks.length === 0 && (
                <div className="empty-state">
                  <span>☷</span>
                  <h3>No tasks found</h3>
                  <p>Try another search or create a new task.</p>
                  <button
                    className="primary-button"
                    onClick={() => setShowForm(true)}
                  >
                    ＋ Create a task
                  </button>
                </div>
              )}
            </div>
          </section>

          <footer className="page-footer">
            <span>✦ Made for focused work.</span>
            <span>TaskFlow · Your progress, your pace.</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
